import React from "react";
import EventTypes from "pages/Home/EventTypes/EventTypes";
import Events from "pages/Home/Events/Events";
import Users from "pages/Home/Users/Users";
import Bills from "./Bills/Bills";
import Payments from "./Payments/Payments";

export const routes = [
  { path: "event-types/*", exact: false, element: <EventTypes /> },
  { path: "events/*", exact: false, element: <Events /> },
  { path: "users/*", exact: false, element: <Users /> },
  { path: "bills/*", exact: false, element: <Bills /> },
  { path: "payments/*", exact: false, element: <Payments /> },
];
