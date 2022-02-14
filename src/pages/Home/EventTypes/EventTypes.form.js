import React from "react";
import * as R from "ramda";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, FieldArray } from "formik";
import {
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
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
import {
  isFormValid,
  validateString,
  validateNumber,
  validateTimeSpan,
} from "utils/validators";

const defaultInitialValues = {
  name: "",
  defaultCost: 0,
  defaultPrize: 0,
  at: [{ name: "", duration: { minutes: 0, hours: 0, days: 0 } }],
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
      maxLength: 3,
      pattern: "([0-9])|([0-9][0-9])|([0-9][0-9][0-9])",
    },
  },
  {
    field: "maxValue",
    label: "maxValue",
    extra: {
      required: true,
      minLength: 1,
      maxLength: 3,
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
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialValues, setInitialValues] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const goBack = () => navigate("/event-types");

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
      R.assoc("at", validateTimeSpan(values.at, "Event Moment"))
    )(baseInputs);

    return isFormValid(errors) ? null : errors;
  };

  const onSubmit = (values, { setSubmitting }) => {
    const fn = id ? service.create(values) : service.update(id, values);
    Promise.resolve(fn).finally(() => setSubmitting(true));
  };

  React.useEffect(() => {
    setLoading(true);
    if (!id) {
      setInitialValues(defaultInitialValues);
      setLoading(false);
      return;
    }

    service.getById(id).then(setInitialValues).catch(goBack);
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
                    checked={!R.isEmpty(values.disabled)}
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
                              renderInput={(params) => (
                                <Input
                                  {...params}
                                  name={`at.${index}.start`}
                                  value={value.start}
                                  required
                                />
                              )}
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
                              value={value.duration[duration.name]}
                              required
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
        </Form>
      )}
    </Formik>
  );
};

export default EventTypesForm;
