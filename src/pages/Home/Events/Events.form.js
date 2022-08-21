import React from "react";
import * as R from "ramda";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import {
  Autocomplete,
  Box,
  CircularProgress,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/lab";
import DateRangePicker from "@mui/lab/DateRangePicker";
import DateAdapter from "@mui/lab/AdapterDayjs";
import SaveIcon from "@mui/icons-material/Save";
import BackspaceIcon from "@mui/icons-material/Backspace";
import {
  ActionGrid,
  LinkedRow,
  Form,
  FormControl,
  IconTextButton,
  Input,
  ReferenceLink,
  Text,
} from "components/UI";
import { EventsService } from "services/Events.service";
import { isFormValid, validateString, validateNumber } from "utils/validators";
import { EventTypesService } from "services/EventTypes.service";

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
    extra: { required: true, min: 0, type: "number" },
  },
  {
    field: "prize",
    label: "Prize",
    extra: { required: true, min: 0, type: "number" },
  },
];

const EventsForm = () => {
  const service = EventsService();
  const eventTypesService = EventTypesService();
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialValues, setInitialValues] = React.useState({
    from: dayjs(),
    to: dayjs(),
  });
  const [eventTypes, setEventTypes] = React.useState({ data: [] });
  const [loading, setLoading] = React.useState(true);

  const goBack = () => navigate("/dashboard/events");

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
      R.assoc(
        "from",
        validateString(
          values.from?.format ? values.from.format() : values.from,
          "from",
          { required: true }
        )
      ),
      R.assoc(
        "to",
        validateString(
          values.to?.format ? values.to.format() : values.to,
          "to",
          { required: true }
        )
      ),
      R.assoc(
        "eventTypeId",
        validateString(values.eventTypeId, "eventTypeId", { required: true })
      )
    )(baseInputs);
    return isFormValid(errors) ? null : errors;
  };

  const onSubmit = (values, { setSubmitting }) => {
    const payload = R.pipe(
      R.over(
        R.lensProp("from"),
        R.pipe(R.defaultTo(dayjs()), (value) => value.format())
      ),
      R.over(
        R.lensProp("to"),
        R.pipe(R.defaultTo(dayjs()), (value) => value.format())
      )
    )(values);
    const fn = id ? service.create(payload) : service.update(id, payload);
    setSubmitting(true);
    Promise.resolve(fn).finally(() => setSubmitting(false));
  };

  const transformInitialValues = R.pipe(
    R.over(
      R.lensProp("from"),
      R.pipe(R.defaultTo(""), (value) => dayjs(value))
    ),
    R.over(
      R.lensProp("to"),
      R.pipe(R.defaultTo(""), (value) => dayjs(value))
    )
  );

  React.useEffect(() => {
    setLoading(true);
    eventTypesService
      .search()
      .then(setEventTypes)
      .then(() => {
        if (!id) {
          setInitialValues(defaultInitialValues);
          setLoading(false);
          return;
        }
        service
          .getById(id)
          .then(transformInitialValues)
          .then(setInitialValues)
          .then(setLoading)
          .catch(goBack);
      });
  }, [id]);

  if (loading) {
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
            <Grid item xs={12}>
              <LinkedRow>
                <Autocomplete
                  disablePortal
                  id="eventTypeId"
                  name="eventTypeId"
                  required
                  getOptionLabel={(option) => option.name}
                  options={eventTypes.data}
                  onChange={(e, { _id }) =>
                    handleChange({
                      target: {
                        id: "eventTypeId",
                        name: "eventTypeId",
                        value: _id,
                      },
                    })
                  }
                  defaultValue={R.pathOr("", ["eventType"], values)}
                  renderInput={(params) => (
                    <TextField {...params} label="Event Type" />
                  )}
                />
                <ReferenceLink
                  to={`/dashboard/event-types/${R.pipe(
                    R.pathOr("", ["eventType", "_id"]),
                    R.split(":"),
                    R.last
                  )(values)}`}
                >
                  <Text>{R.pathOr("", ["eventType", "name"], values)}</Text>
                </ReferenceLink>
              </LinkedRow>
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
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={DateAdapter}>
                <DateRangePicker
                  disablePast={true}
                  startText="From"
                  endText="To"
                  value={[values.from, values.to]}
                  onChange={([from, to]) => {
                    handleChange({
                      target: { id: "from", name: "from", value: from },
                    });
                    handleChange({
                      target: { id: "to", name: "to", value: to },
                    });
                  }}
                  renderInput={(startProps, endProps) => (
                    <React.Fragment>
                      <TextField {...startProps} />
                      <Box sx={{ mx: 2 }}> </Box>
                      <TextField {...endProps} />
                    </React.Fragment>
                  )}
                />
              </LocalizationProvider>
            </Grid>
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
