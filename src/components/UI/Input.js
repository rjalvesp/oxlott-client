import React from "react";
import styled from "styled-components";
import { TextField as MaterialInput, FormHelperText } from "@mui/material";

const StyledInput = styled(MaterialInput)`
  margin-bottom: 1.5rem;
  .MuiFormControl-root {
    width: 100%;
  }
`;
const Helper = styled(FormHelperText)`
  margin-bottom: 1.5rem;
`;

const Input = ({ error, describedBy, ...props }) => {
  return (
    <>
      <StyledInput aria-describedby={describedBy} variant="filled" {...props} />
      {error && <Helper id={describedBy}>{error.text}</Helper>}
    </>
  );
};

export default Input;
