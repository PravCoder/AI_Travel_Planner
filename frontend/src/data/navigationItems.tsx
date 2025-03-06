import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { NavigationItem } from "../components/SideNav";

// Define the navigation items
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
    text: "Reports",
    icon: <BarChartIcon />,
    path: "/reports",
    children: [
      {
        text: "Sales",
        icon: <DescriptionIcon />,
        path: "/reports/sales",
      },
      {
        text: "Traffic",
        icon: <DescriptionIcon />,
        path: "/reports/traffic",
      },
    ],
  },
  {
    text: "Integrations",
    icon: <LayersIcon />,
    path: "/integrations",
  },
];

export default navigationItems;
