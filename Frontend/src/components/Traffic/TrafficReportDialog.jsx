import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material'
import { PhotoCamera, MyLocation } from '@mui/icons-material'
import { trafficCategories, dhakaLocations } from '../../data/demoData'
import { useAuth } from '../../context/AuthContext'

const TrafficReportDialog = ({ open, onClose }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    severity: 'medium',
    location: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleGetCurrentLocation = () => {
    // For demo purposes, we'll simulate getting current location
    handleInputChange('location', 'Current Location (Dhanmondi 27, Dhaka)')
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.category || !formData.location) {
      return
    }

    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      
      // Reset form after success message
      setTimeout(() => {
        setSuccess(false)
        setFormData({
          title: '',
          description: '',
          category: '',
          severity: 'medium',
          location: ''
        })
        onClose()
      }, 2000)
    }, 1500)
  }

  if (!user) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Report Traffic Issue
      </DialogTitle>
      
      <DialogContent>
        {success ? (
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Thank you! Your traffic report has been submitted successfully. 
              Other users will now see this information on the map.
            </Typography>
          </Alert>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {/* Title */}
            <TextField
              label="Issue Title"
              placeholder="e.g., Heavy traffic jam due to accident"
              fullWidth
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />

            {/* Category */}
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                label="Category"
              >
                {trafficCategories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                onChange={(e) => handleInputChange('severity', e.target.value)}
                label="Severity"
              >
                <MenuItem value="low">
                  <Chip label="Low" color="success" size="small" sx={{ mr: 1 }} />
                  Minor delay
                </MenuItem>
                <MenuItem value="medium">
                  <Chip label="Medium" color="warning" size="small" sx={{ mr: 1 }} />
                  Moderate delay
                </MenuItem>
                <MenuItem value="high">
                  <Chip label="High" color="error" size="small" sx={{ mr: 1 }} />
                  Major delay
                </MenuItem>
              </Select>
            </FormControl>

            {/* Location */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Location"
                placeholder="Enter location or use current location"
                fullWidth
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
              />
              <Button
                variant="outlined"
                onClick={handleGetCurrentLocation}
                sx={{ minWidth: 'auto' }}
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
              onChange={(e) => handleInputChange('description', e.target.value)}
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
            disabled={loading || !formData.title || !formData.category || !formData.location}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}

export default TrafficReportDialog
