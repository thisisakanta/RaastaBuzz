import {
  Clear as ClearIcon,
  LocationOn as LocationIcon,
  MyLocation as MyLocationIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  Autocomplete,
  DirectionsRenderer,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useRef, useState } from "react";

// Dhaka center coordinates for Bangladesh
const center = { lat: 23.8103, lng: 90.4125 };

const TrafficMap = ({ selectedRoute, onReportClick }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
      "AIzaSyCSMbnY17KJt2Y3J0iJau5zrcJ8dHLxGdo",
    libraries: ["places"],
  });

  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  const originRef = useRef();
  const destinationRef = useRef();

  if (!isLoaded) {
    return (
      <Box sx={{ height: "100%", p: 2 }}>
        <Skeleton variant="rectangular" height="100%" />
      </Box>
    );
  }

  async function calculateRoute() {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }

    try {
      const directionsService = new window.google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });

      setDirectionsResponse(results);
      setDistance(results.routes[0].legs[0].distance.text);
      setDuration(results.routes[0].legs[0].duration.text);
    } catch (error) {
      console.error("Error calculating route:", error);
    }
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destinationRef.current.value = "";
  }

  function centerMap() {
    if (map) {
      map.panTo(center);
      map.setZoom(12);
    }
  }

  return (
    <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
      {/* Google Map Container */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
        }}
      >
        <GoogleMap
          center={center}
          zoom={12}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </Box>

      {/* Route Search Panel */}
      <Paper
        elevation={3}
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          right: 16,
          zIndex: 1000,
          p: 2,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Stack spacing={2}>
          {/* Input Fields */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Box sx={{ flexGrow: 1 }}>
              <Autocomplete>
                <TextField
                  inputRef={originRef}
                  fullWidth
                  placeholder="Enter starting point"
                  label="From"
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <LocationIcon color="success" sx={{ mr: 1 }} />
                    ),
                  }}
                />
              </Autocomplete>
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <Autocomplete>
                <TextField
                  inputRef={destinationRef}
                  fullWidth
                  placeholder="Enter destination"
                  label="To"
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <LocationIcon color="error" sx={{ mr: 1 }} />
                    ),
                  }}
                />
              </Autocomplete>
            </Box>

            <ButtonGroup variant="contained" size="small">
              <Button onClick={calculateRoute} color="primary">
                Calculate Route
              </Button>
              <IconButton onClick={clearRoute} color="primary" size="small">
                <ClearIcon />
              </IconButton>
            </ButtonGroup>
          </Stack>

          {/* Route Information */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" color="text.secondary">
              Distance: <strong>{distance}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Duration: <strong>{duration}</strong>
            </Typography>
            <IconButton
              onClick={centerMap}
              color="primary"
              size="small"
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              <MyLocationIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Paper>

      {/* Instructions */}
      {!directionsResponse && (
        <Paper
          elevation={2}
          sx={{
            position: "absolute",
            bottom: 16,
            left: 16,
            right: 16,
            zIndex: 1000,
            p: 2,
            backgroundColor: "rgba(33, 150, 243, 0.9)",
            color: "white",
          }}
        >
          <Typography variant="body2" textAlign="center">
            🗺️ Enter origin and destination to find the best route in Bangladesh
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default TrafficMap;
