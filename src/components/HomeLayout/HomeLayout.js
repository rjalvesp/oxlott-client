import React from "react";
import styled from "styled-components";
import {
  AppBar,
  Button,
  Drawer,
  IconButton,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import GroupIcon from "@mui/icons-material/Group";
import PaidIcon from "@mui/icons-material/Paid";
import ReceiptIcon from "@mui/icons-material/Receipt";
import EventIcon from "@mui/icons-material/Event";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import { useAuth0 } from "@auth0/auth0-react";
import { Body, Main } from "components/UI";
import { Link } from "react-router-dom";

const StyledDrawer = styled(Drawer)`
  .MuiPaper-root {
    margin-top: 64px;
    height: calc(100vh - 64px);
    padding: 2rem 0;
    width: 14rem;
  }
`;

const MenuLink = styled(Link)`
  color: white;
  display: flex;
  text-decoration: none;
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

const menuItems = [
  {
    text: "Event Types",
    to: "/dashboard/event-types",
    icon: <EventRepeatIcon />,
  },
  { text: "Events", to: "/dashboard/events", icon: <EventIcon /> },
  { text: "Bills", to: "/dashboard/bills", icon: <ReceiptIcon /> },
  { text: "Payments", to: "/dashboard/payments", icon: <PaidIcon /> },
  { text: "Users", to: "/dashboard/users", icon: <GroupIcon /> },
];

const HomeLayout = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const { logout } = useAuth0();

  return (
    <Body>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setOpen(!open)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>
          <Button color="inherit" onClick={() => logout()}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <StyledDrawer variant="persistent" anchor="left" open={open}>
        {menuItems.map(({ text, to, icon }, idx) => (
          <MenuItem key={`home-menu-${text}-${idx}`}>
            <MenuLink to={to}>
              {icon}
              {text}
            </MenuLink>
          </MenuItem>
        ))}
      </StyledDrawer>
      <Main open={open}>{children}</Main>
    </Body>
  );
};

export default HomeLayout;
