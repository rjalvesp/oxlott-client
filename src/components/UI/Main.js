import styled from "styled-components";

const Main = styled.div`
  margin-top: 64px;
  height: calc(100vh - 64px);
  width: ${({ open }) => (open ? "calc(100% - 14rem);" : "100%")};
  margin-left: ${({ open }) => (open ? "14rem" : "0")};
  overflow: auto;
  padding: 2rem;
  background-color: #0a1d29;
`;

export default Main;
