import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import SideNav from "./SideNav";
import DrawerHeader from "./DrawerHeader";
import navigationItems from "../data/navigationItems";

/**
 * DashboardLayout component
 *
 * This component serves as the main layout for the dashboard.
 * It combines the AppHeader, SideNav, and content area.
 */
const DashboardLayout: React.FC = () => {
  // State to track if the drawer is open
  const [open, setOpen] = useState(true);

  // Handler for opening the drawer
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  // Handler for closing the drawer
  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Listen for collapse-sidebar event
  useEffect(() => {
    const handleCollapseSidebar = () => {
      setOpen(false);
    };

    // Add event listener
    window.addEventListener("collapse-sidebar", handleCollapseSidebar);

    // Clean up when component unmounts
    return () => {
      window.removeEventListener("collapse-sidebar", handleCollapseSidebar);
    };
  }, []);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* App Header */}
      <AppHeader open={open} handleDrawerOpen={handleDrawerOpen} />

      {/* Side Navigation */}
      <SideNav
        open={open}
        handleDrawerClose={handleDrawerClose}
        navigationItems={navigationItems}
      />

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Box sx={{ width: "100%" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
