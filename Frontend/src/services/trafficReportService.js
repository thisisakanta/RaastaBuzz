// import { Rtt } from '@mui/icons-material'
// import axios from 'axios'

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// const trafficReportAPI = axios.create({
//   baseURL: `${API_BASE_URL}/traffic-reports`,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

// // Add token to requests if available
// trafficReportAPI.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token')
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

// export const trafficReportService = {
//   // Get all active reports
//   getAllReports: async () => {
//     try {
//       const response = await trafficReportAPI.get('')
//       console.log(response.data)
//       return response.data
//     } catch (error) {
//       console.error('Error fetching reports:', error)
//       throw error
//     }
//   },

//   // Get reports by category
//   getReportsByCategory: async (category) => {
//     try {
//       const response = await trafficReportAPI.get(`/category/${category}`)
//       return response.data
//     } catch (error) {
//       console.error('Error fetching reports by category:', error)
//       throw error
//     }
//   },

//   // Get reports by severity
//   getReportsBySeverity: async (severity) => {
//     try {
//       const response = await trafficReportAPI.get(`/severity/${severity}`)
//       return response.data
//     } catch (error) {
//       console.error('Error fetching reports by severity:', error)
//       throw error
//     }
//   },

//   // Get reports in specific area
//   getReportsInArea: async (minLat, maxLat, minLng, maxLng) => {
//     try {
//       const response = await trafficReportAPI.get('/area', {
//         params: { minLat, maxLat, minLng, maxLng }
//       })
//       return response.data
//     } catch (error) {
//       console.error('Error fetching reports in area:', error)
//       throw error
//     }
//   },

//   // Get recent reports
//   getRecentReports: async (hours = 24) => {
//     try {
//       const response = await trafficReportAPI.get('/recent', {
//         params: { hours }
//       })
//       return response.data
//     } catch (error) {
//       console.error('Error fetching recent reports:', error)
//       throw error
//     }
//   },

//   // Create new report
//   createReport: async (reportData) => {
//     try {
//       const response = await trafficReportAPI.post('/', reportData)
//       return response.data
//     } catch (error) {
//       console.error('Error creating report:', error)
//       throw error
//     }
//   },

//   // Vote on report
//   voteOnReport: async (reportId, voteType) => {
//     try {
//       const response = await trafficReportAPI.post(`/${reportId}/vote`, {
//         voteType
//       })
//       return response.data
//     } catch (error) {
//       console.error('Error voting on report:', error)
//       throw error
//     }
//   },

//   // Delete report
//   deleteReport: async (reportId) => {
//     try {
//       const response = await trafficReportAPI.delete(`/${reportId}`)
//       return response.data
//     } catch (error) {
//       console.error('Error deleting report:', error)
//       throw error
//     }
//   }
// }



import { Client } from '@stomp/stompjs';
import axios from 'axios';
import SockJS from 'sockjs-client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const trafficReportAPI = axios.create({
  baseURL: `${API_BASE_URL}/traffic-reports`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
trafficReportAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const trafficReportService = {
  // WebSocket client instance
  stompClient: null,
  // Callbacks for subscribers to real-time updates
  subscribers: [],

  // Initialize WebSocket connection
  connectWebSocket: function () {
    if (this.stompClient && this.stompClient.connected) {
      return; // Already connected
    }

    const socket = new SockJS('http://localhost:8080/ws'); // Adjust to your backend WebSocket URL
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // Auto-reconnect every 5 seconds
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.onConnect = (frame) => {
      console.log('Connected to WebSocket');
      // Subscribe to the reports topic
      this.stompClient.subscribe('/topic/reports', (message) => {
        const report = JSON.parse(message.body);
        // Notify all subscribers
        this.subscribers.forEach((callback) => callback(report));
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('STOMP error:', frame.headers.message);
    };

    this.stompClient.onWebSocketError = (error) => {
      console.error('WebSocket error:', error);
    };

    this.stompClient.activate();
  },

  // Disconnect WebSocket
  disconnectWebSocket: function () {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
      console.log('Disconnected from WebSocket');
    }
  },

  // Subscribe to real-time updates
  subscribeToUpdates: function (callback) {
    this.subscribers.push(callback);
    // Ensure WebSocket is connected
    this.connectWebSocket();
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
      if (this.subscribers.length === 0) {
        this.disconnectWebSocket();
      }
    };
  },

  // Get all active reports
  getAllReports: async () => {
    try {
      const response = await trafficReportAPI.get('');
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  },

  // Get reports by category
  getReportsByCategory: async (category) => {
    try {
      const response = await trafficReportAPI.get(`/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reports by category:', error);
      throw error;
    }
  },

  // Get reports by severity
  getReportsBySeverity: async (severity) => {
    try {
      const response = await trafficReportAPI.get(`/severity/${severity}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reports by severity:', error);
      throw error;
    }
  },

  // Get reports in specific area
  getReportsInArea: async (minLat, maxLat, minLng, maxLng) => {
    try {
      const response = await trafficReportAPI.get('/area', {
        params: { minLat, maxLat, minLng, maxLng },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching reports in area:', error);
      throw error;
    }
  },

  // Get recent reports
  getRecentReports: async (hours = 24) => {
    try {
      const response = await trafficReportAPI.get('/recent', {
        params: { hours },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent reports:', error);
      throw error;
    }
  },

  // Create new report
  createReport: async (reportData) => {
    try {
      const response = await trafficReportAPI.post('/', reportData);
      return response.data;
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  },

  // Vote on report
  voteOnReport: async (reportId, voteType) => {
    try {
      const response = await trafficReportAPI.post(`/${reportId}/vote`, {
        
        voteType: voteType // Ensure key matches backend DTO
      });
      return response.data;
    } catch (error) {
      console.error('Error voting on report:', error);
      throw error;
    }
  },

  // Delete report
  deleteReport: async (reportId) => {
    try {
      const response = await trafficReportAPI.delete(`/${reportId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  },
};