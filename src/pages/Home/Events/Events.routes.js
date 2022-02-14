import React from "react";
import EventsList from "./Events.list";
import EventsForm from "./Events.form";

export const routes = [
  { path: "", exact: true, element: <EventsList /> },
  { path: "new", exact: true, element: <EventsForm /> },
  { path: ":id", exact: true, element: <EventsForm /> },
];
