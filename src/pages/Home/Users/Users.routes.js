import React from "react";
import UsersList from "./Users.list";
import UsersForm from "./Users.form";

export const routes = [
  { path: "", exact: true, element: <UsersList /> },
  { path: ":id", exact: true, element: <UsersForm /> },
];
