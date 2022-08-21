import React from "react";
import * as R from "ramda";
import { useParams, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import FileUpload from "react-material-file-upload";
import {
  Button,
  Card,
  CircularProgress,
  FormControlLabel,
  Grid,
  Modal,
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
import { AssetsService } from "services/Assets.service";
import { isFormValid, validateString, validateNumber } from "utils/validators";
import ModalBox from "components/UI/ModalBox";
import { Currency } from "utils/currency";

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
    field: "phone",
    label: "Phone",
    extra: { required: true, minLength: 1, maxLength: 24 },
  },
  {
    field: "bankAccount",
    label: "Bank Account",
    extra: { required: true, minLength: 1, maxLength: 100 },
  },
  {
    field: "legal_id",
    label: "Legal Identification #",
    extra: { required: true, minLength: 1, maxLength: 100 },
  },
];

const UsersForm = () => {
  const service = UsersService();
  const assetsService = AssetsService();
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialValues, setInitialValues] = React.useState(null);
  const [pictureModal, setPictureModal] = React.useState("");
  const [legalPictureModal, setLegalPictureModal] = React.useState("");
  const [images, setImages] = React.useState({ picture: "" });
  const [loading, setLoading] = React.useState(true);

  const goBack = () => navigate("/dashboard/users");

  const closeModal = (fn) => fn("");

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

  const handleFileUpload = (field, handleChange, modalFn) => {
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
          .createAt("users", payload)
          .then(R.propOr(reader.result, "Key"))
          .then((Key) =>
            assetsService.getById(Key).then((value) => {
              setImages({ [field]: value });
              modalFn("");
              handleChange({
                target: {
                  id: field,
                  name: field,
                  value: `${process.env.SERVER_URI}${Key}`,
                },
              });
            })
          );
      };
    };
  };

  React.useEffect(() => {
    setLoading(true);
    if (!id) {
      setInitialValues(defaultInitialValues);
      setLoading(false);
      return;
    }

    service
      .getById(id)
      .then(async (value) => {
        if (value.picture) {
          if (R.propOr("", "picture", value).startsWith("http")) {
            setImages({ picture: value.picture });
          } else {
            await assetsService.getById(value.picture).then((data) => {
              setImages({ picture: data });
            });
          }
        }
        if (value.legal_picture) {
          if (R.propOr("", "legal_picture", value).startsWith("http")) {
            setImages({ legal_picture: value.legal_picture });
          } else {
            await assetsService.getById(value.legal_picture).then((data) => {
              setImages({ legal_picture: data });
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
      initialValues={R.omit(["balance"], initialValues || {})}
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
            <Grid item xs={4}>
              <Text>Picture</Text>
              {images.picture ? (
                <Button type="button" onClick={() => setPictureModal("view")}>
                  View
                </Button>
              ) : null}
              <Button type="button" onClick={() => setPictureModal("change")}>
                Change
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Text>Legal Picture</Text>
              {images.legal_picture ? (
                <Button
                  type="button"
                  onClick={() => setLegalPictureModal("view")}
                >
                  View
                </Button>
              ) : null}
              <Button
                type="button"
                onClick={() => setLegalPictureModal("change")}
              >
                Change
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Text>Balance</Text>
              <Text>{Currency(initialValues.balance)}</Text>
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
                    checked={Boolean(values.legal_verified)}
                    name="disabled"
                    onChange={handleChange}
                  />
                }
                label={<Text>Legal Id verified</Text>}
              />
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
          <Modal
            open={pictureModal}
            onClose={() => closeModal(setPictureModal)}
          >
            <ModalBox>
              <Card variant="outlined">
                {pictureModal === "change" ? (
                  <FileUpload
                    onChange={handleFileUpload(
                      "picture",
                      handleChange,
                      setPictureModal
                    )}
                  />
                ) : null}
                {pictureModal === "view" ? (
                  <img src={images.picture} width="400" height="300" />
                ) : null}
              </Card>
            </ModalBox>
          </Modal>
          <Modal
            open={legalPictureModal}
            onClose={() => closeModal(setLegalPictureModal)}
          >
            <ModalBox>
              <Card variant="outlined">
                {legalPictureModal === "change" ? (
                  <FileUpload
                    onChange={handleFileUpload(
                      "legal_picture",
                      handleChange,
                      setLegalPictureModal
                    )}
                  />
                ) : null}
                {legalPictureModal === "view" ? (
                  <img src={images.legal_picture} width="400" height="300" />
                ) : null}
              </Card>
            </ModalBox>
          </Modal>
        </Form>
      )}
    </Formik>
  );
};

export default UsersForm;
