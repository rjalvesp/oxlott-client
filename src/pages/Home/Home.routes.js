import React from "react";
import EventTypes from "pages/Home/EventTypes/EventTypes";
import Events from "pages/Home/Events/Events";
import Users from "pages/Home/Users/Users";

export const routes = [
  { path: "event-types/*", exact: false, element: <EventTypes /> },
  { path: "events/*", exact: false, element: <Events /> },
  { path: "users/*", exact: false, element: <Users /> },
];
