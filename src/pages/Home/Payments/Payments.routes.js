import React from "react";
import PaymentsList from "./Payments.list";
import PaymentsForm from "./Payments.form";

export const routes = [
  { path: "", exact: true, element: <PaymentsList /> },
  { path: ":id", exact: true, element: <PaymentsForm /> },
];
