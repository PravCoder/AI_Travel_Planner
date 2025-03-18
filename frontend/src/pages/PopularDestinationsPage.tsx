import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  CardActions,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ExploreIcon from "@mui/icons-material/Explore";

// Define the destination interface
interface Destination {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  tags: string[];
  bestTimeToVisit: string;
}

/**
 * PopularDestinationsPage Component
 *
 * Displays a curated list of popular travel destinations
 * Users can click on a destination to start planning a trip
 */
const PopularDestinationsPage: React.FC = () => {
  const navigate = useNavigate();

  // List of popular destinations
  const popularDestinations: Destination[] = [
    {
      id: "paris",
      name: "Paris, France",
      description:
        "Experience the romance, art, and cuisine of the City of Light. Visit the iconic Eiffel Tower, Louvre Museum, and stroll along the Seine River.",
      imageUrl:
        "https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg",
      tags: ["Romantic", "Historical", "Art & Culture"],
      bestTimeToVisit: "April to June, September to November",
    },
    {
      id: "tokyo",
      name: "Tokyo, Japan",
      description:
        "Discover the perfect blend of traditional culture and cutting-edge technology in Japan's vibrant capital city.",
      imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
      tags: ["Modern", "Cultural", "Foodie"],
      bestTimeToVisit: "March to May, September to November",
    },
    {
      id: "new-york",
      name: "New York City, USA",
      description:
        "Explore the Big Apple with its iconic skyline, Central Park, Broadway shows, and diverse neighborhoods.",
      imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
      tags: ["Urban", "Shopping", "Entertainment"],
      bestTimeToVisit: "April to June, September to November",
    },
    {
      id: "rome",
      name: "Rome, Italy",
      description:
        "Step back in time in the Eternal City with its ancient ruins, Renaissance art, and world-famous cuisine.",
      imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5",
      tags: ["Historical", "Art & Culture", "Foodie"],
      bestTimeToVisit: "April to June, September to October",
    },
    {
      id: "bangkok",
      name: "Bangkok, Thailand",
      description:
        "Experience the vibrant street life, ornate temples, and world-renowned cuisine of Thailand's exciting capital city.",
      imageUrl:
        "https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=800",
      tags: ["Cultural", "Temples", "Food", "Shopping"],
      bestTimeToVisit: "November to February",
    },
    {
      id: "bali",
      name: "Bali, Indonesia",
      description:
        "Relax on pristine beaches, explore lush rice terraces, and experience the unique spiritual culture of this tropical paradise.",
      imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
      tags: ["Beach", "Nature", "Spiritual"],
      bestTimeToVisit: "April to October",
    },
  ];

  // Handle click to start planning a trip to the selected destination
  const handlePlanTrip = (destination: Destination) => {
    // Navigate to trip creation page with the destination pre-selected
    navigate(`/create-trip?destination=${destination.name}`);
    // In a full implementation, you would pass more data or use context/redux
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <ExploreIcon sx={{ fontSize: 32, mr: 2, color: "primary.main" }} />
        <Typography variant="h4" component="h1" fontWeight="medium">
          Popular Destinations
        </Typography>
      </Box>

      {/* Intro Text */}
      <Typography variant="body1" sx={{ mb: 4 }}>
        Explore some of the world's most iconic destinations and start planning
        your dream trip today. These carefully selected locations offer
        unforgettable experiences for every type of traveler.
      </Typography>

      {/* Destinations Grid */}
      <Grid container spacing={4}>
        {popularDestinations.map((destination) => (
          <Grid item xs={12} md={6} lg={4} key={destination.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={destination.imageUrl}
                alt={destination.name}
                sx={{ objectFit: "cover" }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {destination.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {destination.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mb: 0.5 }}
                  >
                    Best time to visit: {destination.bestTimeToVisit}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {destination.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                </Box>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handlePlanTrip(destination)}
                >
                  Plan a Trip
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PopularDestinationsPage;
