import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  Divider,
  Paper,
  useTheme,
  Chip,
  Tooltip,
  FormControlLabel,
  Switch,
  Collapse,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import HotelIcon from "@mui/icons-material/Hotel";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ExploreIcon from "@mui/icons-material/Explore";
import { TripParametersData } from "./TripParameters";
import PDFService from "../services/PDFService"; 

// Add interface for the trip plan data matching the OpenAI response
interface TripPlanActivity {
  name: string;
  description: string;
  location: string;
  category: string;
  price: number;
  time: string;
  tags: string[];
}

interface TripPlanDay {
  date: string;
  hotel: string;
  activities: TripPlanActivity[];
  notes?: string;
}

interface TripPlan {
  destination: string;
  title: string;
  startDate: string | null;
  endDate: string | null;
  days: TripPlanDay[];
  budget: string;
  travelers: number;
  summary: string;
  tags: string[];
}

interface ItineraryDrawerProps {
  open: boolean;
  onClose: () => void;
  tripParameters: TripParametersData;
  onSideChange?: (side: "left" | "right") => void;
  onCollapseSidebar?: () => void;
  tripPlan?: TripPlan; // Add tripPlan prop
}

// Activity type with category for icons
type ActivityCategory =
  | "food"
  | "attraction"
  | "transport"
  | "accommodation"
  | "general";

// Add a constant for the sidebar widths
const SIDEBAR_COLLAPSED_WIDTH = 65; // Width in pixels when collapsed

const ItineraryDrawer: React.FC<ItineraryDrawerProps> = ({
  open,
  onClose,
  tripParameters,
  onSideChange,
  onCollapseSidebar,
  tripPlan,
}) => {
  const theme = useTheme();
  const [drawerSide, setDrawerSide] = useState<"left" | "right">("right");
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({});

  // Handle PDF download
  const handleDownloadPDF = () => {
    if (tripPlan) {
      PDFService.downloadPDF(tripPlan);
    } else if (tripParameters.location) {
      // Create a minimal trip plan if no complete plan exists
      const minimalPlan: TripPlan = {
        destination: tripParameters.location,
        title: `Trip to ${tripParameters.location}`,
        startDate: tripParameters.startDate ? tripParameters.startDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }) : null,
        endDate: tripParameters.endDate ? tripParameters.endDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }) : null,
        days: [],
        budget: tripParameters.budget,
        travelers: tripParameters.travelers,
        summary: `Trip plan for visiting ${tripParameters.location}. This is a draft itinerary that will be filled with activities and details once your trip is fully planned.`,
        tags: [tripParameters.location, tripParameters.budget]
      };
      PDFService.downloadPDF(minimalPlan);
    }
  };

  // Map OpenAI category to our icons
  const mapCategoryToIcon = (category: string): ActivityCategory => {
    var lowerCategory;
    if (category) {
      lowerCategory = category.toLowerCase();
    } else {
      lowerCategory = "food";
    }
    if (
      lowerCategory.includes("food") ||
      lowerCategory.includes("restaurant") ||
      lowerCategory.includes("dining") ||
      lowerCategory.includes("cafe") ||
      lowerCategory.includes("breakfast") ||
      lowerCategory.includes("lunch") ||
      lowerCategory.includes("dinner")
    ) {
      return "food";
    } else if (
      lowerCategory.includes("hotel") ||
      lowerCategory.includes("accommodation") ||
      lowerCategory.includes("stay") ||
      lowerCategory.includes("lodging") ||
      lowerCategory.includes("resort")
    ) {
      return "accommodation";
    } else if (
      lowerCategory.includes("transport") ||
      lowerCategory.includes("car") ||
      lowerCategory.includes("bus") ||
      lowerCategory.includes("taxi") ||
      lowerCategory.includes("drive") ||
      lowerCategory.includes("train") ||
      lowerCategory.includes("flight") ||
      lowerCategory.includes("transit")
    ) {
      return "transport";
    } else if (
      lowerCategory.includes("attraction") ||
      lowerCategory.includes("tour") ||
      lowerCategory.includes("visit") ||
      lowerCategory.includes("sightseeing") ||
      lowerCategory.includes("explore") ||
      lowerCategory.includes("hiking") ||
      lowerCategory.includes("museum")
    ) {
      return "attraction";
    } else {
      return "general";
    }
  };

  // Initialize expanded days based on tripPlan data
  useEffect(() => {
    if (tripPlan?.days) {
      const expanded: Record<number, boolean> = {};
      tripPlan.days.forEach((_, index) => {
        expanded[index + 1] = index < 2; // Expand first two days by default
      });
      setExpandedDays(expanded);
    }
  }, [tripPlan]);

  // Notify parent to collapse sidebar when drawer opens
  useEffect(() => {
    if (open && onCollapseSidebar) {
      onCollapseSidebar();
    }
  }, [open, onCollapseSidebar]);

  // Function to toggle drawer position
  const toggleDrawerPosition = () => {
    const newSide = drawerSide === "right" ? "left" : "right";
    setDrawerSide(newSide);
    // Notify parent component about the change
    if (onSideChange) {
      onSideChange(newSide);
    }
  };

  // Function to toggle day expansion
  const toggleDayExpansion = (dayNumber: number) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayNumber]: !prev[dayNumber],
    }));
  };

  // Get activity icon based on category
  const getActivityIcon = (category: ActivityCategory) => {
    switch (category) {
      case "food":
        return <RestaurantIcon fontSize="small" />;
      case "attraction":
        return <DirectionsWalkIcon fontSize="small" />;
      case "accommodation":
        return <HotelIcon fontSize="small" />;
      case "transport":
        return <DirectionsCarIcon fontSize="small" />;
      case "general":
        return <ExploreIcon fontSize="small" />;
      default:
        return <ExploreIcon fontSize="small" />;
    }
  };

  /*
  // Enhanced mock itinerary data with categories and locations
  const mockItineraryDays: ItineraryDay[] = [
    {
      day: 1,
      date: "Monday, June 12, 2023",
      location: "Miami, Florida",
      activities: [
        {
          time: "09:00 AM",
          activity: "Breakfast at Café del Sol",
          category: "food",
          cost: "$15",
          description:
            "Start your day with a traditional breakfast with ocean views",
        },
        {
          time: "10:30 AM",
          activity: "Guided City Tour",
          category: "attraction",
          cost: "$25",
          description:
            "Explore the historic downtown with a knowledgeable local guide",
        },
        {
          time: "01:00 PM",
          activity: "Lunch at Seaside Restaurant",
          category: "food",
          cost: "$30",
          description: "Fresh seafood with panoramic views of the coast",
        },
        {
          time: "03:00 PM",
          activity: "Visit National Museum",
          category: "attraction",
          cost: "$12",
          description: "Discover local art, history and cultural artifacts",
        },
        {
          time: "07:00 PM",
          activity: "Dinner at La Terraza",
          category: "food",
          cost: "$45",
          description:
            "Fine dining experience with local cuisine and wine pairing",
        },
      ],
      accommodationDetails: "Ocean View Hotel - Deluxe Room",
      weatherForecast: "Sunny, 75°F",
    },
    {
      day: 2,
      date: "Tuesday, June 13, 2023",
      location: "Key West, Florida",
      activities: [
        {
          time: "08:30 AM",
          activity: "Breakfast at hotel",
          category: "food",
          cost: "Included",
          description: "Buffet breakfast at your hotel",
        },
        {
          time: "10:00 AM",
          activity: "Hiking Tour at National Park",
          category: "attraction",
          cost: "$35",
          description:
            "Guided hiking tour through breathtaking trails with stunning views",
        },
        {
          time: "01:30 PM",
          activity: "Picnic lunch at Vista Point",
          category: "food",
          cost: "$20",
          description: "Packed lunch with panoramic views of the mountains",
        },
        {
          time: "04:00 PM",
          activity: "Local Artisan Market",
          category: "attraction",
          cost: "Free",
          description: "Shop for handcrafted souvenirs and local products",
        },
        {
          time: "07:30 PM",
          activity: "Authentic Local Cuisine Dinner",
          category: "food",
          cost: "$40",
          description:
            "Experience traditional dishes at a family-owned restaurant",
        },
      ],
      accommodationDetails: "Ocean View Hotel - Deluxe Room",
      weatherForecast: "Partly Cloudy, 72°F",
    },
  ];
  */

  // Convert tripPlan to itineraryDays format
  console.log("tripPlan in ItinDrawer: ", tripPlan);
  const itineraryDays = tripPlan?.days?.map((day, index) => {
    // Extract location from first activity, or use destination
    const location = day.activities[0]?.location || tripPlan.destination;

    return {
      day: index + 1,
      date: day.date,
      location: location,
      activities: day.activities.map((activity) => ({
        activity: activity.name,
        description: activity.description,
        location: activity.location,
        category: mapCategoryToIcon(activity.category),
        price: `${activity.price}`,
        time: activity.time,
        tags: activity.tags,
      })),
      hotel: day.hotel,
      weatherForecast: "Weather information currently not available",
    };
  });
  console.log("itineraryDays format: ", itineraryDays);

  return (
    <Drawer
      sx={{
        position: "fixed",
        zIndex: theme.zIndex.drawer + 100,
        "& .MuiDrawer-root": {
          position: "fixed",
          zIndex: theme.zIndex.drawer + 100,
        },
        "& .MuiBackdrop-root": {
          display: "none",
        },
        "& .MuiDrawer-paper": {
          // Adjust width calculation to account for sidebar
          width: {
            xs:
              drawerSide === "left"
                ? `calc(100vw - ${SIDEBAR_COLLAPSED_WIDTH}px - 16px)` // Leave space for collapsed sidebar
                : "calc(100vw - 16px)",
            sm:
              drawerSide === "left"
                ? `calc(100vw - ${SIDEBAR_COLLAPSED_WIDTH}px - 16px)`
                : "min(500px, calc(100vw - 16px))",
            // On medium and large screens, we want proportional layout
            md:
              drawerSide === "left"
                ? // For left drawer, take half the remaining space after accounting for sidebar
                  `calc((100vw - ${SIDEBAR_COLLAPSED_WIDTH}px) / 2)`
                : // For right drawer, take half the viewport (classic 50%)
                  "50%",
          },
          // Ensure a reasonable minimum width
          minWidth: {
            xs: "280px",
            sm: drawerSide === "left" ? "300px" : "350px",
          },
          // Set meaningful max width for large screens
          maxWidth:
            drawerSide === "left"
              ? `calc(100vw - ${SIDEBAR_COLLAPSED_WIDTH}px - 400px)` // Leave at least 400px for content
              : "calc(100vw - 400px)", // Same for right side
          position: "fixed",
          boxSizing: "border-box",
          backgroundImage:
            theme.palette.mode === "dark"
              ? "linear-gradient(rgba(25, 25, 25, 0.97), rgba(25, 25, 25, 0.97))"
              : "linear-gradient(rgba(248, 249, 250, 0.97), rgba(248, 249, 250, 0.97))",
          backgroundSize: "cover",
          paddingTop: 0,
          marginTop: "64px", // App bar height
          // Position accounting for sidebar
          left: drawerSide === "left" ? `${SIDEBAR_COLLAPSED_WIDTH}px` : "auto",
          right: drawerSide === "right" ? 0 : "auto",
          height: "calc(100vh - 64px)",
          boxShadow:
            drawerSide === "left"
              ? "5px 0 15px rgba(0,0,0,0.1)"
              : "-5px 0 15px rgba(0,0,0,0.1)",
          border: "none",
          transition: "transform 0.3s ease-in-out",
        },
      }}
      ModalProps={{
        keepMounted: true,
        style: {
          position: "fixed",
          zIndex: theme.zIndex.drawer + 100,
        },
      }}
      SlideProps={{
        easing: { enter: "ease-out", exit: "ease-in" },
        timeout: { enter: 300, exit: 200 },
      }}
      variant="temporary"
      hideBackdrop={true}
      anchor={drawerSide}
      open={open}
    >
      {/* Drawer Header */}
      <Box
        sx={{
          background: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          p: 2,
          position: "sticky",
          top: 0,
          zIndex: 9999,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h5" component="div" fontWeight="bold">
              {tripPlan?.title || "Your Itinerary"}
            </Typography>
            <Typography variant="subtitle1">
              {tripPlan?.destination ||
                tripParameters.location ||
                "Destination"}
            </Typography>
          </Box>
          <Box>
            <IconButton
              onClick={onClose}
              sx={{ color: theme.palette.primary.contrastText }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Trip details */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mt: 1,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Chip
            icon={<CalendarTodayIcon />}
            label={`${
              tripPlan?.startDate ||
              tripParameters.startDate?.toLocaleDateString() ||
              "Start date"
            } - ${
              tripPlan?.endDate ||
              tripParameters.endDate?.toLocaleDateString() ||
              "End date"
            }`}
            size="small"
            sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "inherit" }}
          />
          <Chip
            icon={<LocalOfferIcon />}
            label={`Budget: ${tripPlan?.budget || tripParameters.budget}`}
            size="small"
            sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "inherit" }}
          />
        </Box>
      </Box>

      <Divider />

      {/* Actions Bar */}
      <Box
        sx={{
          p: 1,
          display: "flex",
          justifyContent: "space-between",
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(0,0,0,0.2)"
              : "rgba(0,0,0,0.05)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={drawerSide === "left"}
              onChange={toggleDrawerPosition}
              name="drawerSideToggle"
              id="drawer-side-toggle"
            />
          }
          label={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <SwapHorizIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">Switch Side</Typography>
            </Box>
          }
        />

        <Box>
          <Tooltip title="Download PDF">
            <IconButton size="small" onClick={handleDownloadPDF}>
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Itinerary Content */}
      <Box sx={{ overflow: "auto", p: 2 }}>
        {/* Welcome card - Updated with a more vibrant gradient */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            backgroundImage: `linear-gradient(135deg, #FF9D6C, #FF6B95)`, // Vibrant orange to pink gradient
            color: "#ffffff",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            fontWeight="bold"
            sx={{
              textShadow: "0px 1px 3px rgba(0,0,0,0.4)",
              letterSpacing: "0.5px",
            }}
          >
            {itineraryDays?.length
              ? "Your Adventure Awaits!"
              : "Get started planning your trip!"}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textShadow: "0px 1px 2px rgba(0,0,0,0.3)",
              fontWeight: "medium",
            }}
          >
            {itineraryDays?.length ? (
              <>
                We've crafted an amazing {itineraryDays.length}-day experience
                in{" "}
                {tripPlan?.destination ||
                  tripParameters.location ||
                  "your destination"}
                .
                {tripPlan?.summary
                  ? ` ${tripPlan.summary}`
                  : " This itinerary has been personalized based on your preferences and travel style."}
              </>
            ) : (
              <>
                Once you've provided your travel preferences, your itinerary
                will be generated and displayed here!
              </>
            )}
          </Typography>
        </Paper>

        {/* Day-by-day itinerary */}
        {itineraryDays?.map((day) => (
          <Paper
            key={day.day}
            elevation={2}
            sx={{
              mb: 4,
              overflow: "hidden",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            {/* Day header with toggle */}
            <Box
              sx={{
                bgcolor: "primary.dark",
                color: "primary.contrastText",
                p: 2,
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
              onClick={() => toggleDayExpansion(day.day)}
            >
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Day {day.day}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: 0.5,
                    gap: 2,
                  }}
                >
                  <Typography variant="body2">{day.date}</Typography>
                  <Chip
                    icon={<LocationOnIcon fontSize="small" />}
                    label={day.location}
                    size="small"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.3)",
                      color: "inherit",
                      fontSize: "0.75rem",
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <Chip
                  label={day.weatherForecast}
                  size="small"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "inherit",
                    fontSize: "0.75rem",
                    mr: 1,
                  }}
                />
                <IconButton
                  size="small"
                  sx={{ color: "white", mt: -1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDayExpansion(day.day);
                  }}
                >
                  {expandedDays[day.day] ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </Box>
            </Box>

            {/* Accommodation - Always visible */}
            <Box
              sx={{
                bgcolor: "rgba(0,0,0,0.03)",
                p: 1.5,
                borderBottom: expandedDays[day.day] ? "1px solid" : "none",
                borderColor: "divider",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <HotelIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="body2" fontWeight="medium">
                  {day.hotel}
                </Typography>
              </Box>
            </Box>

            {/* Collapsible activities section */}
            <Collapse in={expandedDays[day.day]}>
              {/* Activities */}
              <List sx={{ pt: 0 }}>
                {day.activities.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        p: 2,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor:
                            theme.palette.mode === "dark"
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(0,0,0,0.02)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          minWidth: "80px",
                          pr: 2,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight="bold"
                        >
                          {item.time}
                        </Typography>
                        {getActivityIcon(item.category) && (
                          <Box sx={{ mt: 1, color: "primary.main" }}>
                            {getActivityIcon(item.category)}
                          </Box>
                        )}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" fontWeight="medium">
                          {item.activity}
                        </Typography>
                        {item.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            {item.description}
                          </Typography>
                        )}
                        {item.price && (
                          <Chip
                            label={item.price}
                            size="small"
                            sx={{ mt: 1, fontSize: "0.7rem" }}
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </ListItem>
                    {index < day.activities.length - 1 && (
                      <Divider component="li" />
                    )}
                  </React.Fragment>
                ))}
              </List>

              {/* Day summary */}
              <Box
                sx={{
                  p: 2,
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(0,0,0,0.2)"
                      : "rgba(0,0,0,0.03)",
                  borderTop: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="body2" fontStyle="italic">
                  {tripPlan?.days?.[day.day - 1]?.notes ||
                    `Enjoy your day in ${day.location}! All activities have been arranged with your preferences in mind.`}
                </Typography>
              </Box>
            </Collapse>
          </Paper>
        ))}

        {itineraryDays?.length ? (
          <Paper
            elevation={1}
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 2,
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(0,0,0,0.02)",
              border: "1px dashed",
              borderColor: "divider",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              This itinerary is flexible and can be adjusted as needed. All
              reservations have been confirmed. Please keep a digital or printed
              copy of this itinerary during your travels.
            </Typography>
          </Paper>
        ) : (
          ""
        )}
      </Box>
    </Drawer>
  );
};

export default ItineraryDrawer;
