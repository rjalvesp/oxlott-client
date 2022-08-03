import React from "react";
import * as R from "ramda";
import { useParams, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import {
  CircularProgress,
  FormControlLabel,
  Grid,
  Switch,
} from "@mui/material";
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
import { UsersService } from "services/Users.service";
import { isFormValid, validateString, validateNumber } from "utils/validators";

const defaultInitialValues = {
  name: "",
  bankReference: "",
};

const baseInputs = [
  {
    field: "name",
    label: "Name",
    extra: { required: true, minLength: 1, maxLength: 24 },
  },
  {
    field: "bankReference",
    label: "Bank Reference",
    extra: { required: true, minLength: 1, maxLength: 100 },
  },
];

const UsersForm = () => {
  const service = UsersService();
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialValues, setInitialValues] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const goBack = () => navigate("/users");

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
      R.mergeAll
    )(baseInputs);

    return isFormValid(errors) ? null : errors;
  };

  const onSubmit = (values, { setSubmitting }) => {
    const fn = service.update(id, values);
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
              <Text variant="h4">{`User: ${id}`}</Text>
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

export default UsersForm;
