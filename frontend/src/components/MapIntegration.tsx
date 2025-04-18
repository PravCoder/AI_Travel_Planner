import React from "react";
import { Box, Paper, Typography, IconButton, useTheme } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import MyLocationIcon from "@mui/icons-material/MyLocation";

interface MapIntegrationProps {
  location?: string;
  onLocationSelect?: (location: string) => void;
}

const MapIntegration: React.FC<MapIntegrationProps> = ({
  location = "Tokyo, Japan",
  onLocationSelect,
}) => {
  const theme = useTheme();

  // Gray color for headers in dark mode to match ChatInterface
  const headerBgColor =
    theme.palette.mode === "dark"
      ? "rgba(50, 50, 50, 0.2)"
      : theme.palette.background.paper;

  return (
    <Paper
      elevation={2}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: 2,
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      {/* Map Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: headerBgColor,
        }}
      >
        <Box display="flex" alignItems="center">
          <PlaceIcon color="error" sx={{ mr: 1 }} />
          <Typography variant="h6" component="h2">
            {location}
          </Typography>
        </Box>
        <Box>
          <IconButton size="small" sx={{ mr: 1 }}>
            <ZoomInIcon />
          </IconButton>
          <IconButton size="small" sx={{ mr: 1 }}>
            <ZoomOutIcon />
          </IconButton>
          <IconButton size="small">
            <MyLocationIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Map Area */}
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: theme.palette.mode === "dark" ? "#1e2a3a" : "#e5f6fd",
          position: "relative",
          backgroundImage:
            "url(https://maps.googleapis.com/maps/api/staticmap?center=Tokyo,Japan&zoom=12&size=800x800&key=YOUR_API_KEY)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Placeholder for actual map integration */}
        <Typography
          variant="body1"
          sx={{
            position: "absolute",
            bottom: 20,
            left: 20,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(0, 0, 0, 0.7)"
                : "rgba(255, 255, 255, 0.8)",
            color: theme.palette.text.primary,
            p: 1,
            borderRadius: 1,
          }}
        >
          {location} - Google Maps will be integrated here
        </Typography>

        {/* Location list */}
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 250,
            maxHeight: 300,
            overflow: "auto",
            p: 0,
          }}
        ></Paper>
      </Box>

      {/* Footer with attribution */}
      <Box
        sx={{
          p: 1,
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "flex-end",
          bgcolor: headerBgColor,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Map data ©2025 Google
        </Typography>
      </Box>
    </Paper>
  );
};

export default MapIntegration;
