import React from "react";
import * as R from "ramda";
import { useAuth0 } from "@auth0/auth0-react";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { parseJwt } from "utils/jwt";

const Negotiate = () => {
  const navigate = useNavigate();
  const { getAccessTokenSilently, logout } = useAuth0();
  React.useEffect(() => {
    getAccessTokenSilently()
      .then((value) => {
        // eslint-disable-next-line no-undef
        console.log(value);
        window.localStorage.setItem("token", value);
        return value;
      })
      .then(parseJwt)
      .then(R.tap(console.log))
      .then(R.propOr([], "permissions"))
      .then(R.tap(console.log))
      .then(
        R.ifElse(
          R.includes("admin"),
          () => navigate("/dashboard"),
          () => logout().then(() => navigate("/auth/unauthorized"))
        )
      )
      .catch(() => navigate("/auth/login"));
  }, []);
  return <CircularProgress color="primary" />;
};

export default Negotiate;
