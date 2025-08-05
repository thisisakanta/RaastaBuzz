import React, { useState } from 'react'
import {
  Paper,
  Typography,
  Box,
  Avatar,
  Chip,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
  LinearProgress
} from '@mui/material'
import { 
  Edit as EditIcon,
  Star as StarIcon,
  Route as RouteIcon,
  TrendingUp as TrendingUpIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    navigate('/login')
    return null
  }

  // Demo stats
  const userStats = {
    totalReports: 23,
    verifiedReports: 18,
    helpfulVotes: 156,
    pointsToNextLevel: 55
  }

  const recentActivity = [
    { id: 1, type: 'report', title: 'Reported traffic jam on Dhanmondi 27', time: '2 hours ago' },
    { id: 2, type: 'vote', title: 'Upvoted accident report in Gulshan', time: '5 hours ago' },
    { id: 3, type: 'report', title: 'Reported road closure in Motijheel', time: '1 day ago' },
    { id: 4, type: 'vote', title: 'Downvoted outdated flooding report', time: '2 days ago' }
  ]

  const getNextLevelPoints = () => {
    if (user.points < 100) return 100
    if (user.points < 500) return 500
    if (user.points < 1000) return 1000
    return 2000
  }

  const getLevel = () => {
    if (user.points < 100) return 'Newbie Reporter'
    if (user.points < 500) return 'Active Reporter'
    if (user.points < 1000) return 'Expert Reporter'
    return 'Traffic Hero'
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar 
              sx={{ 
                width: 100, 
                height: 100, 
                fontSize: '2rem',
                mx: 'auto',
                mb: 2,
                backgroundColor: 'primary.main'
              }}
            >
              {user.name.charAt(0)}
            </Avatar>
            
            <Typography variant="h5" gutterBottom>
              {user.name}
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
              <Chip 
                label={user.role === 'moderator' ? 'Community Moderator' : 'Contributor'}
                color={user.role === 'moderator' ? 'secondary' : 'primary'}
                icon={user.role === 'moderator' ? <VerifiedIcon /> : <StarIcon />}
              />
            </Box>

            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user.email}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Points and Level */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" color="primary">
                {user.points} Points
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {getLevel()}
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption">
                    Progress to next level
                  </Typography>
                  <Typography variant="caption">
                    {getNextLevelPoints() - user.points} points needed
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(user.points % 100) || (user.points / getNextLevelPoints() * 100)} 
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Box>
            </Box>

            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              fullWidth
              disabled
            >
              Edit Profile (Coming Soon)
            </Button>
          </Paper>
        </Grid>

        {/* Stats and Activity */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {/* Stats Cards */}
            <Grid item xs={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {userStats.totalReports}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Reports
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {userStats.verifiedReports}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Verified Reports
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">
                    {userStats.helpfulVotes}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Helpful Votes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main">
                    {user.savedRoutes.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Saved Routes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Saved Routes */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  <RouteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Saved Routes
                </Typography>
                
                {user.savedRoutes.length > 0 ? (
                  <List>
                    {user.savedRoutes.map((route) => (
                      <ListItem key={route.id} sx={{ px: 0 }}>
                        <ListItemText
                          primary={route.name}
                          secondary={`${route.from} → ${route.to}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No saved routes yet. Start by searching for routes on the home page!
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Recent Activity */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Recent Activity
                </Typography>
                
                <List>
                  {recentActivity.map((activity) => (
                    <ListItem key={activity.id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={activity.title}
                        secondary={activity.time}
                        primaryTypographyProps={{ variant: 'body2' }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Profile
