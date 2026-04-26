import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { DollarSign, TrendingUp, Download, RefreshCw, PieChart, AlertCircle } from "lucide-react";
import { youtubeApi } from "../api.js";

function Revenue() {
  const [timeRange, setTimeRange] = useState("last30days");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const location = useLocation();

  const fetchRevenueData = async () => {
    const params = new URLSearchParams(location.search);
    let channelId = params.get('channel_id') || localStorage.getItem('selectedChannelId');
    
    if (!channelId) {
      setError("No channel selected. Please select a channel from the dashboard.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await youtubeApi.get(`/youtube/dashboard/?channel_id=${channelId}&period=${timeRange}`);
      if (res.data.api_status === "success" || res.data.statistics) {
        setRevenueData(res.data);
      } else {
        setError(res.data.error || "Failed to load revenue data");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching revenue data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, [location.search, timeRange]);

  const handleRefresh = () => {
    fetchRevenueData();
  };

  // Derive revenue from backend or default to 0
  const totalRev = revenueData?.quick_metrics?.estimated_revenue || 0;
  const totalViews = revenueData?.statistics?.total_views || 0;
  // Calculate RPM correctly (Revenue per Mille)
  const rpm = totalViews > 0 ? (totalRev / (totalViews / 1000)) : 0;
  const cpm = rpm * 1.4; // Rough estimate for CPM based on RPM

  // Mock proportional distributions based on real total revenue
  const revenueSources = [
    { source: "AdSense", percentage: 65, amount: totalRev * 0.65, color: "bg-blue-500" },
    { source: "Channel Memberships", percentage: 15, amount: totalRev * 0.15, color: "bg-purple-500" },
    { source: "Super Chats", percentage: 10, amount: totalRev * 0.10, color: "bg-pink-500" },
    { source: "Merchandise", percentage: 8, amount: totalRev * 0.08, color: "bg-green-500" },
    { source: "Other", percentage: 2, amount: totalRev * 0.02, color: "bg-amber-500" },
  ];

  const revenueMetrics = [
    { label: "Total Revenue", value: `$${totalRev.toFixed(2)}`, trend: "Real-time", icon: "💰" },
    { label: "Est. CPM", value: `$${cpm.toFixed(2)}`, trend: "Calculated", icon: "📊" },
    { label: "Est. RPM", value: `$${rpm.toFixed(2)}`, trend: "Calculated", icon: "📈" },
    { label: "Est. Yearly", value: `$${(totalRev * 12).toFixed(2)}`, trend: "Projected", icon: "📅" },
  ];

  const revenueByDay = [
    { day: "Mon", revenue: totalRev * 0.13 },
    { day: "Tue", revenue: totalRev * 0.14 },
    { day: "Wed", revenue: totalRev * 0.16 },
    { day: "Thu", revenue: totalRev * 0.15 },
    { day: "Fri", revenue: totalRev * 0.17 },
    { day: "Sat", revenue: totalRev * 0.12 },
    { day: "Sun", revenue: totalRev * 0.13 },
  ];

  const maxRevenue = Math.max(...revenueByDay.map(d => d.revenue), 1); // Avoid division by 0

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">💰 Revenue</h1>
          <p className="text-gray-600 mt-2">Monetization and earnings analytics</p>
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
            <p className="font-medium">Error Loading Revenue</p>
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

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {revenueMetrics.map((metric, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">{metric.label}</p>
                <h3 className="text-2xl font-bold mt-2 text-gray-900">
                  {loading && !revenueData ? "..." : metric.value}
                </h3>
                <p className="text-green-600 text-sm mt-2 font-medium">{metric.trend}</p>
              </div>
              <span className="text-3xl">{metric.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart Representation */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <PieChart size={24} className="text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Revenue Sources (Projections)</h2>
          </div>

          <div className="space-y-4">
            {revenueSources.map((source, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{source.source}</span>
                  <span className="text-sm font-bold text-gray-900">{source.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${source.color} h-3 rounded-full transition-all`}
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">${(loading && !revenueData) ? "0.00" : source.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Day */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">📊 Weekly Spread (Projections)</h2>
          <div className="flex items-end justify-between gap-2 h-64">
            {revenueByDay.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-200 rounded-t-lg relative group">
                  <div
                    className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all hover:from-green-600 hover:to-green-500"
                    style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ${item.revenue.toFixed(2)}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2 font-medium">{item.day}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Revenue Table */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">📋 Revenue Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Source</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Percentage</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {revenueSources.map((source, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{source.source}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    ${(loading && !revenueData) ? "0.00" : source.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{source.percentage}%</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="text-blue-600 font-medium">Estimated</span>
                  </td>
                </tr>
              ))}
              <tr className="bg-blue-50 font-bold">
                <td className="px-6 py-4 text-sm text-gray-900">Total</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  ${loading && !revenueData ? "0.00" : totalRev.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">100%</td>
                <td className="px-6 py-4 text-sm text-green-600">Calculated</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Monetization Tips */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">💡 Revenue Optimization Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <p className="font-medium text-gray-900">📺 Increase Watch Time</p>
            <p className="text-sm text-gray-600 mt-2">Longer videos and playlists increase ad impressions and revenue</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-medium text-gray-900">🎯 Optimize Audience</p>
            <p className="text-sm text-gray-600 mt-2">Target high-value markets to increase CPM rates</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-medium text-gray-900">🔔 Enable Memberships</p>
            <p className="text-sm text-gray-600 mt-2">Channel memberships provide recurring revenue stream</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Revenue;
