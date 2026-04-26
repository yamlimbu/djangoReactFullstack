import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BarChart3, TrendingUp, Download, RefreshCw, Calendar, AlertCircle } from "lucide-react";
import { youtubeApi } from "../api.js";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend
} from 'recharts';

function Analytics() {
  const [timeRange, setTimeRange] = useState("last30days");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [chartData, setChartData] = useState([]);
  
  const location = useLocation();

  const formatNumber = (num) => {
    if (num === undefined || num === null) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const fetchAnalytics = async () => {
    const params = new URLSearchParams(location.search);
    let channelId = params.get('channel_id') || localStorage.getItem('selectedChannelId');
    
    if (!channelId) {
      try {
        const res = await youtubeApi.get('/youtube/channels/');
        if (res.data.channels && res.data.channels.length > 0) {
          channelId = res.data.channels[0].id;
        }
      } catch (err) {
        console.error("Failed to fetch channels", err);
      }
    }

    if (!channelId) {
      setError("No channel selected. Please select or sync a YouTube channel first.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [dashboardRes, videosRes] = await Promise.all([
        youtubeApi.get(`/youtube/dashboard/?channel_id=${channelId}&period=${timeRange}`),
        youtubeApi.get(`/youtube/videos/?channel_id=${channelId}`)
      ]);
      
      if (dashboardRes.data.api_status === "success" || dashboardRes.data.statistics) {
         setAnalyticsData(dashboardRes.data);
         
         if (videosRes.data && videosRes.data.videos) {
            let sortedVideos = [...videosRes.data.videos].sort((a, b) => new Date(a.published_at) - new Date(b.published_at));
            
            // Filter videos based on timeRange
            if (timeRange && timeRange !== "all_time") {
                const now = new Date();
                let daysToSubtract = 30;
                if (timeRange === "last7days") daysToSubtract = 7;
                else if (timeRange === "last90days") daysToSubtract = 90;
                
                const cutoff = new Date();
                cutoff.setDate(now.getDate() - daysToSubtract);
                
                sortedVideos = sortedVideos.filter(v => new Date(v.published_at) >= cutoff);
            }
            
            const chartFormatted = sortedVideos.map(v => ({
              name: v.title.length > 20 ? v.title.substring(0, 20) + '...' : v.title,
              date: new Date(v.published_at).toLocaleDateString(),
              views: v.views || 0,
              likes: v.likes || 0,
              comments: v.comments || 0
            }));
            
            setChartData(chartFormatted);
         }
      } else {
         setError(dashboardRes.data.error || "Failed to load analytics");
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Error fetching analytics data from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [location.search, timeRange]);

  const handleRefresh = () => {
    fetchAnalytics();
  };

  const stats = [
    { 
      title: "Total Views", 
      value: formatNumber(analyticsData?.statistics?.total_views || 0), 
      icon: "👁️", 
      trend: "Based on videos", 
      color: "blue" 
    },
    { 
      title: "Engagement Rate", 
      value: `${analyticsData?.quick_metrics?.engagement_rate?.toFixed(1) || 0}%`, 
      icon: "📈", 
      trend: "Likes/Views", 
      color: "green" 
    },
    { 
      title: "Est. Watch Time", 
      value: `${analyticsData?.quick_metrics?.estimated_watch_time?.toFixed(1) || 0}h`, 
      icon: "⏱️", 
      trend: "Derived from views", 
      color: "purple" 
    },
    { 
      title: "Revenue", 
      value: `$${analyticsData?.quick_metrics?.estimated_revenue?.toFixed(2) || 0}`, 
      icon: "💰", 
      trend: "Estimated RPM", 
      color: "amber" 
    },
  ];

  const detailedMetrics = [
    { label: "Avg Video Views", value: formatNumber(analyticsData?.quick_metrics?.avg_video_views || 0), change: "Per video" },
    { label: "Total Videos", value: formatNumber(analyticsData?.statistics?.total_videos || 0), change: "Public count" },
    { label: "Subscribers", value: formatNumber(analyticsData?.statistics?.subscribers || 0), change: "Total count" },
    { label: "Data Source", value: "YouTube API v3", change: analyticsData?.api_status === 'success' ? "Live sync" : "Offline" },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📊 Analytics</h1>
          <p className="text-gray-600 mt-2">
            Advanced analytics and trend analysis 
            {analyticsData?.channel_info && ` for ${analyticsData.channel_info.title}`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <div>
            <p className="font-medium">Error Loading Data</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Time Range Selector */}
      <div className="mb-6 flex gap-2">
        {["all_time", "last7days", "last30days", "last90days"].map((period) => (
          <button
            key={period}
            onClick={() => setTimeRange(period)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              timeRange === period
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {period === "all_time" ? "Lifetime" : period.replace("last", "").replace("days", "d")}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-${stat.color}-500`}>
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-${stat.color}-600 text-sm font-medium`}>{stat.title}</p>
                <h3 className="text-2xl font-bold mt-2 text-gray-900">
                  {loading && !analyticsData ? "..." : stat.value}
                </h3>
                <p className="text-gray-500 text-sm mt-2">{stat.trend}</p>
              </div>
              <div className={`p-3 bg-${stat.color}-50 rounded-xl`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Trend Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">📈 View Trends</h2>
            <Calendar size={20} className="text-gray-400" />
          </div>
          <div className="h-72 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{fontSize: 12}} 
                    angle={-45} 
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tickFormatter={(val) => formatNumber(val)} tick={{fontSize: 12}} />
                  <Tooltip 
                    formatter={(value) => new Intl.NumberFormat().format(value)}
                    labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 8 }} name="Views" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 size={48} className="text-blue-300 mx-auto mb-2" />
                  <p className="text-gray-500">Loading chart data...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Engagement Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">💬 Engagement Metrics</h2>
            <TrendingUp size={20} className="text-gray-400" />
          </div>
          <div className="h-72 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{fontSize: 12}} 
                    angle={-45} 
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tickFormatter={(val) => formatNumber(val)} tick={{fontSize: 12}} />
                  <Tooltip 
                    formatter={(value) => new Intl.NumberFormat().format(value)}
                    labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Bar dataKey="likes" fill="#10b981" name="Likes" stackId="a" />
                  <Bar dataKey="comments" fill="#8b5cf6" name="Comments" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp size={48} className="text-green-300 mx-auto mb-2" />
                  <p className="text-gray-500">Loading chart data...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">📊 Detailed Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {detailedMetrics.map((metric, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm font-medium">{metric.label}</p>
              <h4 className="text-2xl font-bold mt-2 text-gray-900">
                {loading && !analyticsData ? "..." : metric.value}
              </h4>
              <p className="text-gray-500 text-sm mt-1">{metric.change}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">💡 Analytics Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <p className="font-medium text-gray-900">📈 Track Trends</p>
            <p className="text-sm text-gray-600 mt-2">Monitor your metrics over time to identify patterns and opportunities</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-medium text-gray-900">🎯 Set Goals</p>
            <p className="text-sm text-gray-600 mt-2">Define clear KPIs and track progress towards your objectives</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-medium text-gray-900">📊 Compare Data</p>
            <p className="text-sm text-gray-600 mt-2">Use different time ranges to compare performance and identify growth</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
