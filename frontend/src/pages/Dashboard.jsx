import { useState, useEffect } from "react";
import api, { youtubeApi } from "../api.js";  // Added youtubeApi import
import { Link } from "react-router-dom";
import {
  BarChart3,
  Users,
  Eye,
  ThumbsUp,
  Clock,
  TrendingUp,
  Video,
  DollarSign,
  Download,
  Calendar,
  Search,
  RefreshCw,
  AlertCircle,
  Plus
} from "lucide-react";

function Dashboard() {
  // State for real data
  const [analytics, setAnalytics] = useState(null);
  const [channelStats, setChannelStats] = useState({
    totalViews: "0",
    subscribers: "0",
    totalVideos: "0",
    channelTitle: "Loading..."
  });

  const [timeRange, setTimeRange] = useState("last30days");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topVideos, setTopVideos] = useState([]);
  const [searchedChannels, setSearchedChannels] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChannelId, setSelectedChannelId] = useState(""); // Dynamically fetch user channels

  // Debug logging
  useEffect(() => {
    console.log("Analytics state updated:", analytics);
    console.log("Channel stats:", channelStats);
    console.log("Top videos:", topVideos);
  }, [analytics, channelStats, topVideos]);

  useEffect(() => {
    if (selectedChannelId) {
      fetchYouTubeData();
    }
  }, [timeRange, selectedChannelId]);

  useEffect(() => {
    const fetchDefaultChannel = async () => {
      try {
        const res = await youtubeApi.get('/youtube/channels/');
        if (res.data.channels && res.data.channels.length > 0) {
          let targetChannelId = res.data.channels[0].id;
          const storedId = localStorage.getItem('selectedChannelId');
          
          if (storedId) {
            const found = res.data.channels.find(c => c.id === storedId);
            if (found) {
              targetChannelId = found.id;
            }
          }
          
          setSelectedChannelId(targetChannelId);
          localStorage.setItem('selectedChannelId', targetChannelId);
        } else {
          setLoading(false);
          setError("No YouTube channels found. Please sync a channel first.");
        }
      } catch (err) {
        console.error("Error fetching channels:", err);
        setLoading(false);
        setError("Failed to load user channels.");
      }
    };
    
    fetchDefaultChannel();
  }, []);

  const fetchYouTubeData = async () => {
    if (!selectedChannelId) return;

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching YouTube data for channel:", selectedChannelId);

      // First, try to use the new dashboard endpoint
      try {
        const dashboardRes = await youtubeApi.get(`/youtube/dashboard/?channel_id=${selectedChannelId}&period=${timeRange}`);
        const data = dashboardRes.data;

        console.log("Dashboard response:", data);

        if (data.api_status === "success") {
          // Set analytics data
          setAnalytics({
            channel_info: data.channel_info,
            statistics: data.statistics,
            period: data.period,
            date_range: data.date_range,
            api_status: data.api_status,
            channel_id: data.channel_id,
            quick_metrics: data.quick_metrics,
            period_statistics: data.period_statistics
          });

          // Set channel stats
          setChannelStats({
            totalViews: data.statistics?.total_views || 0,
            subscribers: data.statistics?.subscribers || 0,
            totalVideos: data.statistics?.total_videos || 0,
            channelTitle: data.channel_info?.title || "Unknown Channel"
          });

          // Set top videos
          setTopVideos(data.top_videos || []);
          return; // Success, exit early
        }
      } catch (dashboardError) {
        console.log("Dashboard endpoint failed, trying individual endpoints:", dashboardError.message);
      }

      // Fallback to individual endpoints if dashboard endpoint fails
      console.log("Using individual endpoints...");

      // 1. Fetch channel analytics
      const analyticsRes = await youtubeApi.get(`/youtube/analytics/?channel_id=${selectedChannelId}&period=${timeRange}`);
      console.log("Analytics response:", analyticsRes.data);

      const analyticsData = analyticsRes.data;
      setAnalytics(analyticsData);

      // Extract stats from analytics
      if (analyticsData?.statistics) {
        setChannelStats({
          totalViews: analyticsData.statistics.total_views || 0,
          subscribers: analyticsData.statistics.subscribers || 0,
          totalVideos: analyticsData.statistics.total_videos || 0,
          channelTitle: analyticsData.channel_info?.title || "Unknown Channel"
        });
      }

      // 2. Fetch top videos
      const videosRes = await youtubeApi.get(`/youtube/videos/?channel_id=${selectedChannelId}&max_results=5`);
      console.log("Videos response:", videosRes.data);
      setTopVideos(videosRes.data?.videos || []);

    } catch (err) {
      console.error("Error fetching YouTube data:", err);
      const errorMessage = err.response?.data?.error || err.message || "Failed to load YouTube data";
      setError(errorMessage);

      // Set default values on error
      setChannelStats({
        totalViews: "Error",
        subscribers: "Error",
        totalVideos: "0",
        channelTitle: "Error Loading Channel"
      });
    } finally {
      setLoading(false);
    }
  };

  const searchChannels = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await youtubeApi.get(`/youtube/search/channels/?q=${searchQuery}&max_results=5`);
      setSearchedChannels(response.data?.channels || []);
    } catch (err) {
      console.error("Error searching channels:", err);
    }
  };

  const selectChannel = (channelId, channelTitle) => {
    setSelectedChannelId(channelId);
    localStorage.setItem('selectedChannelId', channelId);
    setChannelStats(prev => ({ ...prev, channelTitle }));
    setSearchedChannels([]);
    setSearchQuery("");
  };

  const addChannel = async (channelId) => {
    try {
      await youtubeApi.post('/youtube/channels/', { channel_id: channelId });
      alert("Channel saved to profile successfully!");
    } catch (err) {
      console.error("Error saving channel:", err);
      alert("Failed to save channel to profile.");
    }
  };

  const exportReport = async () => {
    try {
      const response = await youtubeApi.get(`/youtube/export/?channel_id=${selectedChannelId}&format=json`, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `youtube_analytics_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export report");
    }
  };

  // Format numbers with compact notation (e.g., 1.2K, 1.5M)
  const formatNumber = (num) => {
    if (!num && num !== 0) return "0";
    const parsed = parseInt(num);
    if (isNaN(parsed)) return "0";
    
    return Intl.NumberFormat('en-US', {
      notation: "compact",
      maximumFractionDigits: 1
    }).format(parsed);
  };

  // Calculate watch time from analytics data
  const calculateWatchTime = () => {
    // First try quick_metrics
    if (analytics?.quick_metrics?.estimated_watch_time) {
      return formatNumber(Math.floor(analytics.quick_metrics.estimated_watch_time));
    }

    // Fallback calculation
    if (analytics?.statistics?.total_views) {
      const estimatedHours = Math.floor(analytics.statistics.total_views * 0.5 / 60);
      return formatNumber(estimatedHours);
    }

    return "0";
  };

  // Calculate estimated revenue from analytics data
  const calculateEstimatedRevenue = () => {
    // First try quick_metrics
    if (analytics?.quick_metrics?.estimated_revenue) {
      return `$${formatNumber(Math.floor(analytics.quick_metrics.estimated_revenue))}`;
    }

    // Fallback calculation
    if (analytics?.statistics?.total_views) {
      const estimatedRevenue = analytics.statistics.total_views * 0.001;
      return `$${formatNumber(Math.floor(estimatedRevenue))}`;
    }

    return "$0";
  };

  // Calculate engagement rate from analytics data
  const calculateEngagementRate = () => {
    // First try quick_metrics
    if (analytics?.quick_metrics?.engagement_rate) {
      return `${analytics.quick_metrics.engagement_rate.toFixed(1)}%`;
    }

    // Fallback calculation from top videos
    if (topVideos.length > 0) {
      const totalLikes = topVideos.reduce((sum, video) => sum + (video.likes || 0), 0);
      const totalViews = topVideos.reduce((sum, video) => sum + (video.views || 0), 0);
      if (totalViews === 0) return "0%";
      return `${((totalLikes / totalViews) * 100).toFixed(1)}%`;
    }

    return "0%";
  };

  if (loading && !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading YouTube analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 w-full max-w-full overflow-hidden">
      {/* Header with Channel Search */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6 w-full">
        <div className="w-full xl:w-auto">
          <h1 className="text-3xl font-bold text-gray-900">📊 YouTube Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time analytics for YouTube channels</p>

          {/* Channel Selector */}
          <div className="mt-4 relative max-w-md w-full">
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <div className="flex-1 relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchChannels()}
                  placeholder="Search YouTube channels..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <button
                  onClick={searchChannels}
                  className="absolute right-2 top-2 text-blue-600 hover:text-blue-800"
                >
                  Search
                </button>
              </div>
              <button
                onClick={fetchYouTubeData}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto whitespace-nowrap"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>

            {/* Search Results Dropdown */}
            {searchedChannels.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searchedChannels.map((channel) => (
                  <div key={channel.id} className="w-full flex items-center justify-between border-b border-gray-100 last:border-0 hover:bg-gray-50 pr-2">
                    <button
                      onClick={() => selectChannel(channel.id, channel.title)}
                      className="flex-1 px-4 py-3 text-left flex items-center gap-3"
                    >
                      <img
                        src={channel.thumbnail}
                        alt={channel.title}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{channel.title}</div>
                        <div className="text-sm text-gray-600">
                          {formatNumber(channel.statistics?.subscribers)} subscribers • {formatNumber(channel.statistics?.videos)} videos
                        </div>
                      </div>
                    </button>
                    <button 
                      onClick={() => addChannel(channel.id)}
                      title="Save to Profile"
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors flex-shrink-0"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected Channel Info & Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full xl:w-auto">
          <div className="text-left sm:text-right hidden sm:block">
            <div className="text-sm text-gray-600">Current Channel</div>
            <div className="font-bold text-gray-900">{channelStats.channelTitle}</div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="flex flex-wrap bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
              {["all_time", "last7days", "last30days", "last90days"].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeRange(period)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all flex-1 sm:flex-none text-center ${timeRange === period
                      ? "bg-white shadow text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  {period === "all_time" ? "Lifetime" : period.replace("last", "").replace("days", "d")}
                </button>
              ))}
            </div>
            <button
              onClick={exportReport}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <div>
            <p className="font-medium">Error Loading Data</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={fetchYouTubeData}
            className="ml-auto text-red-700 hover:text-red-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats Grid with REAL DATA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {/* Total Views */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Views (Period)</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                {formatNumber(analytics?.period_statistics?.period_views || 0)}
              </h3>
              <p className="text-blue-600 text-sm mt-2 flex items-center gap-1">
                <Eye size={14} />
                <span title={`Lifetime views: ${formatNumber(channelStats.totalViews)}`}>
                  From videos in period
                </span>
              </p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Eye className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        {/* Subscribers */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Subscribers</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                {formatNumber(channelStats.subscribers)}
              </h3>
              <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                <Users size={14} />
                YouTube API Data
              </p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Users className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        {/* Total Videos */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Videos (Period)</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                {formatNumber(analytics?.period_statistics?.period_videos || 0)}
              </h3>
              <p className="text-purple-600 text-sm mt-2 flex items-center gap-1">
                <Video size={14} />
                <span title={`Total channel videos: ${channelStats.totalVideos}`}>
                  Published in period
                </span>
              </p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Video className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        {/* Estimated Watch Time */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl shadow-lg p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm font-medium">Estimated Watch Time</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                {calculateWatchTime()}h
              </h3>
              <p className="text-amber-600 text-sm mt-2 flex items-center gap-1">
                <Clock size={14} />
                Based on views estimate
              </p>
            </div>
            <div className="p-3 bg-amber-500/20 rounded-xl">
              <Clock className="text-amber-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 w-full">
        {/* Channel Information */}
        <div className="lg:col-span-2 min-w-0 w-full">
          <div className="bg-white rounded-2xl shadow-lg p-6 h-full min-w-0 w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-6">📊 Channel Analytics</h2>

            {analytics?.channel_info ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start gap-4 w-full">
                  {analytics.channel_info.thumbnail && (
                    <img
                      src={analytics.channel_info.thumbnail}
                      alt={analytics.channel_info.title}
                      className="w-16 h-16 rounded-full flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0 w-full">
                    <h3 className="text-lg font-bold text-gray-900 break-words">{analytics.channel_info.title}</h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-3 break-words">{analytics.channel_info.description}</p>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm">
                      {analytics.channel_info.custom_url && (
                        <span className="text-blue-600 break-all">🔗 {analytics.channel_info.custom_url}</span>
                      )}
                      {analytics.channel_info.published_at && (
                        <span className="text-gray-500 whitespace-nowrap">
                          <Calendar size={14} className="inline mr-1" />
                          Joined {new Date(analytics.channel_info.published_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Date Range */}
                {analytics.date_range && (
                  <div className="bg-gray-50 p-4 rounded-lg w-full overflow-hidden">
                    <div className="text-sm text-gray-600 mb-1">Analysis Period</div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Calendar size={16} className="text-gray-500 flex-shrink-0" />
                      <span className="font-medium break-words">
                        {analytics.date_range?.start} to {analytics.date_range?.end}
                      </span>
                      <span className="sm:ml-auto text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded whitespace-nowrap">
                        {analytics.period || timeRange}
                      </span>
                    </div>
                  </div>
                )}

                {/* API Status */}
                <div className={`p-3 rounded-lg w-full ${analytics.api_status === 'success' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${analytics.api_status === 'success' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-sm break-words">
                      API Status: <span className="font-medium">{analytics.api_status || 'unknown'}</span>
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No channel data available
              </div>
            )}
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
            <h2 className="text-xl font-bold text-gray-900 mb-6">📈 Quick Metrics</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-600">Engagement Rate</div>
                  <div className="text-lg font-bold text-gray-900">{calculateEngagementRate()}</div>
                </div>
                <TrendingUp className="text-green-600" size={20} />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-600">Estimated Revenue</div>
                  <div className="text-lg font-bold text-gray-900">{calculateEstimatedRevenue()}</div>
                </div>
                <DollarSign className="text-amber-600" size={20} />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-600">Avg. Video Views</div>
                  <div className="text-lg font-bold text-gray-900">
                    {analytics?.quick_metrics?.avg_video_views
                      ? formatNumber(analytics.quick_metrics.avg_video_views)
                      : (analytics?.statistics?.total_views && analytics?.statistics?.total_videos
                        ? formatNumber(Math.floor(analytics.statistics.total_views / analytics.statistics.total_videos))
                        : "0")
                    }
                  </div>
                </div>
                <BarChart3 className="text-purple-600" size={20} />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-600">Data Source</div>
                  <div className="text-sm font-medium text-blue-600">
                    {analytics?.api_status === 'success' ? 'YouTube Data API v3' : 'API Error'}
                  </div>
                </div>
                <div className={`text-xs px-2 py-1 rounded ${analytics?.api_status === 'success'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                  }`}>
                  {analytics?.api_status === 'success' ? 'LIVE' : 'ERROR'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Videos Section */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">🎬 Top Performing Videos</h2>
          <div className="text-sm text-gray-600">
            Showing {topVideos.length} videos from {channelStats.channelTitle}
          </div>
        </div>

        {topVideos.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-max">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Video</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Views</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Likes</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Comments</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Published</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topVideos.map((video, index) => (
                  <tr key={video.id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {video.thumbnail && (
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-16 h-9 rounded object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{video.title || 'Untitled Video'}</p>
                          <p className="text-sm text-gray-500 truncate">{video.description || ''}</p>
                          {video.tags && video.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {video.tags.slice(0, 2).map((tag, idx) => (
                                <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium" title={Number(video.views).toLocaleString()}>{formatNumber(video.views)}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1" title={Number(video.likes).toLocaleString()}>
                        <ThumbsUp size={14} className="text-gray-500" />
                        <span>{formatNumber(video.likes)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div title={Number(video.comments).toLocaleString()}>{formatNumber(video.comments)}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600">
                        {video.published_at ? new Date(video.published_at).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No video data available</p>
            <p className="text-sm text-gray-500 mt-1">Try selecting a different channel</p>
          </div>
        )}
      </div>

      {/* Tips & Next Steps */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">💡 Tips for Better Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <div className="text-2xl mb-2">🔍</div>
            <h4 className="font-medium mb-2">Search More Channels</h4>
            <p className="text-sm text-gray-600">Use the search bar above to analyze any public YouTube channel</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-2xl mb-2">📊</div>
            <h4 className="font-medium mb-2">Export Data</h4>
            <p className="text-sm text-gray-600">Click the Export button to download analytics in JSON or CSV format</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="font-medium mb-2">Try Different Channels</h4>
            <p className="text-sm text-gray-600">Analyze competitors or similar channels to benchmark performance</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;