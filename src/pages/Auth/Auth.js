import { AuthLayout } from "components/AuthLayout";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { routes } from "./Auth.routes";
// import { useAuth0 } from "@auth0/auth0-react";

const Auth = () => {
  // const { loginWithRedirect, user } = useAuth0();
  // React.useEffect(() => {
  //   if (user) {
  //     return;
  //   }
  //   // loginWithRedirect();
  // }, [user]);
  // if (!user) {
  //   return null;
  // }
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
