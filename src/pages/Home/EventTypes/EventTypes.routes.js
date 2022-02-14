import React from "react";
import EventTypesList from "./EventTypes.list";
import EventTypesForm from "./EventTypes.form";

export const routes = [
  { path: "", exact: true, element: <EventTypesList /> },
  { path: "new", exact: true, element: <EventTypesForm /> },
  { path: ":id", exact: true, element: <EventTypesForm /> },
];
