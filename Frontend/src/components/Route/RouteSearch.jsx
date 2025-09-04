import {
  Clear as ClearIcon,
  LocationOn as LocationIcon,
  Navigation as NavigationIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

const RouteSearch = ({ onRouteSelect, selectedRoute }) => {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Demo locations in Bangladesh for autocomplete
  const demoLocations = [
    "Dhaka, Bangladesh",
    "Chittagong, Bangladesh",
    "Sylhet, Bangladesh",
    "Rajshahi, Bangladesh",
    "Khulna, Bangladesh",
    "Barisal, Bangladesh",

    "Rangpur, Bangladesh",
    "Mymensingh, Bangladesh",
    "Dhanmondi, Dhaka",
    "Gulshan, Dhaka",
    "Uttara, Dhaka",
    "Wari, Dhaka",
    "Motijheel, Dhaka",
  ];

  const calculateRoute = async () => {
    if (!startLocation.trim() || !endLocation.trim()) {
      setError("Please enter both start and destination locations");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Demo route calculation - in real app, use routing service like OpenRouteService or MapBox
      const demoRouteData = {
        start: {
          name: startLocation,
          coordinates: [90.4125, 23.8103], // Demo coordinates for Dhaka
        },
        end: {
          name: endLocation,
          coordinates: [90.42, 23.82], // Demo destination coordinates
        },
        waypoints: [
          [90.4125, 23.8103],
          [90.415, 23.813],
          [90.4175, 23.816],
          [90.42, 23.82],
        ],
        distance: "12.5 km",
        duration: "25 mins",
        trafficCondition: "moderate",
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onRouteSelect(demoRouteData);
    } catch (err) {
      setError("Failed to calculate route. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearRoute = () => {
    setStartLocation("");
    setEndLocation("");
    onRouteSelect(null);
    setError("");
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Find Route
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          fullWidth
          label="Start Location"
          value={startLocation}
          onChange={(e) => setStartLocation(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationIcon color="success" />
              </InputAdornment>
            ),
          }}
          placeholder="Enter starting point"
          helperText="e.g., Dhanmondi, Dhaka"
        />

        <TextField
          fullWidth
          label="Destination"
          value={endLocation}
          onChange={(e) => setEndLocation(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationIcon color="error" />
              </InputAdornment>
            ),
          }}
          placeholder="Enter destination"
          helperText="e.g., Gulshan, Dhaka"
        />

        {error && (
          <Alert severity="error" size="small">
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            onClick={calculateRoute}
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={16} /> : <NavigationIcon />
            }
            fullWidth
          >
            {loading ? "Finding Route..." : "Find Route"}
          </Button>

          {selectedRoute && (
            <Button
              variant="outlined"
              onClick={clearRoute}
              startIcon={<ClearIcon />}
            >
              Clear
            </Button>
          )}
        </Box>

        {selectedRoute && (
          <Alert severity="success">
            <Typography variant="body2">
              <strong>Route Found:</strong>
              <br />
              {selectedRoute.start.name} → {selectedRoute.end.name}
              <br />
              Distance: {selectedRoute.distance} | Duration:{" "}
              {selectedRoute.duration}
            </Typography>
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

export default RouteSearch;
