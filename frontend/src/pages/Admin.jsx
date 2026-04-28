import { useState } from "react";
import { Shield, Users, Activity, Settings, Trash2, Edit2, Download } from "lucide-react";

function Admin() {
  const [activeTab, setActiveTab] = useState("users");

  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "active", joined: "2024-01-01" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "active", joined: "2024-01-05" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "User", status: "inactive", joined: "2024-01-10" },
    { id: 4, name: "Sarah Williams", email: "sarah@example.com", role: "Moderator", status: "active", joined: "2024-01-12" },
  ];

  const systemMetrics = [
    { label: "Total Users", value: "1,245", icon: "👥", trend: "+12%" },
    { label: "API Calls", value: "45.2K", icon: "📡", trend: "+8%" },
    { label: "System Uptime", value: "99.9%", icon: "✅", trend: "Stable" },
    { label: "Avg Response Time", value: "245ms", icon: "⚡", trend: "-5%" },
  ];

  const apiUsage = [
    { endpoint: "/youtube/analytics", calls: 12450, limit: 50000, percentage: 24 },
    { endpoint: "/youtube/videos", calls: 8920, limit: 50000, percentage: 17 },
    { endpoint: "/youtube/search", calls: 6780, limit: 50000, percentage: 13 },
    { endpoint: "/youtube/channels", calls: 4560, limit: 50000, percentage: 9 },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">🛡️ Administration</h1>
        <p className="text-gray-600 mt-2">System management and monitoring</p>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {systemMetrics.map((metric, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">{metric.label}</p>
                <h3 className="text-2xl font-bold mt-2 text-gray-900">{metric.value}</h3>
                <p className="text-green-600 text-sm mt-2 font-medium">{metric.trend}</p>
              </div>
              <span className="text-3xl">{metric.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-200">
        {[
          { id: "users", label: "User Management", icon: "👥" },
          { id: "api", label: "API Usage", icon: "📡" },
          { id: "system", label: "System Health", icon: "✅" },
          { id: "logs", label: "Audit Logs", icon: "📋" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-medium transition-all border-b-2 ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* User Management Tab */}
      {activeTab === "users" && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">User Management</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Add User
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Joined</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.joined}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <Edit2 size={16} className="text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-red-100 rounded transition-colors">
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* API Usage Tab */}
      {activeTab === "api" && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">API Usage Statistics</h2>

          <div className="space-y-6">
            {apiUsage.map((api, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium text-gray-900">{api.endpoint}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {api.calls.toLocaleString()} / {api.limit.toLocaleString()} calls
                    </p>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{api.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      api.percentage > 80
                        ? "bg-red-500"
                        : api.percentage > 50
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${api.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <span className="font-medium">Total API Calls Today:</span> 32,710 / 500,000
            </p>
          </div>
        </div>
      )}

      {/* System Health Tab */}
      {activeTab === "system" && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">System Health</h2>

          <div className="space-y-4">
            {[
              { service: "API Server", status: "healthy", uptime: "99.9%", responseTime: "245ms" },
              { service: "Database", status: "healthy", uptime: "99.95%", responseTime: "12ms" },
              { service: "Cache Server", status: "healthy", uptime: "99.8%", responseTime: "5ms" },
              { service: "YouTube API", status: "healthy", uptime: "99.5%", responseTime: "450ms" },
            ].map((service, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium text-gray-900">{service.service}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <span>Uptime: <span className="font-medium">{service.uptime}</span></span>
                      <span>Response: <span className="font-medium">{service.responseTime}</span></span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === "logs" && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Audit Logs</h2>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition-colors">
              <Download size={16} />
              Export
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Timestamp</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">User</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Resource</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  { time: "2024-01-15 14:30", user: "John Doe", action: "Login", resource: "User Account", status: "success" },
                  { time: "2024-01-15 14:25", user: "Jane Smith", action: "Update", resource: "Settings", status: "success" },
                  { time: "2024-01-15 14:20", user: "Mike Johnson", action: "Delete", resource: "Report", status: "success" },
                  { time: "2024-01-15 14:15", user: "Sarah Williams", action: "Create", resource: "Alert", status: "success" },
                ].map((log, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">{log.time}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.user}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{log.action}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{log.resource}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
