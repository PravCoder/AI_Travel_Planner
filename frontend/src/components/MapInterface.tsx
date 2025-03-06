import React from "react";
import { Paper, Typography, Box, styled } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

// Types for component props
interface MapInterfaceProps {
  location?: string;
}

// Styled component for the map container
const MapContainer = styled(Paper)(({ theme }) => ({
  height: "100%",
  minHeight: "600px",
  display: "flex",
  flexDirection: "column",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  boxShadow: theme.shadows[2],
}));

// Styled header for the map
const MapHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

// Styled placeholder for the map content
const MapContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: theme.palette.grey[100],
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  color: theme.palette.text.secondary,
}));

/**
 * MapInterface Component
 *
 * Displays a map based on the provided location
 * Currently shows a placeholder, but will integrate with Google Maps API
 */
const MapInterface: React.FC<MapInterfaceProps> = ({ location }) => {
  return (
    <MapContainer>
      <MapHeader>
        <LocationOnIcon />
        <Typography variant="h6">
          {location ? `Map of ${location}` : "Trip Location"}
        </Typography>
      </MapHeader>
      <MapContent>
        <Box sx={{ textAlign: "center" }}>
          <LocationOnIcon sx={{ fontSize: 60, opacity: 0.6, mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Google Maps Interface
          </Typography>
          <Typography variant="body2">
            {location
              ? `Interactive map of ${location} will be displayed here`
              : "Select a location to see it on the map"}
          </Typography>
        </Box>
      </MapContent>
    </MapContainer>
  );
};

export default MapInterface;
