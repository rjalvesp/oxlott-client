import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Auth0Provider } from "@auth0/auth0-react";

const {
  REACT_APP_AUTH0_DOMAIN: domain,
  REACT_APP_AUTH0_CLIENT_ID: clientId,
  REACT_APP_AUTH0_REDIRECT_URI: redirectUri,
  REACT_APP_AUTH0_SCOPE: scope,
  REACT_APP_AUTH0_AUDIENCE: audience,
} = process.env;

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={redirectUri}
      audience={audience}
      scope={scope}
      permissions={["user"]}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
  // eslint-disable-next-line no-undef
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
