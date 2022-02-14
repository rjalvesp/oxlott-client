import React from "react";
import styled from "styled-components";
import LoginIcon from "@mui/icons-material/Login";
import { IconTextButton, Text } from "components/UI";
import { Card } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

const SpacedCard = styled(Card)`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  h5 {
    margin-bottom: 2rem;
  }
`;

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <SpacedCard variant="elevation">
      <Text variant="h5"> Oxlott Admin </Text>
      <IconTextButton
        size="large"
        variant="contained"
        onClick={() => loginWithRedirect()}
      >
        <LoginIcon /> Sign in
      </IconTextButton>
    </SpacedCard>
  );
};

export default Login;
