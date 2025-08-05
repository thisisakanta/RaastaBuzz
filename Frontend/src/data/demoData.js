// Demo traffic reports data
export const demoTrafficReports = [
  {
    id: 1,
    title: 'Heavy Traffic Jam',
    description: 'Major traffic congestion due to road construction',
    category: 'traffic_jam',
    location: {
      lat: 23.7465,
      lng: 90.3763,
      address: 'Dhanmondi 27, Dhaka'
    },
    severity: 'high',
    reportedBy: {
      id: 1,
      name: 'Ahmed Rahman',
      role: 'contributor'
    },
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    upvotes: 12,
    downvotes: 2,
    verified: true,
    image: null
  },
  {
    id: 2,
    title: 'Road Accident',
    description: 'Minor vehicle collision, one lane blocked',
    category: 'accident',
    location: {
      lat: 23.7808,
      lng: 90.4148,
      address: 'Gulshan Circle 1, Dhaka'
    },
    severity: 'medium',
    reportedBy: {
      id: 2,
      name: 'Fatima Khan',
      role: 'moderator'
    },
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
    upvotes: 8,
    downvotes: 0,
    verified: true,
    image: null
  },
  {
    id: 3,
    title: 'Road Under Water',
    description: 'Heavy rain has flooded the street, vehicles struggling',
    category: 'flooding',
    location: {
      lat: 23.7288,
      lng: 90.3914,
      address: 'Elephant Road, Dhaka'
    },
    severity: 'high',
    reportedBy: {
      id: 3,
      name: 'Rashid Ahmed',
      role: 'contributor'
    },
    timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 minutes ago
    upvotes: 15,
    downvotes: 1,
    verified: false,
    image: null
  },
  {
    id: 4,
    title: 'Road Closed for Event',
    description: 'Street blocked for political rally until 6 PM',
    category: 'road_closed',
    location: {
      lat: 23.7106,
      lng: 90.4078,
      address: 'Motijheel Commercial Area, Dhaka'
    },
    severity: 'high',
    reportedBy: {
      id: 4,
      name: 'Nasir Uddin',
      role: 'contributor'
    },
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
    upvotes: 20,
    downvotes: 3,
    verified: true,
    image: null
  },
  {
    id: 5,
    title: 'Police Checkpoint',
    description: 'Routine police checking causing slow traffic',
    category: 'checkpoint',
    location: {
      lat: 23.8041,
      lng: 90.4152,
      address: 'Banani 11, Dhaka'
    },
    severity: 'low',
    reportedBy: {
      id: 5,
      name: 'Salma Begum',
      role: 'contributor'
    },
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    upvotes: 5,
    downvotes: 0,
    verified: false,
    image: null
  }
]

// Traffic categories
export const trafficCategories = [
  { id: 'traffic_jam', label: 'Traffic Jam', color: '#f44336', icon: '🚗' },
  { id: 'accident', label: 'Accident', color: '#ff9800', icon: '🚨' },
  { id: 'road_closed', label: 'Road Closed', color: '#e91e63', icon: '🚧' },
  { id: 'flooding', label: 'Flooding', color: '#2196f3', icon: '🌊' },
  { id: 'checkpoint', label: 'Police Checkpoint', color: '#9c27b0', icon: '👮' },
  { id: 'construction', label: 'Construction Work', color: '#ff5722', icon: '🔨' },
  { id: 'other', label: 'Other', color: '#607d8b', icon: '❗' }
]

// Demo forum posts
export const demoForumPosts = [
  {
    id: 1,
    title: 'Dhaka Traffic: Best Routes During Rush Hour',
    content: 'I\'ve been tracking traffic patterns for months. Here are some alternative routes that work well during peak hours...',
    author: {
      id: 1,
      name: 'Ahmed Rahman',
      role: 'contributor',
      points: 245
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    likes: 23,
    replies: 8,
    category: 'tips'
  },
  {
    id: 2,
    title: 'Monsoon Season Road Safety Tips',
    content: 'With the rainy season approaching, here are some important safety tips for driving in Dhaka during heavy rainfall...',
    author: {
      id: 2,
      name: 'Fatima Khan',
      role: 'moderator',
      points: 1250
    },
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    likes: 45,
    replies: 12,
    category: 'safety'
  },
  {
    id: 3,
    title: 'Feature Request: Dark Mode for Night Driving',
    content: 'Would be great to have a dark mode option for the app, especially useful when driving at night...',
    author: {
      id: 3,
      name: 'Rashid Ahmed',
      role: 'contributor',
      points: 156
    },
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    likes: 18,
    replies: 5,
    category: 'feature_request'
  }
]

// Dhaka specific locations for demo
export const dhakaLocations = [
  { name: 'Dhanmondi', lat: 23.7465, lng: 90.3763 },
  { name: 'Gulshan', lat: 23.7808, lng: 90.4148 },
  { name: 'Banani', lat: 23.8041, lng: 90.4152 },
  { name: 'Motijheel', lat: 23.7106, lng: 90.4078 },
  { name: 'Old Dhaka', lat: 23.7104, lng: 90.4074 },
  { name: 'Uttara', lat: 23.8759, lng: 90.3795 },
  { name: 'Mirpur', lat: 23.8103, lng: 90.3654 },
  { name: 'Wari', lat: 23.7193, lng: 90.4254 }
]
