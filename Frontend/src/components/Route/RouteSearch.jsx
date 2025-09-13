import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Clear as ClearIcon,
  LocationOn as LocationIcon,
  MyLocation,
  Navigation as NavigationIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";

import TrafficReportsList from "../Traffic/TrafficReportsList"; // Import the TrafficReportsList component

const libraries = ["places"];

const RouteSearch = ({ onRouteCalculated, routeData, onClearRoute }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [routes, setRoutes] = useState([]);
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(0);

  const originRef = useRef();
  const destinationRef = useRef();

  // Ensure Google Maps API is loaded
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  // Autofill start location with current location
  useEffect(() => {
    if (isLoaded && window.google && originRef.current) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const geocoder = new window.google.maps.Geocoder();
            const latlng = { lat: latitude, lng: longitude };
            geocoder.geocode({ location: latlng }, (results, status) => {
              if (status === "OK" && results[0]) {
                originRef.current.value = results[0].formatted_address;
              } else {
                originRef.current.value = `${latitude}, ${longitude}`;
              }
            });
          },
          (error) => {
            // If user denies location, leave blank or show error
            console.error("Geolocation error:", error);
          }
        );
      }
    }
  }, [isLoaded]);

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
        provideRouteAlternatives: true,
      });

      setRoutes(results.routes);
      setSelectedRouteIdx(0);

      const route = results.routes[0];
      const leg = route.legs[0];

      // Pass the complete directions response and route info to parent
      onRouteCalculated({
        directionsResponse: { ...results, routes: [route] },
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

  // Handle arrow click to change route
  const handleRouteChange = (direction) => {
    let newIdx = selectedRouteIdx + direction;
    if (newIdx < 0) newIdx = routes.length - 1;
    if (newIdx >= routes.length) newIdx = 0;
    setSelectedRouteIdx(newIdx);

    const route = routes[newIdx];
    const leg = route.legs[0];
    console.log(route);
    onRouteCalculated({
      directionsResponse: {
        ...routeData.directionsResponse,
        routes: [route],
      },
      distance: leg.distance.text,
      duration: leg.duration.text,
      startAddress: leg.start_address,
      endAddress: leg.end_address,
    });
  };

  const clearRoute = () => {
    if (originRef.current) originRef.current.value = "";
    if (destinationRef.current) destinationRef.current.value = "";
    setError("");
    setRoutes([]);
    setSelectedRouteIdx(0);
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
          <Box sx={{ display: "flex", gap: 1 }}>
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
            <IconButton
              color="primary"
              sx={{ border: "1px solid #90caf9", bgcolor: "white" }}
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    async (position) => {
                      const { latitude, longitude } = position.coords;
                      // Optionally, reverse geocode to address using Google Maps API
                      if (window.google && window.google.maps) {
                        const geocoder = new window.google.maps.Geocoder();
                        const latlng = { lat: latitude, lng: longitude };
                        geocoder.geocode(
                          { location: latlng },
                          (results, status) => {
                            if (status === "OK" && results[0]) {
                              originRef.current.value =
                                results[0].formatted_address;
                            } else {
                              originRef.current.value = `${latitude}, ${longitude}`;
                            }
                          }
                        );
                      } else {
                        originRef.current.value = `${latitude}, ${longitude}`;
                      }
                    },
                    () => {
                      // Handle error or permission denied
                    }
                  );
                }
              }}
              title="Use current location"
            >
              <MyLocation />
            </IconButton>
          </Box>
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

        {/* Route Information Display & Arrow Controls */}
        {routeData && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              {routes.length > 1 && (
                <IconButton
                  size="small"
                  onClick={() => handleRouteChange(-1)}
                  sx={{ mr: 1 }}
                  aria-label="Previous route"
                >
                  <ArrowBackIcon />
                </IconButton>
              )}
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                <strong>Route Found:</strong>
              </Typography>
              {routes.length > 1 && (
                <IconButton
                  size="small"
                  onClick={() => handleRouteChange(1)}
                  sx={{ ml: 1 }}
                  aria-label="Next route"
                >
                  <ArrowForwardIcon />
                </IconButton>
              )}
            </Box>
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
              {routes.length > 1 && (
                <Chip
                  label={`Option ${selectedRouteIdx + 1} of ${routes.length}`}
                  size="small"
                  color="info"
                  variant="outlined"
                />
              )}
            </Stack>
            <Typography variant="caption" color="text.secondary">
              From: {routeData.startAddress}
              <br />
              To: {routeData.endAddress}
            </Typography>
          </Alert>
        )}

        {/* Traffic Reports List - New Feature */}
        {routeData && (
          <TrafficReportsList
            maxItems={10}
            pathCoords={routes?.[selectedRouteIdx]?.overview_path || []}
            radiusKm={0.1}
          />
        )}
      </Stack>
    </Paper>
  );
};

export default RouteSearch;
