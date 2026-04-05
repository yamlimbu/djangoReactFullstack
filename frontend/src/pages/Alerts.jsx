import { useState } from "react";
import { Bell, Download, RefreshCw, Plus, Trash2, Edit2, AlertCircle } from "lucide-react";

function Alerts() {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [alerts, setAlerts] = useState([
    { id: 1, name: "Low Views Alert", metric: "Views", threshold: 1000, condition: "below", status: "active", lastTriggered: "2024-01-15" },
    { id: 2, name: "High Engagement", metric: "Engagement Rate", threshold: 10, condition: "above", status: "active", lastTriggered: "2024-01-14" },
    { id: 3, name: "Revenue Drop", metric: "Revenue", threshold: 100, condition: "below", status: "inactive", lastTriggered: "2024-01-10" },
  ]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const toggleAlert = (id) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, status: alert.status === "active" ? "inactive" : "active" } : alert
    ));
  };

  const deleteAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🔔 Alerts</h1>
          <p className="text-gray-600 mt-2">Configure and manage performance alerts</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            New Alert
          </button>
        </div>
      </div>

      {/* Create Alert Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Alert</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alert Name</label>
              <input
                type="text"
                placeholder="e.g., Low Views Alert"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Metric</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>Views</option>
                <option>Subscribers</option>
                <option>Engagement Rate</option>
                <option>Revenue</option>
                <option>Watch Time</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>above</option>
                <option>below</option>
                <option>equals</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Threshold Value</label>
              <input
                type="number"
                placeholder="e.g., 1000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Create Alert
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Active Alerts */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Your Alerts</h2>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className={`rounded-lg shadow p-6 ${alert.status === "active" ? "bg-white border-l-4 border-blue-500" : "bg-gray-50 border-l-4 border-gray-300"}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{alert.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      alert.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-700"
                    }`}>
                      {alert.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Trigger when <span className="font-medium">{alert.metric}</span> is <span className="font-medium">{alert.condition}</span> <span className="font-medium">{alert.threshold}</span>
                  </p>
                  <p className="text-gray-500 text-xs mt-2">Last triggered: {alert.lastTriggered}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert History */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">📜 Alert History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Alert</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Triggered</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Value</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Low Views Alert</td>
                <td className="px-6 py-4 text-sm text-gray-600">2024-01-15 14:30</td>
                <td className="px-6 py-4 text-sm text-gray-600">850 views</td>
                <td className="px-6 py-4 text-sm"><span className="bg-red-100 text-red-800 px-2 py-1 rounded">Triggered</span></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">High Engagement</td>
                <td className="px-6 py-4 text-sm text-gray-600">2024-01-14 09:15</td>
                <td className="px-6 py-4 text-sm text-gray-600">12.5% engagement</td>
                <td className="px-6 py-4 text-sm"><span className="bg-green-100 text-green-800 px-2 py-1 rounded">Triggered</span></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Revenue Drop</td>
                <td className="px-6 py-4 text-sm text-gray-600">2024-01-10 16:45</td>
                <td className="px-6 py-4 text-sm text-gray-600">$85 revenue</td>
                <td className="px-6 py-4 text-sm"><span className="bg-red-100 text-red-800 px-2 py-1 rounded">Triggered</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">🔔 Notification Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive alerts via email</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">In-App Notifications</p>
              <p className="text-sm text-gray-600">Show alerts in the dashboard</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">SMS Notifications</p>
              <p className="text-sm text-gray-600">Receive critical alerts via SMS</p>
            </div>
            <input type="checkbox" className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Alerts;
