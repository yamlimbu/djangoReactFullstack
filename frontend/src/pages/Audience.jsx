import { useState } from "react";
import { Users, TrendingUp, Download, RefreshCw, Globe, BarChart3 } from "lucide-react";

function Audience() {
  const [timeRange, setTimeRange] = useState("last30days");
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const topCountries = [
    { country: "United States", viewers: 45000, percentage: 35 },
    { country: "India", viewers: 28000, percentage: 22 },
    { country: "United Kingdom", viewers: 15000, percentage: 12 },
    { country: "Germany", viewers: 10000, percentage: 8 },
    { country: "Canada", viewers: 9000, percentage: 7 },
    { country: "Others", viewers: 13000, percentage: 16 },
  ];

  const ageGroups = [
    { range: "13-17", percentage: 8 },
    { range: "18-24", percentage: 25 },
    { range: "25-34", percentage: 42 },
    { range: "35-44", percentage: 18 },
    { range: "45-54", percentage: 5 },
    { range: "55+", percentage: 2 },
  ];

  const devices = [
    { device: "Mobile", percentage: 58, color: "bg-blue-500" },
    { device: "Desktop", percentage: 32, color: "bg-purple-500" },
    { device: "Tablet", percentage: 8, color: "bg-green-500" },
    { device: "TV", percentage: 2, color: "bg-amber-500" },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">👥 Audience</h1>
          <p className="text-gray-600 mt-2">Audience insights and demographics</p>
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Audience</p>
              <h3 className="text-3xl font-bold mt-2 text-gray-900">154K</h3>
              <p className="text-blue-600 text-sm mt-2">+2.3K this month</p>
            </div>
            <Users className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-600 text-sm font-medium">New Subscribers</p>
              <h3 className="text-3xl font-bold mt-2 text-gray-900">+2.3K</h3>
              <p className="text-green-600 text-sm mt-2">+18.5% growth</p>
            </div>
            <TrendingUp className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-600 text-sm font-medium">Engagement Rate</p>
              <h3 className="text-3xl font-bold mt-2 text-gray-900">8.7%</h3>
              <p className="text-purple-600 text-sm mt-2">+2.3% increase</p>
            </div>
            <BarChart3 className="text-purple-600" size={32} />
          </div>
        </div>
      </div>

      {/* Demographics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Age Groups */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">📊 Age Distribution</h2>
          <div className="space-y-4">
            {ageGroups.map((group, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{group.range} years</span>
                  <span className="text-sm font-bold text-gray-900">{group.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${group.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Distribution */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">📱 Device Distribution</h2>
          <div className="space-y-4">
            {devices.map((device, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{device.device}</span>
                  <span className="text-sm font-bold text-gray-900">{device.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${device.color} h-3 rounded-full transition-all`}
                    style={{ width: `${device.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Globe size={24} className="text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">🌍 Top Countries</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Country</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Viewers</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Percentage</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Distribution</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {topCountries.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.country}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.viewers.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{item.percentage}%</td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gender Distribution */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">👫 Gender Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto mb-4">
                <div className="text-center">
                  <p className="text-4xl font-bold text-white">68%</p>
                  <p className="text-blue-100 text-sm">Male</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center mx-auto mb-4">
                <div className="text-center">
                  <p className="text-4xl font-bold text-white">32%</p>
                  <p className="text-pink-100 text-sm">Female</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">💡 Audience Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <p className="font-medium text-gray-900">🌍 Primary Market</p>
            <p className="text-sm text-gray-600 mt-2">United States leads with 35% of your audience</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-medium text-gray-900">📱 Mobile First</p>
            <p className="text-sm text-gray-600 mt-2">58% of viewers access content via mobile devices</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-medium text-gray-900">👥 Core Demographic</p>
            <p className="text-sm text-gray-600 mt-2">25-34 age group represents 42% of audience</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Audience;
