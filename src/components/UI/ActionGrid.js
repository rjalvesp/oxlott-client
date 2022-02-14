import React from "react";
import styled from "styled-components";
import { Grid as GridMaterial } from "@mui/material";

const StyledGrid = styled(GridMaterial)`
  margin-top: 4rem;
  button {
    margin-right: 0.75rem;
  }
`;

const ActionGrid = ({ ...props }) => {
  return <StyledGrid {...props} />;
};

export default ActionGrid;
