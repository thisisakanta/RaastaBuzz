import React, { useState } from 'react'
import { 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  Box,
  Chip,
  Avatar,
  IconButton,
  Collapse,
  Button
} from '@mui/material'
import { 
  ThumbUp, 
  ThumbDown, 
  Verified,
  ExpandMore,
  ExpandLess,
  AccessTime
} from '@mui/icons-material'
import { demoTrafficReports, trafficCategories } from '../../data/demoData'
import { useAuth } from '../../context/AuthContext'

const TrafficReportsList = () => {
  const { user } = useAuth()
  const [reports] = useState(demoTrafficReports.slice(0, 5)) // Show latest 5 reports
  const [expandedReports, setExpandedReports] = useState({})

  const toggleExpand = (reportId) => {
    setExpandedReports(prev => ({
      ...prev,
      [reportId]: !prev[reportId]
    }))
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const reportTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now - reportTime) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'default'
    }
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Latest Traffic Reports
      </Typography>
      
      <List sx={{ p: 0 }}>
        {reports.map((report, index) => {
          const categoryData = trafficCategories.find(cat => cat.id === report.category)
          const isExpanded = expandedReports[report.id]
          
          return (
            <ListItem
              key={report.id}
              sx={{ 
                flexDirection: 'column', 
                alignItems: 'stretch',
                px: 0,
                py: 1,
                borderBottom: index < reports.length - 1 ? '1px solid #e0e0e0' : 'none'
              }}
            >
              <Box sx={{ width: '100%' }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="body2" fontWeight="bold" sx={{ flex: 1 }}>
                        {report.title}
                      </Typography>
                      {report.verified && (
                        <Verified color="primary" fontSize="small" />
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Chip 
                        label={categoryData?.label}
                        size="small"
                        sx={{ 
                          backgroundColor: categoryData?.color,
                          color: 'white',
                          fontSize: '0.7rem',
                          height: 20
                        }}
                      />
                      <Chip 
                        label={report.severity}
                        size="small"
                        color={getSeverityColor(report.severity)}
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 20 }}
                      />
                    </Box>
                  </Box>
                  
                  <IconButton 
                    size="small" 
                    onClick={() => toggleExpand(report.id)}
                  >
                    {isExpanded ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>

                {/* Location */}
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  📍 {report.location.address}
                </Typography>

                {/* Expanded Content */}
                <Collapse in={isExpanded}>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" gutterBottom>
                      {report.description}
                    </Typography>
                    
                    {/* Reporter Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
                      <Avatar sx={{ width: 20, height: 20, fontSize: '0.7rem' }}>
                        {report.reportedBy.name.charAt(0)}
                      </Avatar>
                      <Typography variant="caption">
                        {report.reportedBy.name}
                      </Typography>
                      <AccessTime sx={{ fontSize: 12, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {formatTimeAgo(report.timestamp)}
                      </Typography>
                    </Box>

                    {/* Voting */}
                    {user && (
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Button
                          size="small"
                          startIcon={<ThumbUp />}
                          color="success"
                          variant="outlined"
                        >
                          {report.upvotes}
                        </Button>
                        <Button
                          size="small"
                          startIcon={<ThumbDown />}
                          color="error"
                          variant="outlined"
                        >
                          {report.downvotes}
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Collapse>
              </Box>
            </ListItem>
          )
        })}
      </List>

      {!user && (
        <Box sx={{ mt: 2, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="caption" align="center" display="block">
            Sign in to vote on reports and add your own traffic updates
          </Typography>
        </Box>
      )}
    </Paper>
  )
}

export default TrafficReportsList
