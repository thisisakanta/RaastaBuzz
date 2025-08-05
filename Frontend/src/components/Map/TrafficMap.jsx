import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import { Box, Chip, Typography, Button, Avatar } from '@mui/material'
import { ThumbUp, ThumbDown, Verified } from '@mui/icons-material'
import L from 'leaflet'
import { demoTrafficReports, trafficCategories } from '../../data/demoData'
import { useAuth } from '../../context/AuthContext'

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom marker icons for different traffic categories
const createCategoryIcon = (category) => {
  const categoryData = trafficCategories.find(cat => cat.id === category)
  return new L.DivIcon({
    html: `<div style="
      background-color: ${categoryData?.color || '#607d8b'}; 
      width: 30px; 
      height: 30px; 
      border-radius: 50%; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      font-size: 16px;
    ">${categoryData?.icon || '❗'}</div>`,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  })
}

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick && onMapClick(e.latlng)
    }
  })
  return null
}

const TrafficMap = ({ selectedRoute, onReportClick }) => {
  const { user } = useAuth()
  const [reports, setReports] = useState(demoTrafficReports)
  
  // Center map on Dhaka
  const center = [23.8103, 90.4125]

  const handleVote = (reportId, voteType) => {
    if (!user) return
    
    setReports(prev => prev.map(report => {
      if (report.id === reportId) {
        if (voteType === 'up') {
          return { ...report, upvotes: report.upvotes + 1 }
        } else {
          return { ...report, downvotes: report.downvotes + 1 }
        }
      }
      return report
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

  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
      <MapContainer 
        center={center} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapClickHandler onMapClick={onReportClick} />

        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.location.lat, report.location.lng]}
            icon={createCategoryIcon(report.category)}
          >
            <Popup maxWidth={350}>
              <Box sx={{ p: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Chip 
                    label={trafficCategories.find(cat => cat.id === report.category)?.label}
                    size="small"
                    sx={{ 
                      backgroundColor: trafficCategories.find(cat => cat.id === report.category)?.color,
                      color: 'white'
                    }}
                  />
                  {report.verified && (
                    <Verified color="primary" fontSize="small" />
                  )}
                </Box>
                
                <Typography variant="h6" gutterBottom>
                  {report.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {report.description}
                </Typography>
                
                <Typography variant="caption" display="block" gutterBottom>
                  📍 {report.location.address}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
                  <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                    {report.reportedBy.name.charAt(0)}
                  </Avatar>
                  <Typography variant="caption">
                    {report.reportedBy.name} • {formatTimeAgo(report.timestamp)}
                  </Typography>
                </Box>

                {user && (
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      size="small"
                      startIcon={<ThumbUp />}
                      onClick={() => handleVote(report.id, 'up')}
                      color="success"
                    >
                      {report.upvotes}
                    </Button>
                    <Button
                      size="small"
                      startIcon={<ThumbDown />}
                      onClick={() => handleVote(report.id, 'down')}
                      color="error"
                    >
                      {report.downvotes}
                    </Button>
                  </Box>
                )}
              </Box>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {!user && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 10, 
            left: 10, 
            right: 10, 
            zIndex: 1000,
            backgroundColor: 'rgba(255,255,255,0.9)',
            p: 2,
            borderRadius: 1
          }}
        >
          <Typography variant="body2" align="center">
            👋 Click on map markers to see traffic reports. Sign in to vote and add your own reports!
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default TrafficMap
