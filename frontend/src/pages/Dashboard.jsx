import { useState, useEffect } from "react";
import api from "../api.js";
import { Link } from "react-router-dom";

function Dashboard() {
  const [stats, setStats] = useState({
    total: 3,
    active: 3,
    archived: 0
  });
  const [recentNotes, setRecentNotes] = useState([
    { id: 1, title: "Test", content: "Thee", status: "Active" },
    { id: 2, title: "Title", content: "Contentet", status: "Active" },
    { id: 3, title: "New Note Jan 18", content: "This is test", status: "Active" }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch real data from API
    fetchDashboardData();
  }, []);

  const fetchDashboardData = () => {
    setLoading(true);
    api.get("/api/notes/")
      .then(res => {
        const notes = res.data || recentNotes;
        const active = notes.filter(note => !note.status || note.status === 'Active').length;
        
        setStats({
          total: notes.length,
          active: active,
          archived: notes.length - active
        });
        
        setRecentNotes(notes.slice(0, 5));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">📊 ADMIN DASHBOARD</h1>
        <p className="text-gray-600 mt-2">Welcome back, Yam! Here's your overview</p>
      </div>

      {/* Stats Cards - Compact Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-5 border-t-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Notes</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                {loading ? "..." : stats.total}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-xl">📝</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-5 border-t-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Notes</p>
              <h3 className="text-2xl md:text-3xl font-bold text-green-600 mt-1">
                {loading ? "..." : stats.active}
              </h3>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-xl">✅</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-5 border-t-4 border-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Archived Notes</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-700 mt-1">
                {loading ? "..." : stats.archived}
              </h3>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xl">📁</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Notes & Quick Actions in Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Recent Notes - Takes 2/3 on large screens */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
            <div className="p-5 md:p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">📋 Recent Notes</h2>
              <Link
                to="/notes"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
              >
                View All →
              </Link>
            </div>
            
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : recentNotes.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No notes yet. Create your first note!
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentNotes.map((note) => (
                  <div key={note.id} className="p-4 md:p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{note.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 truncate">{note.content}</p>
                      </div>
                      <span className={`ml-3 px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                        !note.status || note.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {note.status || 'Active'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions - Takes 1/3 on large screens */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-5 md:p-6 h-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🚀 Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/notes"
                className="block w-full px-4 py-3 bg-white text-gray-800 font-medium rounded-lg hover:shadow-md transition-all flex items-center justify-between"
              >
                <span>📝 View All Notes</span>
                <span className="text-gray-400">→</span>
              </Link>
              <Link
                to="/notes"
                className="block w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-between"
              >
                <span>➕ Create New Note</span>
                <span className="text-white/70">→</span>
              </Link>
            </div>
            
            {/* Stats Summary */}
            <div className="mt-6 pt-6 border-t border-blue-200">
              <h3 className="font-medium text-gray-700 mb-2">📊 Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Notes:</span>
                  <span className="font-medium">{stats.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active:</span>
                  <span className="font-medium text-green-600">{stats.active}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Archived:</span>
                  <span className="font-medium text-gray-600">{stats.archived}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;