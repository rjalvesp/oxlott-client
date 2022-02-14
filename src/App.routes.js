import React from "react";
import Auth from "pages/Auth/Auth";
import Home from "pages/Home/Home";

export const BaseRoutes = [
  { path: "/auth/*", exact: false, element: <Auth /> },
  { path: "/dashboard/*", exact: false, element: <Home /> },
];
