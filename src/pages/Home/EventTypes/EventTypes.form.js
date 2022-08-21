import React from "react";
import * as R from "ramda";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, FieldArray } from "formik";
import {
  Button,
  Card,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
  Modal,
  Switch,
} from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDayjs";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import BackspaceIcon from "@mui/icons-material/Backspace";
import {
  ActionGrid,
  Form,
  FormControl,
  IconTextButton,
  Input,
  Text,
} from "components/UI";
import { EventTypesService } from "services/EventTypes.service";
import { AssetsService } from "services/Assets.service";
import {
  isFormValid,
  validateString,
  validateNumber,
  validateTimeSpan,
} from "utils/validators";
import FileUpload from "react-material-file-upload";
import dayjs from "dayjs";
import ModalBox from "components/UI/ModalBox";

const defaultInitialValues = {
  name: "",
  defaultCost: 0,
  defaultPrize: 0,
  at: [{ start: "", duration: { minutes: 0, hours: 0, days: 0 } }],
};

const baseInputs = [
  {
    field: "name",
    label: "Name",
    extra: { required: true, minLength: 1, maxLength: 24 },
  },
  {
    field: "defaultCost",
    label: "Default Cost",
    extra: { required: true, min: 1, type: "number" },
  },
  {
    field: "defaultPrize",
    label: "Default Prize",
    extra: { required: true, min: 1, type: "number" },
  },
  {
    field: "elements",
    label: "Elements",
    extra: { required: true, min: 1, type: "number" },
  },
  {
    field: "minValue",
    label: "Minimum Value",
    extra: {
      required: true,
      minLength: 1,
      maxLength: 4,
      pattern: "([0-9])|([0-9][0-9])|([0-9][0-9][0-9])",
    },
  },
  {
    field: "maxValue",
    label: "Maximum Value",
    extra: {
      required: true,
      minLength: 1,
      maxLength: 4,
      pattern: "([0-9])|([0-9][0-9])|([0-9][0-9][0-9])",
    },
  },
  {
    field: "frequency",
    label: "Generation Frequency",
    extra: {
      required: true,
    },
  },
];

const durationInputs = [
  { name: "days", label: "Days" },
  { name: "hours", label: "Hours" },
  { name: "minutes", label: "Minutes" },
];

const EventTypesForm = () => {
  const service = EventTypesService();
  const assetsService = AssetsService();
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialValues, setInitialValues] = React.useState(null);
  const [images, setImages] = React.useState({ image: "" });
  const [imageModal, setImageModal] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  const goBack = () => navigate("/dashboard/event-types");

  const validate = (values) => {
    const errors = R.pipe(
      R.map(({ field, label, extra }) =>
        R.pipe(
          R.propOr("", "type"),
          R.ifElse(
            R.equals("number"),
            R.always(validateNumber),
            R.always(validateString)
          ),
          (fn) => fn(values[field], label, extra)
        )(extra)
      ),
      R.mergeAll,
      R.assoc("code", validateTimeSpan(values.at, "Event Moment"))
    )(baseInputs);

    return isFormValid(errors) ? null : errors;
  };

  const onSubmit = (values, { setSubmitting }) => {
    const payload = R.over(
      R.lensProp("at"),
      R.pipe(
        R.defaultTo([]),
        R.map(
          R.over(
            R.lensProp("start"),
            R.pipe(R.defaultTo(dayjs()), (value) => value.format())
          )
        )
      ),
      values
    );
    const fn = id ? service.create(payload) : service.update(id, payload);
    setSubmitting(true);
    Promise.resolve(fn).finally(() => setSubmitting(false));
  };

  const handleFileUpload = (handleChange) => {
    return ([file]) => {
      if (!file) {
        return;
      }
      const reader = new window.FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const payload = {
          content: reader.result,
          type: R.pipe(
            R.split(":"),
            R.propOr("", 1),
            R.split(";"),
            R.head
          )(reader.result),
        };
        assetsService
          .createAt("event-types", payload)
          .then(R.propOr(reader.result, "Key"))
          .then((Key) =>
            assetsService.getById(Key).then((value) => {
              setImages({ image: value });
              setImageModal("");
              handleChange({
                target: {
                  id: "image",
                  name: "image",
                  value: `${process.env.SERVER_URI}${Key}`,
                },
              });
            })
          );
      };
    };
  };

  const transformInitialValues = R.over(
    R.lensProp("at"),
    R.pipe(
      R.defaultTo([]),
      R.map(
        R.pipe(
          R.over(R.lensPath(["duration", "hours"]), R.defaultTo(0)),
          R.over(R.lensPath(["duration", "days"]), R.defaultTo(0)),
          R.over(R.lensPath(["duration", "minutes"]), R.defaultTo(0)),
          R.over(
            R.lensProp("start"),
            R.ifElse(
              R.is(String),
              (value) => {
                return dayjs(new Date(`2020-01-01 ${value}`));
              },
              R.defaultTo(dayjs())
            )
          )
        )
      )
    )
  );

  React.useEffect(() => {
    setLoading(true);
    if (!id) {
      setInitialValues(defaultInitialValues);
      setLoading(false);
      return;
    }

    service
      .getById(id)
      .then(transformInitialValues)
      .then(async (value) => {
        if (value.image) {
          if (R.propOr("", "image", value).startsWith("http")) {
            setImages({ image: value.image });
          } else {
            await assetsService.getById(value.image).then((data) => {
              setImages({ image: data });
            });
          }
        }
        setInitialValues(value);
      })
      .catch(goBack);
  }, [id]);

  if (!initialValues && loading) {
    return <CircularProgress color="primary" />;
  }

  return (
    <Formik
      initialValues={initialValues || {}}
      validate={validate}
      onSubmit={onSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <Form onSubmit={handleSubmit}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Text variant="h4">
                {id ? `Event Type: ${id}` : "New Event Type"}
              </Text>
            </Grid>
            <Grid item xs={12}>
              <Text>Data</Text>
            </Grid>
            <Grid item xs={12}>
              <Text>Image</Text>
              {images.image ? (
                <Button type="button" onClick={() => setImageModal("view")}>
                  View
                </Button>
              ) : null}
              <Button type="button" onClick={() => setImageModal("change")}>
                Change
              </Button>
            </Grid>
            {baseInputs.map((input) => (
              <Grid item xs={4} key={`${input.field}-error-text`}>
                <FormControl
                  variant="filled"
                  error={errors[input.field] && touched[input.field]}
                >
                  <Input
                    label={input.label}
                    id={input.field}
                    name={input.field}
                    value={values[input.field]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    describedby={`${input.field}-error-text`}
                    error={errors[input.field]}
                    {...(input.extra || {})}
                  />
                </FormControl>
              </Grid>
            ))}
            <Grid item xs={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(values.disabled)}
                    name="disabled"
                    onChange={handleChange}
                  />
                }
                label={<Text>Disabled</Text>}
              />
            </Grid>
            <Grid item xs={12} />
            <FieldArray name="at">
              {({ remove, push }) => (
                <>
                  <Grid item xs={12}>
                    <Text>Event moment</Text>
                  </Grid>
                  {(values.at || []).map((value, index) => (
                    <Grid
                      container
                      item
                      xs={12}
                      spacing={6}
                      key={`at-${index}`}
                    >
                      <Grid item xs={2}>
                        <FormControl variant="filled">
                          <LocalizationProvider dateAdapter={DateAdapter}>
                            <TimePicker
                              label="Starts at"
                              onChange={(startValue) =>
                                handleChange({
                                  target: {
                                    id: `at.${index}.start`,
                                    name: `at.${index}.start`,
                                    value: startValue,
                                  },
                                })
                              }
                              value={value.start}
                              renderInput={(params) => {
                                return (
                                  <Input
                                    {...params}
                                    name={`at.${index}.start`}
                                    required
                                  />
                                );
                              }}
                            />
                          </LocalizationProvider>
                        </FormControl>
                      </Grid>
                      {durationInputs.map((duration, idx) => (
                        <Grid
                          item
                          xs={1}
                          key={`${index}-${idx}-${duration.name}`}
                        >
                          <FormControl variant="filled">
                            <Input
                              type="number"
                              {...duration}
                              name={`at.${index}.duration.${duration.name}`}
                              value={value.duration[duration.name] || 0}
                            />
                          </FormControl>
                        </Grid>
                      ))}
                      <Grid item xs={7}>
                        <IconButton
                          onClick={() => remove(index)}
                          variant="contained"
                          color="error"
                        >
                          <ClearIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                  <Grid item xs="12">
                    <IconTextButton
                      variant="contained"
                      color="success"
                      onClick={() =>
                        push({
                          start: "",
                          duration: { minutes: 0, hours: 0, days: 0 },
                        })
                      }
                    >
                      <AddIcon /> Add event moment
                    </IconTextButton>
                  </Grid>
                </>
              )}
            </FieldArray>
          </Grid>
          <ActionGrid item xs={2}>
            <IconTextButton
              variant="contained"
              color="secondary"
              disabled={isSubmitting}
              onClick={goBack}
            >
              <BackspaceIcon />
              Go Back
            </IconTextButton>
            <IconTextButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              <SaveIcon /> Save
            </IconTextButton>
          </ActionGrid>
          <Modal open={imageModal} onClose={() => setImageModal("")}>
            <ModalBox>
              <Card variant="outlined">
                {imageModal === "change" ? (
                  <FileUpload onChange={handleFileUpload(handleChange)} />
                ) : null}
                {imageModal === "view" ? (
                  <img src={images.image} width="400" height="300" />
                ) : null}
              </Card>
            </ModalBox>
          </Modal>
        </Form>
      )}
    </Formik>
  );
};

export default EventTypesForm;
