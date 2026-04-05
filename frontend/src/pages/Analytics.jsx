import { useState } from "react";
import { BarChart3, TrendingUp, Download, RefreshCw, Calendar } from "lucide-react";

function Analytics() {
  const [timeRange, setTimeRange] = useState("last30days");
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const stats = [
    { title: "Total Views", value: "2.4M", icon: "👁️", trend: "+12.5%", color: "blue" },
    { title: "Engagement Rate", value: "8.7%", icon: "📈", trend: "+2.3%", color: "green" },
    { title: "Avg Watch Time", value: "4:32", icon: "⏱️", trend: "+1:15", color: "purple" },
    { title: "Revenue", value: "$4,280", icon: "💰", trend: "+18.3%", color: "amber" },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📊 Analytics</h1>
          <p className="text-gray-600 mt-2">Advanced analytics and trend analysis</p>
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

      {/* Time Range Selector */}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-2 text-gray-900">{stat.value}</h3>
                <p className="text-green-600 text-sm mt-2 font-medium">{stat.trend}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
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
          <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 size={48} className="text-blue-300 mx-auto mb-2" />
              <p className="text-gray-500">Chart visualization coming soon</p>
              <p className="text-sm text-gray-400 mt-1">Install Recharts to enable charts</p>
            </div>
          </div>
        </div>

        {/* Engagement Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">💬 Engagement Metrics</h2>
            <TrendingUp size={20} className="text-gray-400" />
          </div>
          <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp size={48} className="text-green-300 mx-auto mb-2" />
              <p className="text-gray-500">Chart visualization coming soon</p>
              <p className="text-sm text-gray-400 mt-1">Install Recharts to enable charts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">📊 Detailed Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Click-Through Rate", value: "3.2%", change: "+0.5%" },
            { label: "Conversion Rate", value: "2.1%", change: "+0.3%" },
            { label: "Bounce Rate", value: "42.3%", change: "-2.1%" },
            { label: "Avg Session Duration", value: "3:45", change: "+0:30" },
          ].map((metric, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm font-medium">{metric.label}</p>
              <h4 className="text-2xl font-bold mt-2 text-gray-900">{metric.value}</h4>
              <p className="text-green-600 text-sm mt-1">{metric.change}</p>
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
