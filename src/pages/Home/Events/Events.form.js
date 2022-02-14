import React from "react";
import * as R from "ramda";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import {
  CircularProgress,
  FormControlLabel,
  Grid,
  Switch,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDayjs";
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
import { EventsService } from "services/Events.service";
import { isFormValid, validateString, validateNumber } from "utils/validators";

const defaultInitialValues = {
  name: "",
  cost: 0,
  prize: 0,
};

const baseInputs = [
  {
    field: "name",
    label: "Name",
    extra: { required: true, minLength: 1, maxLength: 24 },
  },
  {
    field: "cost",
    label: "Cost",
    extra: { required: true, min: 1, type: "number" },
  },
  {
    field: "prize",
    label: "Prize",
    extra: { required: true, min: 1, type: "number" },
  },
];

const EventsForm = () => {
  const service = EventsService();
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialValues, setInitialValues] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const goBack = () => navigate("/events");

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
      R.assoc("from", validateString(values.from.format(), "From")),
      R.assoc("to", validateString(values.to.format(), "To"))
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
              <Text variant="h4">{id ? `Event: ${id}` : "New Event"}</Text>
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
              <LocalizationProvider dateAdapter={DateAdapter}>
                <DateTimePicker
                  value={values.from}
                  minDate={dayjs()}
                  minTime={dayjs()}
                  maxDate={dayjs(values.to)}
                  maxTime={dayjs(values.to)}
                  onChange={(value) =>
                    handleChange({
                      target: { id: "from", name: "from", value },
                    })
                  }
                  onBlur={handleBlur}
                  renderInput={(props) => (
                    <FormControl
                      variant="filled"
                      error={errors.from && touched.from}
                    >
                      <Input
                        {...props}
                        id="from"
                        name="from"
                        describedby="from-error-text"
                        error={errors.from}
                      />
                    </FormControl>
                  )}
                  label="From"
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={4}>
              <LocalizationProvider dateAdapter={DateAdapter}>
                <DateTimePicker
                  value={values.to}
                  minDate={dayjs(values.from).add(2, "hours")}
                  minTime={dayjs(values.from).add(2, "hours")}
                  onChange={(value) =>
                    handleChange({
                      target: { id: "to", name: "to", value },
                    })
                  }
                  onBlur={handleBlur}
                  renderInput={(props) => (
                    <FormControl
                      variant="filled"
                      error={errors.to && touched.to}
                    >
                      <Input
                        {...props}
                        id="to"
                        name="to"
                        describedby="to-error-text"
                        error={errors.to}
                      />
                    </FormControl>
                  )}
                  label="To"
                />
              </LocalizationProvider>
            </Grid>
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

export default EventsForm;
