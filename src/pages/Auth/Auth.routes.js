import React from "react";
import Login from "./Login";
import Unauthorized from "./Unauthorized";
import Negotiate from "./Negotiate";

export const routes = [
  { path: "login", exact: true, element: <Login /> },
  { path: "unauthorized", exact: true, element: <Unauthorized /> },
  { path: "negotiate", exact: true, element: <Negotiate /> },
];
