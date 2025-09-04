import { MyLocation as MyLocationIcon } from "@mui/icons-material";
import { Box, IconButton, Skeleton } from "@mui/material";
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
    </Box>
  );
};

export default TrafficMap;
