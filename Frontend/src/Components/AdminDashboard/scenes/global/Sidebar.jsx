import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";

const Item = ({ title, icon, selected, setSelected, setCurrentView }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Map the title to the correct view name
  const getViewName = (title) => {
    switch (title) {
      case "Manage Team":
        return "Team";
      case "Contacts Information":
        return "Contacts";
      case "Invoices Balances":
        return "Invoices";
      case "Profile Form":
        return "Form";
      case "FAQ Page":
        return "FAQ";
      case "Bar Chart":
        return "Bar";
      case "Pie Chart":
        return "Pie";
      case "Line Chart":
        return "Line";
      case "Geography Chart":
        return "Geography";
      default:
        return title; // For "Dashboard" and "Calendar"
    }
  };

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => {
        setSelected(title);
        setCurrentView(getViewName(title)); // Update the current view
      }}
      icon={icon}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

const Sidebar = ({ isCollapsed, setIsCollapsed, setCurrentView }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      sx={{
        position: "fixed", // Fix the sidebar position
        left: 0,
        top: 0,
        height: "100vh", // Full height of the viewport
        zIndex: 1000, // Ensure the sidebar is above other content
        width: isCollapsed ? "80px" : "270px", // Adjust width when collapsed
        transition: "width 0.3s ease", // Smooth transition
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  Admin
                </Typography>
                <IconButton
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  sx={{ zIndex: 1000 }} // Set z-index for the toggle button
                >
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
            {isCollapsed && (
              <IconButton
                onClick={() => setIsCollapsed(!isCollapsed)}
                sx={{ zIndex: 1000 }} // Set z-index for the toggle button
              >
                <MenuOutlinedIcon />
              </IconButton>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`../../assets/user.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Fira Teferi
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  System Admin
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              setCurrentView={setCurrentView}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
            <Item
              title="Manage Team"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              setCurrentView={setCurrentView}
            />
            <Item
              title="Contacts Information"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              setCurrentView={setCurrentView}
            />
            <Item
              title="Invoices Balances"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              setCurrentView={setCurrentView}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>
            <Item
              title="Profile Form"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              setCurrentView={setCurrentView}
            />
            <Item
              title="Calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              setCurrentView={setCurrentView}
            />
            <Item
              title="FAQ Page"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              setCurrentView={setCurrentView}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Charts
            </Typography>
            <Item
              title="Bar Chart"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              setCurrentView={setCurrentView}
            />
            <Item
              title="Pie Chart"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              setCurrentView={setCurrentView}
            />
            <Item
              title="Line Chart"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              setCurrentView={setCurrentView}
            />
            <Item
              title="Geography Chart"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              setCurrentView={setCurrentView}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;