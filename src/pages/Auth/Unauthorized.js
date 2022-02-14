import React from "react";
import styled from "styled-components";
import BackspaceIcon from "@mui/icons-material/Backspace";
import { IconTextButton, Text } from "components/UI";
import { Card } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { routes } from "./Auth.routes";

const SpacedCard = styled(Card)`
  padding: 2rem;

  display: flex;
  flex-direction: column;
  align-items: flex-end;

  h5 {
    margin-bottom: 2rem;
  }
`;

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <SpacedCard variant="elevation">
      <Text variant="h5">
        You do not possess permission to access the Administrator{" "}
      </Text>
      <IconTextButton
        size="large"
        variant="contained"
        onClick={() => navigate(routes[0].path)}
      >
        <BackspaceIcon /> Go back to Sign in
      </IconTextButton>
    </SpacedCard>
  );
};

export default Unauthorized;
