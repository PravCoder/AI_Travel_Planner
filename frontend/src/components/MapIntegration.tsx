import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  useTheme,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
  Button,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import TodayIcon from "@mui/icons-material/Today";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import HotelIcon from "@mui/icons-material/Hotel";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ExploreIcon from "@mui/icons-material/Explore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Define the interfaces for the itinerary data
interface ItineraryLocation {
  name: string;
  location: string;
  description?: string;
  time?: string;
  category?: string;
}

interface ItineraryDay {
  date: string;
  locations: ItineraryLocation[];
}

interface MapIntegrationProps {
  location?: string;
  onLocationSelect?: (location: string) => void;
  // Add new props for itinerary data
  itineraryDays?: ItineraryDay[];
  selectedDay?: number; // 1-based index of the day to show
}

// Common countries for matching patterns
const COMMON_COUNTRIES = [
  "USA",
  "United States",
  "Canada",
  "Mexico",
  "Brazil",
  "Argentina",
  "UK",
  "United Kingdom",
  "France",
  "Germany",
  "Italy",
  "Spain",
  "China",
  "Japan",
  "India",
  "Australia",
  "Russia",
  "South Africa",
];

const MIN_ZOOM = 2; // Minimum zoom level (further out)
const MAX_ZOOM = 20; // Maximum zoom level (closer in)

const MapIntegration: React.FC<MapIntegrationProps> = ({
  location = "",
  onLocationSelect,
  itineraryDays = [],
  selectedDay = 0, // 0 means show all days
}) => {
  const theme = useTheme();
  const [mapUrl, setMapUrl] = useState("");
  const [zoom, setZoom] = useState<number>(13); // Default zoom level
  const [timestamp, setTimestamp] = useState(Date.now()); // Add timestamp for forced refresh
  const [currentDay, setCurrentDay] = useState<number>(selectedDay);
  const [showLocationList, setShowLocationList] = useState(true);
  const [highlightedLocation, setHighlightedLocation] = useState<string | null>(
    null
  );

  // Gray color for headers in dark mode to match ChatInterface
  const headerBgColor =
    theme.palette.mode === "dark"
      ? "rgba(50, 50, 50, 0.2)"
      : theme.palette.background.paper;

  // Constants for API configuration
  const API_BASE_URL = "http://localhost:3001"; // Backend API URL

  // Update currentDay when selectedDay prop changes
  useEffect(() => {
    setCurrentDay(selectedDay);
  }, [selectedDay]);

  // Determine appropriate zoom level based on location string
  const getZoomLevelForLocation = (location: string): number => {
    // Default zoom level for cities
    let zoomLevel = 13;

    if (!location) return zoomLevel;

    // Convert to lowercase for comparison
    const locationLower = location.toLowerCase();

    // Check if it's a common country name
    if (
      COMMON_COUNTRIES.some(
        (country) =>
          locationLower === country.toLowerCase() ||
          locationLower.endsWith(`, ${country.toLowerCase()}`)
      )
    ) {
      return 5; // Country-level zoom
    }

    // Check if it contains a comma (likely "city, state/country" format)
    // This helps identify regions vs standalone cities
    if (location.includes(",")) {
      // Could be "city, state" or "city, country"
      const parts = location.split(",");
      if (parts.length === 2) {
        const secondPart = parts[1].trim();
        // If second part is longer than 3 chars, likely country/region name, not a state code
        if (secondPart.length > 3) {
          return 9; // Regional zoom
        }
      }
    }

    // Word count heuristic
    const wordCount = location.split(/\s+/).length;
    if (wordCount >= 3) {
      return 8; // Likely a region or complex name
    }

    return zoomLevel; // Default for cities
  };

  // Handle zoom in button click
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 1, MAX_ZOOM));
  };

  // Handle zoom out button click
  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 1, MIN_ZOOM));
  };

  // Handle cycling through days
  const handleNextDay = () => {
    if (itineraryDays.length === 0) return;

    if (currentDay >= itineraryDays.length) {
      setCurrentDay(0); // all days
    } else {
      setCurrentDay(currentDay + 1 > itineraryDays.length ? 0 : currentDay + 1);
    }
    setTimestamp(Date.now()); // Force iframe refresh
  };

  // Get locations for the current view (all or specific day)
  const getCurrentLocations = (): ItineraryLocation[] => {
    if (itineraryDays.length === 0) return [];

    if (currentDay === 0) {
      return itineraryDays.flatMap((day) => day.locations || []);
    } else {
      // Show specific day (1-based index)
      const day = itineraryDays[currentDay - 1];
      return day?.locations || [];
    }
  };

  useEffect(() => {
    if (location) {
      setZoom(getZoomLevelForLocation(location));
      setTimestamp(Date.now()); // Update timestamp to force iframe refresh
    }
  }, [location]);

  const getLocationIcon = (category?: string) => {
    if (!category) return <ExploreIcon fontSize="small" color="action" />;

    const lowerCategory = category.toLowerCase();

    if (
      lowerCategory.includes("food") ||
      lowerCategory.includes("restaurant") ||
      lowerCategory.includes("dining") ||
      lowerCategory.includes("cafe") ||
      lowerCategory.includes("lunch") ||
      lowerCategory.includes("dinner")
    ) {
      return <RestaurantIcon fontSize="small" color="primary" />;
    } else if (
      lowerCategory.includes("hotel") ||
      lowerCategory.includes("accommodation") ||
      lowerCategory.includes("stay") ||
      lowerCategory.includes("lodging")
    ) {
      return <HotelIcon fontSize="small" color="secondary" />;
    } else if (
      lowerCategory.includes("transport") ||
      lowerCategory.includes("car") ||
      lowerCategory.includes("bus") ||
      lowerCategory.includes("taxi") ||
      lowerCategory.includes("drive")
    ) {
      return <DirectionsCarIcon fontSize="small" color="error" />;
    } else if (
      lowerCategory.includes("tour") ||
      lowerCategory.includes("visit") ||
      lowerCategory.includes("sightseeing") ||
      lowerCategory.includes("explore") ||
      lowerCategory.includes("museum")
    ) {
      return <DirectionsWalkIcon fontSize="small" color="success" />;
    } else {
      return <ExploreIcon fontSize="small" color="action" />;
    }
  };

  useEffect(() => {
    console.log("Location changed in MapIntegration:", location);

    const locations = getCurrentLocations();

    if (locations.length > 0) {
      // Prepare location strings, limit to 10 locations
      const locationStrings = locations
        .slice(0, 10)
        .map((loc) => `${loc.name} ${loc.location}`.trim());

      // Add the main location if not already included
      if (
        location &&
        locationStrings.length < 10 &&
        !locationStrings.some((loc) => loc.includes(location))
      ) {
        locationStrings.push(location);
      }

      const searchQuery = locationStrings.join("|");

      fetch(
        `${API_BASE_URL}/maps/embed?q=${encodeURIComponent(
          searchQuery
        )}&zoom=${zoom}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Setting map with itinerary pins:", locations.length);
          setMapUrl(data.mapUrl);
          setTimestamp(Date.now());
        })
        .catch((error) => {
          console.error("Error fetching map data:", error);
        });
    } else if (location) {
      // Use the backend proxy for place mode with single location
      fetch(
        `${API_BASE_URL}/maps/embed?q=${encodeURIComponent(
          location
        )}&zoom=${zoom}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Setting new map URL for:", location);
          setMapUrl(data.mapUrl);
          setTimestamp(Date.now());
        })
        .catch((error) => {
          console.error("Error fetching map data:", error);
        });
    } else {
      setMapUrl("");
      setTimestamp(Date.now());
    }
  }, [location, zoom, currentDay, itineraryDays]);

  const handleHighlightLocation = (
    locationName: string,
    locationAddress: string
  ) => {
    const locationString = `${locationName} ${locationAddress}`.trim();
    setHighlightedLocation(locationString);

    fetch(
      `${API_BASE_URL}/maps/embed?q=${encodeURIComponent(
        locationString
      )}&zoom=${zoom + 1}`
    )
      .then((response) => response.json())
      .then((data) => {
        setMapUrl(data.mapUrl);
        setTimestamp(Date.now());
      })
      .catch((error) => {
        console.error("Error fetching map data:", error);
      });
  };

  const handleResetHighlight = () => {
    setHighlightedLocation(null);
    setTimestamp(Date.now()); // Force refresh map with all pins
  };

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
            {location || "Select a location"}
          </Typography>
        </Box>
        <Box>
          {itineraryDays.length > 0 && (
            <IconButton
              size="small"
              sx={{ mr: 1 }}
              onClick={handleNextDay}
              title="Cycle through itinerary days"
            >
              <TodayIcon />
            </IconButton>
          )}
          <IconButton
            size="small"
            sx={{ mr: 1 }}
            onClick={handleZoomIn}
            disabled={zoom >= MAX_ZOOM}
          >
            <ZoomInIcon />
          </IconButton>
          <IconButton
            size="small"
            sx={{ mr: 1 }}
            onClick={handleZoomOut}
            disabled={zoom <= MIN_ZOOM}
          >
            <ZoomOutIcon />
          </IconButton>
          <IconButton size="small">
            <MyLocationIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Day selector chips */}
      {itineraryDays.length > 0 && (
        <Box
          sx={{
            px: 2,
            py: 1,
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: headerBgColor,
          }}
        >
          <Chip
            label="All Days"
            color={currentDay === 0 ? "primary" : "default"}
            onClick={() => {
              setCurrentDay(0);
              setHighlightedLocation(null);
            }}
            size="small"
          />
          {itineraryDays.map((day, index) => (
            <Chip
              key={index}
              label={`Day ${index + 1}`}
              color={currentDay === index + 1 ? "primary" : "default"}
              onClick={() => {
                setCurrentDay(index + 1);
                setHighlightedLocation(null);
              }}
              size="small"
            />
          ))}
        </Box>
      )}

      {/* Main content with Map and Location List */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        {/* Location List Panel */}
        {itineraryDays.length > 0 && (
          <Collapse
            in={showLocationList}
            orientation="horizontal"
            sx={{
              width: { xs: "100%", sm: showLocationList ? "30%" : "0%" },
              height: { xs: showLocationList ? "40%" : "0%", sm: "100%" },
              flexShrink: 0,
              transition: "width 0.3s, height 0.3s",
              borderRight: "1px solid",
              borderBottom: { xs: "1px solid", sm: "none" },
              borderColor: "divider",
              overflowY: "auto",
              bgcolor: theme.palette.background.paper,
            }}
          >
            <List dense sx={{ p: 0 }}>
              <ListItem
                sx={{
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.03)",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => setShowLocationList(false)}
                  >
                    {theme.direction === "ltr" ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </IconButton>
                }
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle2">
                      {currentDay === 0
                        ? "All Locations"
                        : `Day ${currentDay} Locations`}
                    </Typography>
                  }
                />
              </ListItem>

              {getCurrentLocations().map((loc, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <Divider component="li" />}
                  <ListItemButton
                    selected={
                      highlightedLocation ===
                      `${loc.name} ${loc.location}`.trim()
                    }
                    onClick={() =>
                      handleHighlightLocation(loc.name, loc.location)
                    }
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {getLocationIcon(loc.category)}
                    </ListItemIcon>
                    <ListItemText
                      primary={loc.name}
                      secondary={
                        <Typography variant="caption" component="span" noWrap>
                          {loc.time && `${loc.time} • `}
                          {loc.location}
                        </Typography>
                      }
                      primaryTypographyProps={{
                        variant: "body2",
                        fontWeight: "medium",
                        noWrap: true,
                      }}
                    />
                  </ListItemButton>
                </React.Fragment>
              ))}

              {highlightedLocation && (
                <ListItem>
                  <Button
                    fullWidth
                    size="small"
                    onClick={handleResetHighlight}
                    variant="outlined"
                    sx={{ mt: 1 }}
                  >
                    Show All Pins
                  </Button>
                </ListItem>
              )}
            </List>
          </Collapse>
        )}

        {/* Map Area with Google Maps Embed API */}
        <Box
          sx={{
            flexGrow: 1,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: theme.palette.mode === "dark" ? "#1e2a3a" : "#e5f6fd",
          }}
        >
          {mapUrl ? (
            <>
              {!showLocationList && itineraryDays.length > 0 && (
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  sx={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    zIndex: 10,
                    opacity: 0.9,
                    minWidth: 0,
                    px: 1,
                  }}
                  onClick={() => setShowLocationList(true)}
                >
                  <PlaceIcon fontSize="small" />
                </Button>
              )}
              <iframe
                key={`map-${location}-${zoom}-${timestamp}-${currentDay}-${highlightedLocation}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={mapUrl}
              ></iframe>
            </>
          ) : (
            <Typography variant="body1" sx={{ p: 3 }}>
              Enter a location to display the map
            </Typography>
          )}
        </Box>
      </Box>

      {/* Footer with attribution */}
      <Box
        sx={{
          p: 1,
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: headerBgColor,
        }}
      >
        {currentDay > 0 && itineraryDays[currentDay - 1] && (
          <Typography variant="caption" color="text.primary">
            Day {currentDay}: {itineraryDays[currentDay - 1].date}
          </Typography>
        )}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ ml: "auto" }}
        >
          Map data ©2025 Google
        </Typography>
      </Box>
    </Paper>
  );
};

export default MapIntegration;
