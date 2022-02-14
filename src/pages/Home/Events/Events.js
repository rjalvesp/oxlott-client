import React from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "./Events.routes";

const Events = () => {
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route key={`event-type-router-${index}`} {...route} />
      ))}
    </Routes>
  );
};

export default Events;
