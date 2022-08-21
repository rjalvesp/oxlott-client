import React from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "./Bills.routes";

const Bills = () => {
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route key={`bill-router-${index}`} {...route} />
      ))}
    </Routes>
  );
};

export default Bills;
