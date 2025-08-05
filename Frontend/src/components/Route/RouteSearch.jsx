import React, { useState } from 'react'
import { 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box,
  Autocomplete,
  Divider
} from '@mui/material'
import { Search as SearchIcon, MyLocation as MyLocationIcon } from '@mui/icons-material'
import { dhakaLocations } from '../../data/demoData'

const RouteSearch = ({ onRouteSelect, selectedRoute }) => {
  const [fromLocation, setFromLocation] = useState('')
  const [toLocation, setToLocation] = useState('')

  const handleSearch = () => {
    if (fromLocation && toLocation) {
      const route = {
        from: fromLocation,
        to: toLocation,
        timestamp: new Date().toISOString()
      }
      onRouteSelect(route)
    }
  }

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // For demo, we'll use a nearby Dhaka location
          setFromLocation('Current Location (Dhanmondi)')
        },
        (error) => {
          console.error('Error getting location:', error)
          setFromLocation('Current Location (Dhanmondi)') // Fallback for demo
        }
      )
    }
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Plan Your Route
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Autocomplete
            fullWidth
            freeSolo
            options={dhakaLocations.map(loc => loc.name)}
            value={fromLocation}
            onInputChange={(event, newValue) => setFromLocation(newValue || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                label="From"
                placeholder="Enter starting point"
                variant="outlined"
              />
            )}
          />
          <Button
            variant="outlined"
            onClick={handleCurrentLocation}
            sx={{ minWidth: 'auto', p: 1 }}
          >
            <MyLocationIcon />
          </Button>
        </Box>

        <Autocomplete
          fullWidth
          freeSolo
          options={dhakaLocations.map(loc => loc.name)}
          value={toLocation}
          onInputChange={(event, newValue) => setToLocation(newValue || '')}
          renderInput={(params) => (
            <TextField
              {...params}
              label="To"
              placeholder="Enter destination"
              variant="outlined"
            />
          )}
        />

        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={!fromLocation || !toLocation}
          startIcon={<SearchIcon />}
          size="large"
        >
          Search Route
        </Button>
      </Box>

      {selectedRoute && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Current Route:
            </Typography>
            <Typography variant="body2">
              📍 From: {selectedRoute.from}
            </Typography>
            <Typography variant="body2">
              🎯 To: {selectedRoute.to}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Searched at: {new Date(selectedRoute.timestamp).toLocaleTimeString()}
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  )
}

export default RouteSearch
