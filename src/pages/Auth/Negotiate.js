import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Negotiate = () => {
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  React.useEffect(() => {
    getAccessTokenSilently().then((value) => {
      // eslint-disable-next-line no-undef
      localStorage.setItem("token", value);
      navigate("/dashboard");
    });
  }, []);
  return <CircularProgress color="primary" />;
};

export default Negotiate;
