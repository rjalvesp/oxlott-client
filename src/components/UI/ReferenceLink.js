import styled from "styled-components";
import { Link } from "react-router-dom";

const ReferenceLink = styled(Link)`
  color: white;
  display: flex;
  text-decoration: underline;
  padding: 0.5rem 0;
  &:hover,
  &:active,
  &:visited {
    color: white;
  }
  svg {
    margin-right: 0.5rem;
  }
`;

export default ReferenceLink;
