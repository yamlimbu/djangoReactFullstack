import { useState } from "react";
import { TrendingUp, Download, RefreshCw, Zap, Target } from "lucide-react";

function Trends() {
  const [timeRange, setTimeRange] = useState("last30days");
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const trendingTopics = [
    { topic: "Machine Learning", trend: "📈", growth: "+45.2%", videos: 12 },
    { topic: "Web Development", trend: "📈", growth: "+32.1%", videos: 8 },
    { topic: "Data Science", trend: "📈", growth: "+28.5%", videos: 15 },
    { topic: "Python Programming", trend: "📊", growth: "+18.3%", videos: 10 },
    { topic: "Cloud Computing", trend: "📈", growth: "+22.7%", videos: 6 },
  ];

  const seasonalPatterns = [
    { month: "Jan", views: 45000, trend: "📈" },
    { month: "Feb", views: 52000, trend: "📈" },
    { month: "Mar", views: 48000, trend: "📉" },
    { month: "Apr", views: 61000, trend: "📈" },
    { month: "May", views: 58000, trend: "📉" },
    { month: "Jun", views: 72000, trend: "📈" },
  ];

  const predictions = [
    { metric: "Next Month Views", predicted: "85K", confidence: "92%" },
    { metric: "Subscriber Growth", predicted: "+3.2K", confidence: "88%" },
    { metric: "Revenue Forecast", predicted: "$15.2K", confidence: "85%" },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📈 Trends</h1>
          <p className="text-gray-600 mt-2">Trend detection and predictive analytics</p>
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

      <div className="mb-6 flex gap-2">
        {["last7days", "last30days", "last90days"].map((period) => (
          <button
            key={period}
            onClick={() => setTimeRange(period)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              timeRange === period
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {period.replace("last", "").replace("days", "d")}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Trending Topics */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Target size={24} className="text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">🔥 Trending Topics</h2>
          </div>
          <div className="space-y-4">
            {trendingTopics.map((item, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{item.trend}</span>
                    <div>
                      <p className="font-medium text-gray-900">{item.topic}</p>
                      <p className="text-xs text-gray-500">{item.videos} videos</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-bold">{item.growth}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                    style={{ width: `${Math.min(parseInt(item.growth) / 50 * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Predictions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Zap size={24} className="text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">🔮 Predictions</h2>
          </div>
          <div className="space-y-4">
            {predictions.map((pred, idx) => (
              <div key={idx} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-gray-900">{pred.metric}</p>
                  <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                    {pred.confidence} confidence
                  </span>
                </div>
                <p className="text-2xl font-bold text-purple-600">{pred.predicted}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seasonal Patterns */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">📅 Seasonal Patterns</h2>
        <div className="flex items-end justify-between gap-2 h-64">
          {seasonalPatterns.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-200 rounded-t-lg relative group">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-500"
                  style={{ height: `${(item.views / 72000) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {(item.views / 1000).toFixed(0)}K
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2 font-medium">{item.month}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">💡 Trend Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <p className="font-medium text-gray-900">🚀 Rising Topics</p>
            <p className="text-sm text-gray-600 mt-2">Machine Learning and Web Development are trending up</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-medium text-gray-900">📊 Seasonal Peak</p>
            <p className="text-sm text-gray-600 mt-2">June shows highest views - plan content accordingly</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-medium text-gray-900">🎯 Content Strategy</p>
            <p className="text-sm text-gray-600 mt-2">Focus on trending topics for maximum engagement</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trends;
