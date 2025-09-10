import {
  MyLocation as MyLocationIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Chip,
  Dialog,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { trafficReportService } from "../../services/trafficReportService";

// Dhaka center coordinates for Bangladesh
const center = { lat: 23.8103, lng: 90.4125 };

// Utility to create a data URL for an emoji SVG
const emojiToDataUrl = (emoji) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-size="32">${emoji}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

// Category icons as emoji data URLs
const getCategoryIcon = (category) => {
  const iconMap = {
    TRAFFIC_JAM: "🚗",
    ACCIDENT: "🚨",
    ROAD_CLOSED: "🚧",
    CHECKPOINT: "👮",
    CONSTRUCTION: "🏗️",
    FLOODING: "🌊",
    OTHER: "📍",
  };
  const emoji = iconMap[category] || iconMap.OTHER;
  return {
    url: emojiToDataUrl(emoji),
    scaledSize: new window.google.maps.Size(32, 32),
  };
};

// Severity color mapping
const getSeverityColor = (severity) => {
  const colors = {
    LOW: "#4caf50",
    MEDIUM: "#ff9800",
    HIGH: "#f44336",
    CRITICAL: "#9c27b0",
  };
  return colors[severity] || colors.LOW;
};

// Format category name for display
const formatCategoryName = (category) => {
  return category
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

// Calculate time ago
const getTimeAgo = (dateString) => {
  const now = new Date();
  const reportTime = new Date(dateString);
  const diffInMinutes = Math.floor((now - reportTime) / (1000 * 60));

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)}h ago`;
  } else {
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }
};

const isRecentReport = (report) => {
  const now = new Date();
  const reportTime = new Date(report.createdAt);
  return (now - reportTime) / (1000 * 60 * 60) < 24;
};

const TrafficMap = ({ routeData, onReportClick, isLoaded }) => {
  const { user } = useAuth();
  const [map, setMap] = useState(null);
  const [trafficReports, setTrafficReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const directionsRendererRef = useRef(null);

  // Fetch traffic reports
  const fetchTrafficReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const reports = await trafficReportService.getAllReports();
      console.log("Fetched reports:", reports);
      setTrafficReports(reports);
    } catch (err) {
      console.error("Error fetching traffic reports:", err);
      setError("Failed to load traffic reports");
      setTrafficReports([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load reports on component mount
  useEffect(() => {
    if (isLoaded) {
      fetchTrafficReports();
    }
  }, [isLoaded, fetchTrafficReports]);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = trafficReportService.subscribeToUpdates((report) => {
      setTrafficReports((prevReports) => {
        if (!report.active) {
          console.log(trafficReports[5].imageUrl);
          return prevReports.filter((r) => r.id !== report.id);
        } else if (isRecentReport(report)) {
          const exists = prevReports.some((r) => r.id === report.id);
          let updated;
          if (exists) {
            updated = prevReports.map((r) => (r.id === report.id ? report : r));
          } else {
            updated = [...prevReports, report];
          }
          updated.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          console.log(trafficReports[5].imageUrl);
          return updated;
        }
        console.log(trafficReports[5].imageUrl);
        return prevReports;
      });
    });

    return () => unsubscribe();
  }, []);

  // Initialize DirectionsRenderer
  useEffect(() => {
    if (isLoaded && map) {
      // Initialize DirectionsRenderer if not already
      if (!directionsRendererRef.current) {
        directionsRendererRef.current =
          new window.google.maps.DirectionsRenderer({
            map,
            suppressMarkers: false,
            polylineOptions: {
              strokeColor: "#1976d2",
              strokeWeight: 5,
              strokeOpacity: 0.8,
            },
          });
      }

      // Update or clear directions
      if (routeData?.directionsResponse) {
        directionsRendererRef.current.setDirections(
          routeData.directionsResponse
        );
        directionsRendererRef.current.setMap(map); // Attach to map
      } else {
        directionsRendererRef.current.setDirections(null);
        directionsRendererRef.current.setMap(null); // Detach from map
      }
    }
  }, [routeData, isLoaded, map]);

  // Handle voting on reports
  const handleVote = async (reportId, voteType) => {
    if (!user) return;

    try {
      await trafficReportService.voteOnReport(reportId, voteType);
      await fetchTrafficReports();
    } catch (error) {
      console.error("Error voting on report:", error);
    }
  };

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
        onLoad={(map) => {
          console.log("Map loaded");
          setMap(map);
        }}
        onClick={(event) => {
          setSelectedReport(null);
          if (onReportClick) {
            onReportClick(event);
          }
        }}
      >
        {/* Traffic Report Markers */}
        {trafficReports.map((report) => (
          <Marker
            key={report.id}
            position={{ lat: report.latitude, lng: report.longitude }}
            icon={getCategoryIcon(report.category)}
            title={report.title}
            onClick={() => setSelectedReport(report)}
          />
        ))}

        {/* Highlight Selected Report Marker */}
        {selectedReport && (
          <Marker
            position={{
              lat: selectedReport.latitude,
              lng: selectedReport.longitude,
            }}
            icon={{
              url: getCategoryIcon(selectedReport.category).url,
              scaledSize: new window.google.maps.Size(44, 44),
            }}
            zIndex={999}
          />
        )}

        {/* Info Window for Selected Report */}
        {selectedReport && (
          <InfoWindow
            position={{
              lat: selectedReport.latitude,
              lng: selectedReport.longitude,
            }}
            onCloseClick={() => setSelectedReport(null)}
          >
            <Box sx={{ maxWidth: 300, p: 1 }}>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                {selectedReport.imageUrl && (
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      overflow: "hidden",
                      cursor: "pointer",
                      boxShadow: 1,
                      mr: 1,
                      flexShrink: 0,
                    }}
                    onClick={() => setImageDialogOpen(true)}
                  >
                    <img
                      src={selectedReport.imageUrl}
                      alt="Report"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                )}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    {selectedReport.title}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Chip
                      label={formatCategoryName(selectedReport.category)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={selectedReport.severity}
                      size="small"
                      sx={{
                        backgroundColor: getSeverityColor(
                          selectedReport.severity
                        ),
                        color: "white",
                      }}
                    />
                    {selectedReport.verified && (
                      <Chip
                        label="Verified"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    )}
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {selectedReport.description}
                  </Typography>
                  {selectedReport.address && (
                    <Typography variant="caption" color="text.secondary">
                      📍 {selectedReport.address}
                    </Typography>
                  )}
                </Box>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 1 }}
              >
                <Typography variant="caption" color="text.secondary">
                  By {selectedReport.user?.username || "Anonymous"} •{" "}
                  {getTimeAgo(selectedReport.createdAt)}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={`👍 ${selectedReport.upvotes}`}
                    size="small"
                    variant="outlined"
                    clickable={!!user}
                    onClick={() => user && handleVote(selectedReport.id, "UP")}
                  />
                  <Chip
                    label={`👎 ${selectedReport.downvotes}`}
                    size="small"
                    variant="outlined"
                    clickable={!!user}
                    onClick={() =>
                      user && handleVote(selectedReport.id, "DOWN")
                    }
                  />
                </Stack>
              </Stack>
              {!user && (
                <Typography
                  variant="caption"
                  color="primary"
                  textAlign="center"
                >
                  Sign in to vote on reports
                </Typography>
              )}
            </Box>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Control Buttons */}
      <Stack
        spacing={1}
        sx={{ position: "absolute", bottom: 16, right: 16, zIndex: 1000 }}
      >
        <IconButton
          onClick={fetchTrafficReports}
          disabled={loading}
          sx={{
            backgroundColor: "secondary.main",
            color: "white",
            "&:hover": { backgroundColor: "secondary.dark" },
            boxShadow: 2,
          }}
        >
          <RefreshIcon />
        </IconButton>
        <IconButton
          onClick={centerMap}
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            "&:hover": { backgroundColor: "primary.dark" },
            boxShadow: 2,
          }}
        >
          <MyLocationIcon />
        </IconButton>
      </Stack>

      {/* Route Information Overlay */}
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

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 1000,
            maxWidth: 300,
          }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Loading Indicator */}
      {loading && (
        <Paper
          sx={{
            position: "absolute",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            p: 1,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <Typography variant="body2" color="primary">
            Loading traffic reports...
          </Typography>
        </Paper>
      )}

      {/* Image Dialog for full-size preview */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="sm"
      >
        <Box sx={{ p: 2, textAlign: "center" }}>
          <img
            src={selectedReport?.imageUrl}
            alt="Report Full"
            style={{
              maxWidth: "100%",
              maxHeight: "70vh",
              borderRadius: 8,
            }}
          />
        </Box>
      </Dialog>
    </Box>
  );
};

export default TrafficMap;
