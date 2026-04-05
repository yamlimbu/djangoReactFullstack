import { useState } from "react";
import { Video, Search, Download, RefreshCw, Filter, Eye, ThumbsUp, MessageCircle } from "lucide-react";

function Videos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("views");

  const mockVideos = [
    { 
      id: 1, 
      title: "Big Data Tutorial - Complete Guide", 
      views: 125000, 
      likes: 3200, 
      comments: 450, 
      date: "2024-01-15",
      thumbnail: "🎬"
    },
    { 
      id: 2, 
      title: "Python for Data Science - Advanced", 
      views: 98000, 
      likes: 2100, 
      comments: 320, 
      date: "2024-01-14",
      thumbnail: "🐍"
    },
    { 
      id: 3, 
      title: "Machine Learning Basics Explained", 
      views: 87000, 
      likes: 1900, 
      comments: 280, 
      date: "2024-01-13",
      thumbnail: "🤖"
    },
    { 
      id: 4, 
      title: "React Hooks Deep Dive", 
      views: 76000, 
      likes: 1650, 
      comments: 210, 
      date: "2024-01-12",
      thumbnail: "⚛️"
    },
    { 
      id: 5, 
      title: "Database Optimization Tips", 
      views: 65000, 
      likes: 1400, 
      comments: 180, 
      date: "2024-01-11",
      thumbnail: "🗄️"
    },
  ];

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const filteredVideos = mockVideos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (sortBy === "views") return b.views - a.views;
    if (sortBy === "likes") return b.likes - a.likes;
    if (sortBy === "comments") return b.comments - a.comments;
    if (sortBy === "date") return new Date(b.date) - new Date(a.date);
    return 0;
  });

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
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition-colors"
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
            <option value="views">Sort by Views</option>
            <option value="likes">Sort by Likes</option>
            <option value="comments">Sort by Comments</option>
            <option value="date">Sort by Date</option>
          </select>
          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition-colors">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {sortedVideos.map((video) => (
          <div key={video.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="flex gap-4 p-4">
              {/* Thumbnail */}
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-4xl">{video.thumbnail}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate hover:text-blue-600 cursor-pointer">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Published: {video.date}</p>

                {/* Stats */}
                <div className="flex gap-4 mt-3 text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Eye size={14} />
                    <span className="font-medium">{(video.views / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <ThumbsUp size={14} />
                    <span className="font-medium">{(video.likes / 1000).toFixed(1)}K</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <MessageCircle size={14} />
                    <span className="font-medium">{video.comments}</span>
                  </div>
                </div>

                {/* Engagement Rate */}
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Engagement</span>
                    <span className="text-xs font-bold text-green-600">
                      {((video.likes / video.views) * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                      style={{ width: `${Math.min(((video.likes / video.views) * 100) * 10, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">📊 Video Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-600 text-sm">Total Videos</p>
            <h4 className="text-2xl font-bold text-gray-900 mt-2">{sortedVideos.length}</h4>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-gray-600 text-sm">Total Views</p>
            <h4 className="text-2xl font-bold text-gray-900 mt-2">
              {(sortedVideos.reduce((sum, v) => sum + v.views, 0) / 1000).toFixed(0)}K
            </h4>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-gray-600 text-sm">Total Likes</p>
            <h4 className="text-2xl font-bold text-gray-900 mt-2">
              {(sortedVideos.reduce((sum, v) => sum + v.likes, 0) / 1000).toFixed(1)}K
            </h4>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg">
            <p className="text-gray-600 text-sm">Total Comments</p>
            <h4 className="text-2xl font-bold text-gray-900 mt-2">
              {sortedVideos.reduce((sum, v) => sum + v.comments, 0)}
            </h4>
          </div>
          <div className="p-4 bg-pink-50 rounded-lg">
            <p className="text-gray-600 text-sm">Avg Engagement</p>
            <h4 className="text-2xl font-bold text-gray-900 mt-2">
              {(
                (sortedVideos.reduce((sum, v) => sum + v.likes, 0) /
                  sortedVideos.reduce((sum, v) => sum + v.views, 0)) *
                100
              ).toFixed(2)}
              %
            </h4>
          </div>
        </div>
      </div>

      {/* No Results */}
      {sortedVideos.length === 0 && (
        <div className="text-center py-12">
          <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No videos found matching your search</p>
        </div>
      )}
    </div>
  );
}

export default Videos;
