import { Box, IconButton, useTheme, Menu, MenuItem, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate(); // Hook for navigation

  // State for the profile menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Handle hover on profile icon
  const handleProfileHover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle mouse leave from profile icon or menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle "Edit Profile" click
  const handleEditProfile = () => {
    console.log("Edit Profile clicked");
    handleMenuClose();
  };

  // Handle "Logout" click
  const handleLogout = () => {
    console.log("Logout clicked");
    // Clear the session (e.g., remove token from localStorage)
    localStorage.removeItem("token"); // Remove the token from localStorage
    sessionStorage.removeItem("preferredLanguage"); // Remove the preferred language from sessionStorage (if used)
    handleMenuClose(); // Close the dropdown menu
    navigate("/"); // Redirect to the login page
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="10px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton
          onMouseEnter={handleProfileHover} // Show menu on hover
          onMouseLeave={handleMenuClose} // Hide menu on mouse leave
        >
          <PersonOutlinedIcon />
        </IconButton>

        {/* Profile Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "top", // Position the menu below the icon
            horizontal: "right", // Align the menu to the right of the icon
          }}
          transformOrigin={{
            vertical: "top", // Ensure the menu opens downward
            horizontal: "right",
          }}
          PaperProps={{
            style: {
              backgroundColor: colors.primary[400], // Background color for the dropdown box
              borderRadius: "5px", // Rounded corners
              padding: "0", // Remove default padding
              marginTop: "38px", // Add a small gap between the icon and the menu
            },
          }}
          onMouseEnter={handleProfileHover} // Keep menu open when hovering over it
          onMouseLeave={handleMenuClose} // Hide menu when mouse leaves
        >
          <MenuItem
            onClick={handleEditProfile}
            sx={{
              color: colors.greenAccent[600],
              fontWeight: "800",
              borderBottom: `1px solid ${colors.grey[100]}`, // Bottom border for each list item
              "&:hover": {
                color: "#00bfff", // Bright blue text color on hover
                backgroundColor: "transparent", // No background change on hover
              },
            }}
          >
            <Typography variant="body1" sx={{ fontSize: "16px", fontWeight: "700" }}>
              Edit Profile
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={handleLogout}
            sx={{
              color: colors.greenAccent[600],
              fontWeight: "800",
              borderBottom: `1px solid ${colors.grey[100]}`, // Bottom border for each list item
              "&:hover": {
                color: "#00bfff", // Bright blue text color on hover
                backgroundColor: "transparent", // No background change on hover
              },
            }}
          >
            <Typography variant="body1" sx={{ fontSize: "16px", fontWeight: "700" }}>
              Logout
            </Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;