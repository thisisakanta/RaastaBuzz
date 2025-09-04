import { MyLocation as MyLocationIcon } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Typography,
  Chip,
} from "@mui/material";
import {
  DirectionsRenderer,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useState } from "react";

// Dhaka center coordinates for Bangladesh
const center = { lat: 23.8103, lng: 90.4125 };

const TrafficMap = ({ routeData, onReportClick }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY",
    libraries: ["places"],
  });

  const [map, setMap] = useState(null);

  if (!isLoaded) {
    return (
      <Box sx={{ height: "100%", p: 2 }}>
        <Skeleton variant="rectangular" height="100%" />
      </Box>
    );
  }

  function centerMap() {
    if (map) {
      map.panTo(center);
      map.setZoom(12);
    }
  }

  return (
    <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
      {/* Clean Google Map */}
      <GoogleMap
        center={center}
        zoom={12}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        options={{
          zoomControl: true,
          streetViewControl: true,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
        onLoad={(map) => setMap(map)}
        onClick={onReportClick}
      >
        {/* Default center marker - only show when no route */}
        {!routeData?.directionsResponse && <Marker position={center} />}

        {/* Route Display */}
        {routeData?.directionsResponse && (
          <DirectionsRenderer
            directions={routeData.directionsResponse}
            options={{
              suppressMarkers: false,
              polylineOptions: {
                strokeColor: "#1976d2",
                strokeWeight: 5,
                strokeOpacity: 0.8,
              },
            }}
          />
        )}
      </GoogleMap>

      {/* Center Map Button */}
      <IconButton
        onClick={centerMap}
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
          zIndex: 1000,
          backgroundColor: "primary.main",
          color: "white",
          "&:hover": {
            backgroundColor: "primary.dark",
          },
          boxShadow: 2,
        }}
      >
        <MyLocationIcon />
      </IconButton>

      {/* Route Information Overlay - Only when route exists */}
      {routeData?.directionsResponse && (
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 1000,
            p: 2,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            minWidth: 200,
          }}
        >
          <Stack spacing={1} alignItems="center">
            <Typography variant="subtitle2" color="primary" fontWeight="bold">
              Route Found
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip
                label={`${routeData.distance}`}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip
                label={`${routeData.duration}`}
                size="small"
                color="secondary"
                variant="outlined"
              />
            </Stack>
          </Stack>
        </Paper>
      )}
    </Box>
  );
};

export default TrafficMap;
