import { useState } from "react";
import { Globe, Download, RefreshCw, TrendingUp } from "lucide-react";

function Geographic() {
  const [timeRange, setTimeRange] = useState("last30days");
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const countries = [
    { name: "United States", views: 450000, percentage: 35, growth: "+12.5%" },
    { name: "India", views: 280000, percentage: 22, growth: "+18.3%" },
    { name: "United Kingdom", views: 150000, percentage: 12, growth: "+8.2%" },
    { name: "Germany", views: 100000, percentage: 8, growth: "+5.1%" },
    { name: "Canada", views: 90000, percentage: 7, growth: "+3.2%" },
    { name: "Australia", views: 65000, percentage: 5, growth: "+9.8%" },
    { name: "France", views: 45000, percentage: 3, growth: "+2.1%" },
    { name: "Others", views: 220000, percentage: 8, growth: "+6.5%" },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🌍 Geographic</h1>
          <p className="text-gray-600 mt-2">Geographic audience distribution and regional analytics</p>
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

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">📊 Top Countries</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Country</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Views</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Percentage</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Growth</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Distribution</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {countries.map((country, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{country.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{(country.views / 1000).toFixed(0)}K</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{country.percentage}%</td>
                  <td className="px-6 py-4 text-sm text-green-600 font-medium">{country.growth}</td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                        style={{ width: `${country.percentage}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">💡 Geographic Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <p className="font-medium text-gray-900">🌐 Primary Market</p>
            <p className="text-sm text-gray-600 mt-2">United States is your largest market at 35% of views</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-medium text-gray-900">📈 Fastest Growing</p>
            <p className="text-sm text-gray-600 mt-2">India showing strongest growth at +18.3%</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-medium text-gray-900">🎯 Expansion Opportunity</p>
            <p className="text-sm text-gray-600 mt-2">Consider targeting emerging markets for growth</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Geographic;
