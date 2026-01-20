import { useState, useEffect } from "react";
import api from "../api.js";
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
  Calendar
} from "lucide-react";

function Dashboard() {
  const [analytics, setAnalytics] = useState({
    totalViews: "2.4M",
    subscribers: "154K",
    watchTime: "45.2K",
    engagement: "8.7%",
    revenue: "$4,280",
    videos: 128,
    topVideo: "How to Analyze Big Data",
    avgViewDuration: "4:32"
  });

  const [timeRange, setTimeRange] = useState("last30days");
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [topVideos, setTopVideos] = useState([]);
  const [demographics, setDemographics] = useState([]);

  useEffect(() => {
    fetchAnalyticsData();
    generateSampleData();
  }, [timeRange]);

  const fetchAnalyticsData = () => {
    setLoading(true);
    // TODO: Replace with actual YouTube Analytics API calls
    // Example: api.get("/api/youtube/analytics/", { params: { period: timeRange } })
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const generateSampleData = () => {
    // Sample chart data
    const viewsData = [
      { date: "Jan 1", views: 12000, revenue: 420 },
      { date: "Jan 8", views: 18000, revenue: 630 },
      { date: "Jan 15", views: 22000, revenue: 770 },
      { date: "Jan 22", views: 19000, revenue: 665 },
      { date: "Jan 29", views: 25000, revenue: 875 },
    ];

    const videos = [
      { title: "Big Data Tutorial", views: "245K", likes: "12K", duration: "15:42", ctr: "8.2%" },
      { title: "ML Pipeline Guide", views: "189K", likes: "9.4K", duration: "22:18", ctr: "7.1%" },
      { title: "Data Visualization", views: "156K", likes: "8.2K", duration: "18:33", ctr: "6.8%" },
      { title: "Python for Data", views: "134K", likes: "7.1K", duration: "25:47", ctr: "6.2%" },
    ];

    const demoData = [
      { country: "United States", viewers: 35, color: "bg-blue-500" },
      { country: "India", viewers: 22, color: "bg-green-500" },
      { country: "UK", viewers: 12, color: "bg-purple-500" },
      { country: "Germany", viewers: 8, color: "bg-yellow-500" },
      { country: "Canada", viewers: 7, color: "bg-red-500" },
    ];

    setChartData(viewsData);
    setTopVideos(videos);
    setDemographics(demoData);
  };

  const exportReport = () => {
    // TODO: Implement report export
    alert("Exporting analytics report...");
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header with Time Range Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📊 YouTube Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time analytics for your YouTube channel</p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {["today", "last7days", "last30days", "last90days"].map((period) => (
              <button
                key={period}
                onClick={() => setTimeRange(period)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  timeRange === period
                    ? "bg-white shadow text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {period.replace("last", "").replace("days", " days")}
              </button>
            ))}
          </div>
          <button
            onClick={exportReport}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Views</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                {analytics.totalViews}
              </h3>
              <p className="text-blue-600 text-sm mt-2 flex items-center gap-1">
                <TrendingUp size={14} />
                +12.5% from last month
              </p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Eye className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Subscribers</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                {analytics.subscribers}
              </h3>
              <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                <TrendingUp size={14} />
                +2,340 this month
              </p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Users className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Watch Time (Hours)</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                {analytics.watchTime}
              </h3>
              <p className="text-purple-600 text-sm mt-2 flex items-center gap-1">
                <Clock size={14} />
                Avg: {analytics.avgViewDuration}
              </p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Clock className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl shadow-lg p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm font-medium">Estimated Revenue</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                {analytics.revenue}
              </h3>
              <p className="text-amber-600 text-sm mt-2 flex items-center gap-1">
                <DollarSign size={14} />
                +18.3% from last month
              </p>
            </div>
            <div className="p-3 bg-amber-500/20 rounded-xl">
              <DollarSign className="text-amber-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
        {/* Views Trend Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">📈 Views & Revenue Trend</h2>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Views</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Revenue ($)</span>
                </div>
              </div>
            </div>
            
            <div className="h-64">
              <div className="flex items-end h-full gap-4">
                {chartData.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex justify-center gap-1 mb-2">
                      <div 
                        className="w-3/4 bg-blue-500 rounded-t-lg" 
                        style={{ height: `${(item.views / 25000) * 100}%` }}
                      ></div>
                      <div 
                        className="w-3/4 bg-green-500 rounded-t-lg" 
                        style={{ height: `${(item.revenue / 1000) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{item.date}</span>
                    <span className="text-xs font-medium mt-1">{item.views.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Demographics */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
            <h2 className="text-xl font-bold text-gray-900 mb-6">🌍 Top Countries</h2>
            <div className="space-y-4">
              {demographics.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.country}</span>
                    <span className="text-gray-600">{item.viewers}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.viewers}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Audience Gender</h3>
              <div className="flex gap-4">
                <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl">👨</div>
                  <div className="font-bold text-blue-600">68%</div>
                  <div className="text-sm text-gray-600">Male</div>
                </div>
                <div className="flex-1 text-center p-3 bg-pink-50 rounded-lg">
                  <div className="text-2xl">👩</div>
                  <div className="font-bold text-pink-600">32%</div>
                  <div className="text-sm text-gray-600">Female</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Top Performing Videos */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">🎬 Top Performing Videos</h2>
            <Link to="/videos" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All →
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Video Title</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Views</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Likes</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">CTR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topVideos.map((video, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{video.title}</p>
                        <p className="text-sm text-gray-500">{video.duration}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium">{video.views}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <ThumbsUp size={14} className="text-gray-500" />
                        <span>{video.likes}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        parseFloat(video.ctr) > 7 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {video.ctr}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Insights & Actions */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <h2 className="text-xl font-bold mb-4">💡 Quick Insights</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="mt-1">✅</div>
                <span>Best posting time: 2-4 PM (GMT-5)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1">📊</div>
                <span>Top traffic source: YouTube Search (42%)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1">🎯</div>
                <span>Highest CTR tags: #BigData, #Analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1">🚀</div>
                <span>Growth opportunity: Shorts content</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">⚡ Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-center">
                <div className="text-2xl mb-2">📤</div>
                <span className="text-sm font-medium text-blue-700">Upload Video</span>
              </button>
              <button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-center">
                <div className="text-2xl mb-2">📊</div>
                <span className="text-sm font-medium text-green-700">Generate Report</span>
              </button>
              <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors text-center">
                <div className="text-2xl mb-2">🎯</div>
                <span className="text-sm font-medium text-purple-700">Audience Analysis</span>
              </button>
              <button className="p-4 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors text-center">
                <div className="text-2xl mb-2">💰</div>
                <span className="text-sm font-medium text-amber-700">Revenue Stats</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;