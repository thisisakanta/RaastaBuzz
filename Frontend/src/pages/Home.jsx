import React, { useState } from 'react'
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  TextField,
  Button,
  InputAdornment,
  Alert
} from '@mui/material'
import { Search as SearchIcon, Navigation as NavigationIcon } from '@mui/icons-material'
import TrafficMap from '../components/Map/TrafficMap'
import RouteSearch from '../components/Route/RouteSearch'
import TrafficReportDialog from '../components/Traffic/TrafficReportDialog'
import TrafficReportsList from '../components/Traffic/TrafficReportsList'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { user } = useAuth()
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)

  return (
    <Box>
      {/* Welcome Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to RaastaBuzz
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your community-powered traffic information platform for Bangladesh. 
          {user ? ' Share real-time traffic updates and help your community travel smarter.' 
                : ' View live traffic updates from the community or sign up to contribute.'}
        </Typography>
      </Paper>

      {!user && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Demo Credentials:</strong> Email: contributor@demo.com or moderator@demo.com | Password: demo123
          </Typography>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Panel - Route Search & Reports */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Route Search */}
            <RouteSearch 
              onRouteSelect={setSelectedRoute}
              selectedRoute={selectedRoute}
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
            <TrafficReportsList />
          </Box>
        </Grid>

        {/* Right Panel - Map */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: 600, overflow: 'hidden' }}>
            <TrafficMap 
              selectedRoute={selectedRoute}
              onReportClick={() => user && setReportDialogOpen(true)}
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
  )
}

export default Home
