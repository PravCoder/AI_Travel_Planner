import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import ExploreIcon from "@mui/icons-material/Explore";
import { NavigationItem } from "../components/SideNav";
import LayersIcon from "@mui/icons-material/Layers";

// Define the navigation items for the sidebar
const navigationItems: NavigationItem[] = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    path: "/dashboard",
  },
  {
    text: "About",
    icon: <QuestionMarkIcon />,
    path: "/about",
  },
  {
    text: "Popular Destinations",
    icon: <ExploreIcon />,
    path: "/popular-destinations",
  },
  {
    text: "Schedule",
    icon: <LayersIcon />,
    path: "/schedule",
  },
];

export default navigationItems;
