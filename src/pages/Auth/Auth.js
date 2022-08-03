import { AuthLayout } from "components/AuthLayout";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { routes } from "./Auth.routes";

const Auth = () => {
  return (
    <AuthLayout>
      <Routes>
        {routes.map((route, index) => (
          <Route key={`auth-router-${index}`} {...route} />
        ))}
        <Route path="*" element={<Navigate to="/auth/login" />} />
      </Routes>
    </AuthLayout>
  );
};

export default Auth;
