import React from "react";
import styled from "styled-components";
import { Body, Main } from "components/UI";

const AuthMain = styled(Main)`
  margin-top: 0;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const AuthLayout = ({ children }) => {
  return (
    <Body>
      <AuthMain>{children}</AuthMain>
    </Body>
  );
};

export default AuthLayout;
