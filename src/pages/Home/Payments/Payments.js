import React from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "./Payments.routes";

const Payments = () => {
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route key={`payment-router-${index}`} {...route} />
      ))}
    </Routes>
  );
};

export default Payments;
