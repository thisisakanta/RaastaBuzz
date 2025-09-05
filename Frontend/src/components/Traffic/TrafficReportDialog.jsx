import { MyLocation, PhotoCamera } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { trafficCategories } from "../../data/demoData";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const TrafficReportDialog = ({ open, onClose }) => {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    severity: "MEDIUM",
    location: "",
    latitude: null,
    longitude: null,
    address: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Simulate getting current location (for demo, use fixed coords)
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      handleInputChange("location", "Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        handleInputChange(
          "location",
          `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`
        );
        // Optionally, store latitude and longitude separately if needed for backend
        setFormData((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));
      },
      (error) => {
        handleInputChange("location", "Unable to fetch location");
      }
    );
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (
      !formData.title ||
      !formData.category ||
      !formData.location ||
      !formData.latitude ||
      !formData.longitude
    ) {
      setError("Please fill all required fields.");
      return;
    }
    setLoading(true);
    setError(null);

    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      severity: formData.severity,
      latitude: formData.latitude,
      longitude: formData.longitude,
      address: formData.address,
      imageUrl: formData.imageUrl,
    };
    console.log(payload);
    // Replace with your actual backend endpoint
    await axios.post(`${API_BASE_URL}/traffic-reports`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setFormData({
        title: "",
        description: "",
        category: "",
        severity: "MEDIUM",
        location: "",
        latitude: null,
        longitude: null,
        address: "",
        imageUrl: "",
      });
      onClose();
    }, 3000);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Report Traffic Issue</DialogTitle>

      <DialogContent>
        {success ? (
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Thank you! Your traffic report has been submitted successfully.
            </Typography>
          </Alert>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}
            {/* Title */}
            <TextField
              label="Issue Title"
              placeholder="e.g., Heavy traffic jam due to accident"
              fullWidth
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />

            {/* Category */}
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                label="Category"
              >
                {trafficCategories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <span>{category.icon}</span>
                      {category.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Severity */}
            <FormControl fullWidth>
              <InputLabel>Severity</InputLabel>
              <Select
                value={formData.severity}
                onChange={(e) => handleInputChange("severity", e.target.value)}
                label="Severity"
              >
                <MenuItem value="LOW">
                  <Chip
                    label="Low"
                    color="success"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  Minor delay
                </MenuItem>
                <MenuItem value="MEDIUM">
                  <Chip
                    label="Medium"
                    color="warning"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  Moderate delay
                </MenuItem>
                <MenuItem value="HIGH">
                  <Chip
                    label="High"
                    color="error"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  Major delay
                </MenuItem>
                <MenuItem value="HIGH">
                  <Chip
                    label="Critical"
                    color="secondary"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  Severe disruption
                </MenuItem>
              </Select>
            </FormControl>

            {/* Location */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                label="Location"
                placeholder="Enter location or use current location"
                fullWidth
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                required
              />
              <Button
                variant="outlined"
                onClick={handleGetCurrentLocation}
                sx={{ minWidth: "auto" }}
              >
                <MyLocation />
              </Button>
            </Box>

            {/* Description */}
            <TextField
              label="Description"
              placeholder="Provide more details about the traffic situation..."
              multiline
              rows={3}
              fullWidth
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />

            {/* Photo Upload (Disabled for demo) */}
            <Button
              variant="outlined"
              startIcon={<PhotoCamera />}
              disabled
              fullWidth
              sx={{ py: 1.5 }}
            >
              Add Photo (Coming Soon)
            </Button>

            <Typography variant="caption" color="text.secondary" align="center">
              📸 Photo upload feature will be available in the next update
            </Typography>
          </Box>
        )}
      </DialogContent>

      {!success && (
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              loading ||
              !formData.title ||
              !formData.category ||
              !formData.location
            }
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default TrafficReportDialog;
