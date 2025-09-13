import React, { useEffect, useState } from 'react'
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
import { getAllPosts, getPostsByCategory, likePost, createPost, getComments, addComment } from '../services/forumService'
import { useAuth } from '../context/AuthContext'
import { TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

const Forum = () => {
  const { user, token } = useAuth()
  const [selectedTab, setSelectedTab] = useState(0)
  const [posts, setPosts] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'GENERAL' })
  const [expandedComments, setExpandedComments] = useState({})
  const [commentsCache, setCommentsCache] = useState({})

  useEffect(() => {
    const load = async () => {
      try {
        if (selectedTab === 0) {
          const data = await getAllPosts()
          setPosts(data)
        } else if (selectedTab === 1) {
          setPosts(await getPostsByCategory('TIPS'))
        } else if (selectedTab === 2) {
          setPosts(await getPostsByCategory('SAFETY'))
        } else if (selectedTab === 3) {
          setPosts(await getPostsByCategory('FEATURE_REQUEST'))
        }
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [selectedTab])

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

  const filteredPosts = posts

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
            onClick={() => setOpenDialog(true)}
          >
            New Post
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
                      {(post.user?.name || 'U').charAt(0)}
                    </Avatar>
                    
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {post.user?.name}
                        </Typography>
                        {post.user?.role === 'MODERATOR' && (
                          <VerifiedIcon color="primary" fontSize="small" />
                        )}
                        <Chip 
                          label={getCategoryLabel(String(post.category || 'general').toLowerCase())}
                          size="small"
                          color={getCategoryColor(String(post.category || 'general').toLowerCase())}
                          variant="outlined"
                        />
                      </Box>
                      
                      <Typography variant="caption" color="text.secondary">
                        {post.user?.points || 0} points • {formatTimeAgo(post.createdAt)}
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
                    <IconButton size="small" color="primary" disabled={!user} onClick={async () => {
                      try {
                        const updated = await likePost(post.id, token)
                        setPosts(prev => prev.map(p => p.id === updated.id ? updated : p))
                      } catch (e) { console.error(e) }
                    }}>
                      <ThumbUpIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                      {post.likes} likes
                    </Typography>
                    
                    <IconButton size="small" onClick={async () => {
                      const expanded = !!expandedComments[post.id]
                      const next = { ...expandedComments, [post.id]: !expanded }
                      setExpandedComments(next)
                      if (!expanded && !commentsCache[post.id]) {
                        try {
                          const list = await getComments(post.id)
                          setCommentsCache({ ...commentsCache, [post.id]: { list, newContent: '' } })
                        } catch {}
                      }
                    }}>
                      <CommentIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                      {post.replies} replies
                    </Typography>
                  </Box>

                  {expandedComments[post.id] && (
                    <Box sx={{ mt: 2 }}>
                      <Divider sx={{ mb: 2 }} />
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {((commentsCache[post.id]?.list) || []).map((c) => (
                          <Box key={c.id}>
                            <Typography variant="subtitle2">{c.user?.name || 'User'}</Typography>
                            <Typography variant="body2" color="text.secondary">{c.content}</Typography>
                          </Box>
                        ))}
                      </Box>
                      {user && (
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          <TextField
                            size="small"
                            fullWidth
                            placeholder="Write a comment..."
                            value={(commentsCache[post.id]?.newContent) || ''}
                            onChange={(e) => {
                              const state = commentsCache[post.id] || { list: [], newContent: '' }
                              setCommentsCache({ ...commentsCache, [post.id]: { ...state, newContent: e.target.value } })
                            }}
                          />
                          <Button variant="contained" onClick={async () => {
                            const state = commentsCache[post.id]
                            const content = state?.newContent || ''
                            if (!content.trim()) return
                            try {
                              const created = await addComment(post.id, content, token)
                              const list = Array.isArray(state?.list) ? state.list : []
                              const next = { list: [...list, created], newContent: '' }
                              setCommentsCache({ ...commentsCache, [post.id]: next })
                              // bump replies in post
                              setPosts(prev => prev.map(p => p.id === post.id ? { ...p, replies: (p.replies || 0) + 1 } : p))
                            } catch (e) { console.error(e) }
                          }}>Post</Button>
                        </Box>
                      )}
                    </Box>
                  )}
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

      {/* New Post Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>New Post</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            fullWidth
          />
          <TextField
            label="Content"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            fullWidth
            multiline
            minRows={4}
          />
          <TextField
            label="Category"
            value={newPost.category}
            onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
            fullWidth
            select
            SelectProps={{ native: true }}
          >
            {[
              { value: 'GENERAL', label: 'General' },
              { value: 'TIPS', label: 'Tips & Tricks' },
              { value: 'SAFETY', label: 'Safety' },
              { value: 'FEATURE_REQUEST', label: 'Feature Request' }
            ].map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={async () => {
            try {
              const created = await createPost(newPost, token)
              setOpenDialog(false)
              setNewPost({ title: '', content: '', category: 'GENERAL' })
              // Prepend to list when showing all or matching category
              setPosts(prev => [created, ...prev])
            } catch (e) { console.error(e) }
          }}>Post</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Forum
