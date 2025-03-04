import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  IconButton,
  Box,
  Chip,
  CardActionArea,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Trip } from "../types/trip";
import { format } from "date-fns";

interface TripCardProps {
  trip: Trip;
  onToggleFavorite: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onShare: () => void;
  viewMode: "grid" | "list";
}

// Instead of using a styled component with a viewMode prop,
// we'll create a function that returns the appropriate styles
const getCardStyles = (viewMode: "grid" | "list", theme: any) => ({
  height: "100%",
  display: "flex",
  flexDirection: viewMode === "list" ? "row" : "column",
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[6],
  },
});

const TripCard: React.FC<TripCardProps> = ({
  trip,
  onToggleFavorite,
  onDelete,
  onEdit,
  onShare,
  viewMode,
}) => {
  const formatDateRange = (start: Date, end: Date) => {
    return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
  };

  return (
    <Card sx={(theme) => getCardStyles(viewMode, theme)}>
      {viewMode === "grid" ? (
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image={trip.imageUrl}
            alt={trip.title}
          />
        </CardActionArea>
      ) : (
        <CardMedia
          component="img"
          sx={{ width: 200, minWidth: 200, height: 200 }}
          image={trip.imageUrl}
          alt={trip.title}
        />
      )}
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Typography gutterBottom variant="h5" component="div">
              {trip.title}
            </Typography>
            <IconButton
              size="small"
              color={trip.isFavorite ? "error" : "default"}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
            >
              {trip.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {trip.description}
          </Typography>
          <Chip
            label={formatDateRange(trip.startDate, trip.endDate)}
            size="small"
            sx={{ mt: 1 }}
          />
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            aria-label="edit"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onShare();
            }}
            aria-label="share"
          >
            <ShareIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            aria-label="delete"
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </CardActions>
      </Box>
    </Card>
  );
};

export default TripCard;
