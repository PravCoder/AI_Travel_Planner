import * as React from "react";
import { extendTheme, styled } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import { AppProvider, Navigation, Router } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { QuestionMark } from "@mui/icons-material";
import { Outlet, useNavigate } from "react-router-dom";

interface DashboardLayoutProps {
  initialPath?: string;
}

const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "about",
    title: "About",
    icon: <QuestionMark />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Analytics",
  },
  {
    segment: "reports",
    title: "Reports",
    icon: <BarChartIcon />,
    children: [
      {
        segment: "sales",
        title: "Sales",
        icon: <DescriptionIcon />,
      },
      {
        segment: "traffic",
        title: "Traffic",
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: "integrations",
    title: "Integrations",
    icon: <LayersIcon />,
  },
];

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: "class",
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function useDemoRouter(initialPath: string): Router {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path: string | URL) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}

const Skeleton = styled("div")<{ height: number }>(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '" "',
}));

export default function DashboardLayoutBasic({
  initialPath = "/dashboard",
}: DashboardLayoutProps) {
  const router = useDemoRouter(initialPath);
  const navigate = useNavigate(); // Use navigate for programmatic navigation

  return (
    <AppProvider
      branding={{
        logo: (
          <img
            src={require("../assets/travel-planner-ai-gen-logo.jpg")}
            alt="AI Travel Planner Logo"
          />
        ),
        title: "AI Travel Planner",
        homeUrl: "/dashboard",
      }}
      navigation={NAVIGATION.map((item) =>
        "segment" in item && item.segment // Only add onClick if segment exists
          ? {
              ...item,
              onClick: () => navigate(item.segment as string), // Ensure navigation works
            }
          : item
      )}
      theme={demoTheme}
    >
      <DashboardLayout>
        <PageContainer>
          <Outlet /> {/* This is where your pages will load */}
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
