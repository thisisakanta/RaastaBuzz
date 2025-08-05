import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Divider,
  Tab,
  Tabs
} from '@mui/material'
import {
  Add as AddIcon,
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  Star as StarIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material'
import { demoForumPosts } from '../data/demoData'
import { useAuth } from '../context/AuthContext'

const Forum = () => {
  const { user } = useAuth()
  const [selectedTab, setSelectedTab] = useState(0)
  const [posts] = useState(demoForumPosts)

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue)
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const postTime = new Date(timestamp)
    const diffInHours = Math.floor((now - postTime) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'tips': return 'primary'
      case 'safety': return 'error'
      case 'feature_request': return 'secondary'
      default: return 'default'
    }
  }

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'tips': return 'Tips & Tricks'
      case 'safety': return 'Safety'
      case 'feature_request': return 'Feature Request'
      default: return 'General'
    }
  }

  const filteredPosts = selectedTab === 0 
    ? posts 
    : posts.filter(post => {
        if (selectedTab === 1) return post.category === 'tips'
        if (selectedTab === 2) return post.category === 'safety'
        if (selectedTab === 3) return post.category === 'feature_request'
        return true
      })

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Community Forum
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Share tips, discuss traffic solutions, and connect with fellow travelers
          </Typography>
        </Box>
        
        {user && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            disabled
          >
            New Post (Coming Soon)
          </Button>
        )}
      </Box>

      {!user && (
        <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f5f5f5' }}>
          <Typography variant="body2" align="center">
            Sign in to participate in discussions and create new posts
          </Typography>
        </Paper>
      )}

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Category Tabs */}
          <Paper sx={{ mb: 3 }}>
            <Tabs value={selectedTab} onChange={handleTabChange} variant="scrollable">
              <Tab label="All Posts" />
              <Tab label="Tips & Tricks" />
              <Tab label="Safety" />
              <Tab label="Feature Requests" />
            </Tabs>
          </Paper>

          {/* Posts List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredPosts.map((post) => (
              <Card key={post.id} sx={{ cursor: 'pointer', '&:hover': { elevation: 3 } }}>
                <CardContent>
                  {/* Post Header */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                    <Avatar sx={{ width: 40, height: 40 }}>
                      {post.author.name.charAt(0)}
                    </Avatar>
                    
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {post.author.name}
                        </Typography>
                        {post.author.role === 'moderator' && (
                          <VerifiedIcon color="primary" fontSize="small" />
                        )}
                        <Chip 
                          label={getCategoryLabel(post.category)}
                          size="small"
                          color={getCategoryColor(post.category)}
                          variant="outlined"
                        />
                      </Box>
                      
                      <Typography variant="caption" color="text.secondary">
                        {post.author.points} points • {formatTimeAgo(post.timestamp)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Post Content */}
                  <Typography variant="h6" gutterBottom>
                    {post.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {post.content}
                  </Typography>

                  {/* Post Actions */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                    <IconButton size="small" color="primary">
                      <ThumbUpIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                      {post.likes} likes
                    </Typography>
                    
                    <IconButton size="small">
                      <CommentIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                      {post.replies} replies
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Community Stats */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Community Stats
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Total Posts</Typography>
                <Typography variant="body2" fontWeight="bold">1,234</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Active Members</Typography>
                <Typography variant="body2" fontWeight="bold">856</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">This Week's Posts</Typography>
                <Typography variant="body2" fontWeight="bold">47</Typography>
              </Box>
            </Box>
          </Paper>

          {/* Top Contributors */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top Contributors
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                { name: 'Fatima Khan', points: 1250, role: 'moderator' },
                { name: 'Ahmed Rahman', points: 845, role: 'contributor' },
                { name: 'Rashid Ahmed', points: 623, role: 'contributor' }
              ].map((contributor, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                  <Typography variant="body2" color="primary" fontWeight="bold">
                    #{index + 1}
                  </Typography>
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {contributor.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {contributor.name}
                      </Typography>
                      {contributor.role === 'moderator' && (
                        <VerifiedIcon color="primary" fontSize="small" />
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {contributor.points} points
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Forum
