import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Video, Search, Download, RefreshCw, Filter, Eye, ThumbsUp, MessageCircle, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { youtubeApi } from "../api.js";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

function Videos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videos, setVideos] = useState([]);
  const [sortBy, setSortBy] = useState("date"); // default to newest first
  const [timeRange, setTimeRange] = useState("last30days");
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();

  const fetchVideos = async () => {
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
      setError("No channel selected. Please select a channel from the dashboard.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await youtubeApi.get(`/youtube/videos/?channel_id=${channelId}`);
      if (res.data.videos) {
        setVideos(res.data.videos);
      } else {
        setError(res.data.error || "Failed to load videos");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching video data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [location.search]);

  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [timeRange, searchQuery, sortBy]);

  const handleRefresh = () => {
    fetchVideos();
  };

  // 1. Time Filtering
  let timeFiltered = videos;
  if (timeRange && timeRange !== "all_time") {
    const now = new Date();
    let daysToSubtract = 30;
    if (timeRange === "last7days") daysToSubtract = 7;
    else if (timeRange === "last90days") daysToSubtract = 90;
    
    const cutoff = new Date();
    cutoff.setDate(now.getDate() - daysToSubtract);
    timeFiltered = videos.filter(v => new Date(v.published_at) >= cutoff);
  }

  // 2. Search filtering
  const filteredVideos = timeFiltered.filter(video =>
    (video.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 3. Sorting
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (sortBy === "views") return (b.views || 0) - (a.views || 0);
    if (sortBy === "likes") return (b.likes || 0) - (a.likes || 0);
    if (sortBy === "comments") return (b.comments || 0) - (a.comments || 0);
    if (sortBy === "date") return new Date(b.published_at || 0) - new Date(a.published_at || 0);
    return 0;
  });

  // 4. Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedVideos.length / itemsPerPage);
  const paginatedVideos = sortedVideos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatNumber = (num) => {
    if (!num && num !== 0) return "0";
    const parsed = parseInt(num);
    if (isNaN(parsed)) return "0";
    return Intl.NumberFormat('en-US', {
      notation: "compact",
      maximumFractionDigits: 1
    }).format(parsed);
  };

  const totalViews = sortedVideos.reduce((sum, v) => sum + (v.views || 0), 0);
  const totalLikes = sortedVideos.reduce((sum, v) => sum + (v.likes || 0), 0);
  const totalComments = sortedVideos.reduce((sum, v) => sum + (v.comments || 0), 0);
  const avgEngagement = totalViews > 0 ? ((totalLikes / totalViews) * 100).toFixed(2) : "0.00";

  // Chart Data
  const chartData = sortedVideos.slice(0, 10).map(v => ({
    name: v.title.length > 15 ? v.title.substring(0, 15) + '...' : v.title,
    views: v.views || 0,
    likes: v.likes || 0,
    comments: v.comments || 0,
  }));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🎬 Videos</h1>
          <p className="text-gray-600 mt-2">Manage and analyze your video performance</p>
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
            <p className="font-medium">Error Loading Videos</p>
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top 10 Views Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📈 Top 10 by Views</h2>
          <div className="h-64 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{fontSize: 10}} 
                    angle={-45} 
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tickFormatter={(val) => formatNumber(val)} tick={{fontSize: 12}} />
                  <Tooltip 
                    formatter={(value) => new Intl.NumberFormat().format(value)}
                    labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="views" fill="#3b82f6" name="Views" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No data for charts</p>
              </div>
            )}
          </div>
        </div>

        {/* Top 10 Engagement Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💬 Engagement (Top 10)</h2>
          <div className="h-64 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{fontSize: 10}} 
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
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No data for charts</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">📊 Video Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-600 text-sm">Total Videos</p>
            <h4 className="text-2xl font-bold text-gray-900 mt-2">{sortedVideos.length}</h4>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-gray-600 text-sm">Total Views</p>
            <h4 className="text-2xl font-bold text-gray-900 mt-2">
              {formatNumber(totalViews)}
            </h4>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-gray-600 text-sm">Total Likes</p>
            <h4 className="text-2xl font-bold text-gray-900 mt-2">
              {formatNumber(totalLikes)}
            </h4>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg">
            <p className="text-gray-600 text-sm">Total Comments</p>
            <h4 className="text-2xl font-bold text-gray-900 mt-2">
              {formatNumber(totalComments)}
            </h4>
          </div>
          <div className="p-4 bg-pink-50 rounded-lg">
            <p className="text-gray-600 text-sm">Avg Engagement</p>
            <h4 className="text-2xl font-bold text-gray-900 mt-2">
              {avgEngagement}%
            </h4>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex gap-4 flex-col md:flex-row">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search videos by title..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="date">Sort by Date</option>
            <option value="views">Sort by Views</option>
            <option value="likes">Sort by Likes</option>
            <option value="comments">Sort by Comments</option>
          </select>
          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition-colors">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      {/* Videos List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        {loading && videos.length === 0 ? (
          <div className="text-center py-12">
            <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading videos...</p>
          </div>
        ) : paginatedVideos.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {paginatedVideos.map((video) => {
              const views = video.views || 0;
              const likes = video.likes || 0;
              const engagementRate = views > 0 ? ((likes / views) * 100) : 0;
              
              return (
                <div key={video.id} className="p-4 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row gap-4">
                  {/* Thumbnail */}
                  <div className="w-full sm:w-48 h-28 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {video.thumbnail?.startsWith('http') ? (
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl">🎬</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 hover:text-blue-600 cursor-pointer text-lg line-clamp-2" title={video.title}>
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Published: {video.published_at ? new Date(video.published_at).toLocaleDateString() : 'N/A'}
                    </p>

                    {/* Stats Row */}
                    <div className="flex flex-wrap gap-6 mt-3">
                      <div className="flex items-center gap-2 text-gray-600" title={`Views: ${Number(views).toLocaleString()}`}>
                        <Eye size={16} className="text-blue-500" />
                        <span className="font-medium text-gray-900">{formatNumber(views)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600" title={`Likes: ${Number(likes).toLocaleString()}`}>
                        <ThumbsUp size={16} className="text-green-500" />
                        <span className="font-medium text-gray-900">{formatNumber(likes)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600" title={`Comments: ${Number(video.comments || 0).toLocaleString()}`}>
                        <MessageCircle size={16} className="text-purple-500" />
                        <span className="font-medium text-gray-900">{formatNumber(video.comments || 0)}</span>
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                          {engagementRate.toFixed(1)}% Engagement
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No videos found matching your filter</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-lg">
          <div className="text-sm text-gray-600 hidden sm:block">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedVideos.length)} of {sortedVideos.length} videos
          </div>
          <div className="flex gap-2 w-full sm:w-auto justify-center">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                if (
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 || 
                  page === currentPage + 2
                ) {
                  return <span key={page} className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>;
                }
                return null;
              })}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Videos;
