import * as React from "react";
import styled from "styled-components";
import { Button, Card } from "@mui/material";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const ActionBar = styled.div`
  padding-top: 1rem;
  display: flex;
  justify-content: flex-end;
`;

const ConfirmModal = ({ open, title, onClose, onOk }) => {
  return (
    <Modal open={open || false} onClose={onClose}>
      <Card
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        <ActionBar>
          <Button onClick={onClose}>Cancel</Button>
          <Button onOk={onOk}>Save</Button>
        </ActionBar>
      </Card>
    </Modal>
  );
};

export default ConfirmModal;
