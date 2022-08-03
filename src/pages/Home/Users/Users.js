import React from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "./Users.routes";

const Users = () => {
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route key={`user-router-${index}`} {...route} />
      ))}
    </Routes>
  );
};

export default Users;
