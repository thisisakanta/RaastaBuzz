import { Rtt } from '@mui/icons-material'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

const trafficReportAPI = axios.create({
  baseURL: `${API_BASE_URL}/traffic-reports`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
trafficReportAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const trafficReportService = {
  // Get all active reports
  getAllReports: async () => {
    try {
      const response = await trafficReportAPI.get('')
      console.log(response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching reports:', error)
      throw error
    }
  },

  // Get reports by category
  getReportsByCategory: async (category) => {
    try {
      const response = await trafficReportAPI.get(`/category/${category}`)
      return response.data
    } catch (error) {
      console.error('Error fetching reports by category:', error)
      throw error
    }
  },

  // Get reports by severity
  getReportsBySeverity: async (severity) => {
    try {
      const response = await trafficReportAPI.get(`/severity/${severity}`)
      return response.data
    } catch (error) {
      console.error('Error fetching reports by severity:', error)
      throw error
    }
  },

  // Get reports in specific area
  getReportsInArea: async (minLat, maxLat, minLng, maxLng) => {
    try {
      const response = await trafficReportAPI.get('/area', {
        params: { minLat, maxLat, minLng, maxLng }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching reports in area:', error)
      throw error
    }
  },

  // Get recent reports
  getRecentReports: async (hours = 24) => {
    try {
      const response = await trafficReportAPI.get('/recent', {
        params: { hours }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching recent reports:', error)
      throw error
    }
  },

  // Create new report
  createReport: async (reportData) => {
    try {
      const response = await trafficReportAPI.post('/', reportData)
      return response.data
    } catch (error) {
      console.error('Error creating report:', error)
      throw error
    }
  },

  // Vote on report
  voteOnReport: async (reportId, voteType) => {
    try {
      const response = await trafficReportAPI.post(`/${reportId}/vote`, {
        voteType
      })
      return response.data
    } catch (error) {
      console.error('Error voting on report:', error)
      throw error
    }
  },

  // Delete report
  deleteReport: async (reportId) => {
    try {
      const response = await trafficReportAPI.delete(`/${reportId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting report:', error)
      throw error
    }
  }
}