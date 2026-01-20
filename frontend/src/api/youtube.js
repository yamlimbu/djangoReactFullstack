import api from './api';

const youtubeAPI = {
  // Get channel analytics
  getChannelAnalytics: (params) => 
    api.get('/api/youtube/analytics/', { params }),
  
  // Get video performance
  getVideoAnalytics: (videoId) => 
    api.get(`/api/youtube/videos/${videoId}/analytics/`),
  
  // Get audience demographics
  getAudienceDemographics: () => 
    api.get('/api/youtube/audience/demographics/'),
  
  // Get revenue reports
  getRevenueReports: (startDate, endDate) => 
    api.get('/api/youtube/revenue/', { params: { start_date: startDate, end_date: endDate } }),
  
  // Get geographic data
  getGeographicData: () => 
    api.get('/api/youtube/geographic/'),
  
  // Get real-time data
  getRealtimeData: () => 
    api.get('/api/youtube/realtime/'),
  
  // Export analytics data
  exportAnalytics: (format = 'json') => 
    api.get(`/api/youtube/export/`, { 
      params: { format },
      responseType: 'blob'
    }),
};

export default youtubeAPI;