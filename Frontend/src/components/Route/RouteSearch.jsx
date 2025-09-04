import {
  Clear as ClearIcon,
  LocationOn as LocationIcon,
  Navigation as NavigationIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { useRef, useState } from "react";

const libraries = ["places"];

const RouteSearch = ({ onRouteCalculated, routeData, onClearRoute }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const originRef = useRef();
  const destinationRef = useRef();

  // Ensure Google Maps API is loaded
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey:
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY",
    libraries: libraries,
  });

  const calculateRoute = async () => {
    // Check if Google Maps API is loaded
    if (!isLoaded || !window.google) {
      setError("Google Maps is loading. Please try again in a moment.");
      return;
    }

    if (
      !originRef.current?.value.trim() ||
      !destinationRef.current?.value.trim()
    ) {
      setError("Please enter both start and destination locations");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const directionsService = new window.google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });

      const route = results.routes[0];
      const leg = route.legs[0];

      // Pass the complete directions response and route info to parent
      onRouteCalculated({
        directionsResponse: results,
        distance: leg.distance.text,
        duration: leg.duration.text,
        startAddress: leg.start_address,
        endAddress: leg.end_address,
      });
    } catch (err) {
      setError(
        "Failed to calculate route. Please check the locations and try again."
      );
      console.error("Route calculation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearRoute = () => {
    if (originRef.current) originRef.current.value = "";
    if (destinationRef.current) destinationRef.current.value = "";
    setError("");
    onClearRoute();
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      calculateRoute();
    }
  };

  // Show loading state while Google Maps API loads
  if (loadError) {
    return (
      <Paper sx={{ p: 2 }}>
        <Alert severity="error">
          Failed to load Google Maps. Please check your API key.
        </Alert>
      </Paper>
    );
  }

  if (!isLoaded) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Find Route
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <CircularProgress />
        </Box>
        <Typography variant="body2" color="text.secondary" align="center">
          Loading Google Maps...
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Find Route
      </Typography>

      <Stack spacing={2}>
        {/* Start Location */}
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Start Location
          </Typography>
          <Autocomplete>
            <TextField
              inputRef={originRef}
              fullWidth
              placeholder="Enter starting point"
              variant="outlined"
              size="small"
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon color="success" />
                  </InputAdornment>
                ),
              }}
            />
          </Autocomplete>
          <Typography variant="caption" color="text.secondary">
            e.g., Dhanmondi, Dhaka
          </Typography>
        </Box>

        {/* Destination */}
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Destination
          </Typography>
          <Autocomplete>
            <TextField
              inputRef={destinationRef}
              fullWidth
              placeholder="Enter destination"
              variant="outlined"
              size="small"
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon color="error" />
                  </InputAdornment>
                ),
              }}
            />
          </Autocomplete>
          <Typography variant="caption" color="text.secondary">
            e.g., Gulshan, Dhaka
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" size="small">
            {error}
          </Alert>
        )}

        {/* Action Buttons */}
        <Button
          variant="contained"
          onClick={calculateRoute}
          disabled={loading || !isLoaded}
          startIcon={
            loading ? <CircularProgress size={16} /> : <NavigationIcon />
          }
          fullWidth
          sx={{ textTransform: "uppercase" }}
        >
          {loading ? "Finding Route..." : "Find Route"}
        </Button>

        {routeData && (
          <Button
            variant="outlined"
            onClick={clearRoute}
            startIcon={<ClearIcon />}
            fullWidth
          >
            Clear Route
          </Button>
        )}

        {/* Route Information Display */}
        {routeData && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Route Found:</strong>
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <Chip
                label={`Distance: ${routeData.distance}`}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip
                label={`Duration: ${routeData.duration}`}
                size="small"
                color="secondary"
                variant="outlined"
              />
            </Stack>
            <Typography variant="caption" color="text.secondary">
              From: {routeData.startAddress}
              <br />
              To: {routeData.endAddress}
            </Typography>
          </Alert>
        )}
      </Stack>
    </Paper>
  );
};

export default RouteSearch;
