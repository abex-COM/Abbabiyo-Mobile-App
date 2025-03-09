import { useState, useEffect } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import Calendar from "./scenes/calendar/calendar";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [theme, colorMode] = useMode();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Track sidebar collapse state
  const [currentView, setCurrentView] = useState("Dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state
  const navigate = useNavigate(); // Hook for navigation

  // Check for authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirect to login if no token is found
    } else {
      setIsAuthenticated(true); // Set authenticated to true if token exists
    }
  }, [navigate]);

  const renderView = () => {
    switch (currentView) {
      case "Dashboard":
        return <Dashboard />;
      case "Team":
        return <Team />;
      case "Contacts":
        return <Contacts />;
      case "Invoices":
        return <Invoices />;
      case "Form":
        return <Form />;
      case "Calendar":
        return <Calendar />;
      case "FAQ":
        return <FAQ />;
      case "Bar":
        return <Bar />;
      case "Pie":
        return <Pie />;
      case "Line":
        return <Line />;
      case "Geography":
        return <Geography />;
      default:
        return <Dashboard />;
    }
  };

  // Render the dashboard only if authenticated
  if (!isAuthenticated) {
    return null; // Render nothing until authentication is confirmed
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {/* Pass isCollapsed and setIsCollapsed to Sidebar */}
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            setCurrentView={setCurrentView}
          />
          <main
            className="content"
            style={{
              marginLeft: isSidebarCollapsed ? "80px" : "270px", // Dynamic margin
              transition: "margin 0.3s ease", // Smooth transition
            }}
          >
            <Topbar setIsSidebar={setIsSidebarCollapsed} />
            {renderView()}
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default AdminDashboard;