import React from "react";
import { HomeLayout } from "components/HomeLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { routes } from "./Home.routes";

const Home = () => {
  const { isAuthenticated, isLoading, logout } = useAuth0();
  if (!isAuthenticated && !isLoading) {
    logout();
    return <CircularProgress />;
  }

  return (
    <HomeLayout>
      <Routes>
        {routes.map((route, index) => (
          <Route key={`home-router-${index}`} {...route} />
        ))}
        <Route path="*" element={<Navigate to="event-types/" />} />
      </Routes>
    </HomeLayout>
  );
};

export default Home;
