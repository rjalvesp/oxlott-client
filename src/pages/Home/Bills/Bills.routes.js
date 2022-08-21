import React from "react";
import BillsList from "./Bills.list";
import BillsForm from "./Bills.form";

export const routes = [
  { path: "", exact: true, element: <BillsList /> },
  { path: ":id", exact: true, element: <BillsForm /> },
];
