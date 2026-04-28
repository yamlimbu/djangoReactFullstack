import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FileText, Download, RefreshCw, Plus, Calendar, Mail, AlertCircle } from "lucide-react";
import { youtubeApi } from "../api.js";

function Reports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [dashData, setDashData] = useState(null);
  const location = useLocation();

  const fetchDashData = async () => {
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
      const res = await youtubeApi.get(`/youtube/dashboard/?channel_id=${channelId}`);
      if (res.data.api_status === "success" || res.data.statistics) {
        setDashData(res.data);
      } else {
        setError(res.data.error || "Failed to load channel data for reports");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching channel data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashData();
  }, [location.search]);

  const handleRefresh = () => {
    fetchDashData();
  };

  const reports = [
    { id: 1, name: "Monthly Analytics Report", type: "PDF", created: "2024-01-15", size: "2.4 MB", status: "ready" },
    { id: 2, name: "Q4 Performance Summary", type: "Excel", created: "2024-01-10", size: "1.8 MB", status: "ready" },
    { id: 3, name: "Audience Demographics", type: "PDF", created: "2024-01-05", size: "3.1 MB", status: "ready" },
    { id: 4, name: "Revenue Analysis", type: "Excel", created: "2024-01-01", size: "1.2 MB", status: "ready" },
  ];

  const scheduledReports = [
    { id: 1, name: "Weekly Summary", frequency: "Every Monday", format: "PDF", email: "user@example.com", status: "active" },
    { id: 2, name: "Monthly Report", frequency: "1st of each month", format: "Excel", email: "user@example.com", status: "active" },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📄 Reports</h1>
          <p className="text-gray-600 mt-2">Generate and manage analytics reports</p>
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
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Generate Report
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <div>
            <p className="font-medium">Notice</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Generate Report Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Generate New Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Name</label>
              <input
                type="text"
                placeholder="e.g., January Analytics Report"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>Comprehensive Analytics</option>
                <option>Audience Report</option>
                <option>Revenue Report</option>
                <option>Content Performance</option>
                <option>Custom Report</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last 12 months</option>
                <option>Custom range</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>
                <option>PowerPoint</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Generate Report
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

      {/* Recent Reports */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Recent Reports (Simulation)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{report.name}</h3>
                    <p className="text-sm text-gray-600">{report.type} • {report.size}</p>
                  </div>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Ready</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">Created: {report.created}</p>
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <Download size={16} />
                  Download
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Calendar size={24} className="text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">📅 Scheduled Reports</h2>
        </div>
        <div className="space-y-4">
          {scheduledReports.map((report) => (
            <div key={report.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-gray-900">{report.name}</h3>
                  <p className="text-sm text-gray-600">{report.frequency}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  report.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-200 text-gray-700"
                }`}>
                  {report.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                <span>Format: <span className="font-medium">{report.format}</span></span>
                <span className="flex items-center gap-1">
                  <Mail size={14} />
                  {report.email}
                </span>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus size={16} />
          Schedule New Report
        </button>
      </div>

      {/* Report Templates */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">📑 Report Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "Comprehensive Analytics", description: "Full analytics overview with all metrics" },
            { name: "Audience Report", description: "Detailed audience demographics and insights" },
            { name: "Revenue Analysis", description: "Revenue sources and monetization metrics" },
            { name: "Content Performance", description: "Video performance and engagement metrics" },
          ].map((template, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
              <h3 className="font-medium text-gray-900">{template.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{template.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reports;
