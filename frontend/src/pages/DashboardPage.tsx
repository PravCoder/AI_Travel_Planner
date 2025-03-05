import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Box, Typography, Button, ButtonGroup, Grid } from "@mui/material";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import AddIcon from "@mui/icons-material/Add";
import TripCard from "../components/TripCard";
import { Trip } from "../types/trip";

const DashboardHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(3),
}));

export default function Dashboard() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch trips from your API
    const fetchTrips = async () => {
      try {
        // Mock data for now
        const mockTrips: Trip[] = [
          {
            id: "1",
            title: "Paris Getaway",
            description: "A romantic week in Paris",
            startDate: new Date("2023-06-15"),
            endDate: new Date("2023-06-22"),
            imageUrl:
              "https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg",
            isFavorite: true,
          },
          {
            id: "2",
            title: "Tokyo Adventure",
            description: "Exploring the vibrant city of Tokyo",
            startDate: new Date("2023-08-10"),
            endDate: new Date("2023-08-20"),
            imageUrl: "https://i.imgur.com/ELOjp7x.jpeg",
            isFavorite: false,
          },
          {
            id: "3",
            title: "New York City",
            description: "The Big Apple experience",
            startDate: new Date("2023-09-05"),
            endDate: new Date("2023-09-12"),
            imageUrl:
              "https://plus.unsplash.com/premium_photo-1672082422409-879d79636902?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bmV3JTIweW9yayUyMGNpdHl8ZW58MHx8MHx8fDA%3D",
            isFavorite: false,
          },
        ];

        setTrips(mockTrips);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trips:", error);
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleAddTrip = () => {
    // Navigate to trip creation page or open modal
    console.log("Add new trip");
  };

  const handleToggleFavorite = (tripId: string) => {
    setTrips(
      trips.map((trip) =>
        trip.id === tripId ? { ...trip, isFavorite: !trip.isFavorite } : trip
      )
    );
  };

  const handleDeleteTrip = (tripId: string) => {
    setTrips(trips.filter((trip) => trip.id !== tripId));
  };

  const handleEditTrip = (tripId: string) => {
    // Navigate to trip edit page
    console.log("Edit trip:", tripId);
  };

  const handleShareTrip = (tripId: string) => {
    // Open share dialog
    console.log("Share trip:", tripId);
  };

  return (
    <>
      <DashboardHeader>
        <Typography variant="h4" component="h1">
          My Trips
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ButtonGroup sx={{ mr: 2 }}>
            <Button
              variant={viewMode === "grid" ? "contained" : "outlined"}
              onClick={() => setViewMode("grid")}
            >
              <ViewModuleIcon />
            </Button>
            <Button
              variant={viewMode === "list" ? "contained" : "outlined"}
              onClick={() => setViewMode("list")}
            >
              <ViewListIcon />
            </Button>
          </ButtonGroup>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddTrip}
          >
            New Trip
          </Button>
        </Box>
      </DashboardHeader>

      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
              <Box
                sx={{ height: 250, bgcolor: "action.hover", borderRadius: 1 }}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {trips.map((trip) => (
            <Grid
              item
              xs={12}
              sm={viewMode === "list" ? 12 : 6}
              md={viewMode === "list" ? 12 : 4}
              lg={viewMode === "list" ? 12 : 3}
              key={trip.id}
            >
              <TripCard
                trip={trip}
                onToggleFavorite={() => handleToggleFavorite(trip.id)}
                onDelete={() => handleDeleteTrip(trip.id)}
                onEdit={() => handleEditTrip(trip.id)}
                onShare={() => handleShareTrip(trip.id)}
                viewMode={viewMode}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
