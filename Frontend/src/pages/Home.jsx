import NavigationIcon from "@mui/icons-material/Navigation";
import { Alert, Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useJsApiLoader } from "@react-google-maps/api";
import { useState } from "react";
import TrafficMap from "../components/Map/TrafficMap";
import RouteSearch from "../components/Route/RouteSearch";
import TrafficReportDialog from "../components/Traffic/TrafficReportDialog";
import { useAuth } from "../context/AuthContext";

const libraries = ["places"];

const Home = () => {
  const { user } = useAuth();
  const [routeData, setRouteData] = useState(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  console.log("User in Home:", user);

  // Load Google Maps API once at the top level
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey:
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY",
    libraries: libraries,
  });

  const handleClearRoute = async () => {
    setRouteData(null);
    console.log("why you are not nulled");
    // useEffect(() => {
    //   console.log("routeData changed:", routeData);
    // }, [routeData]);
  };

  const handleMapClick = (event) => {
    if (user && event?.latLng) {
      setReportDialogOpen(true);
    }
  };

  if (loadError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Failed to load Google Maps. Please check your API key and try again.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Welcome Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to RaastaBuzz
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your community-powered traffic information platform for Bangladesh.
          {user
            ? " Share real-time traffic updates and help your community travel smarter."
            : " View live traffic updates from the community or sign up to contribute."}
        </Typography>
      </Paper>

      {!user && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Demo Credentials:</strong> Email: contributor@demo.com or
            moderator@demo.com | Password: demo123
          </Typography>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Panel - Route Search & Reports */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Route Search with Google Maps Integration */}
            <RouteSearch
              isLoaded={isLoaded}
              loadError={loadError}
              onRouteCalculated={setRouteData}
              routeData={routeData}
              onClearRoute={handleClearRoute}
            />

            {/* Add Report Button */}
            {user && (
              <Button
                variant="contained"
                startIcon={<NavigationIcon />}
                onClick={() => setReportDialogOpen(true)}
                size="large"
                fullWidth
              >
                Report Traffic Issue
              </Button>
            )}

            {/* Recent Traffic Reports */}
            {/* <TrafficReportsList /> */}
          </Box>
        </Grid>

        {/* Right Panel - Clean Map */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: 600, overflow: "hidden" }}>
            <TrafficMap
              routeData={routeData}
              onReportClick={handleMapClick}
              isLoaded={isLoaded}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Traffic Report Dialog */}
      {user && (
        <TrafficReportDialog
          open={reportDialogOpen}
          onClose={() => setReportDialogOpen(false)}
        />
      )}
    </Box>
  );
};

export default Home;
