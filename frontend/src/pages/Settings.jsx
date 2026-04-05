import { useState } from "react";
import { Settings, Save, Lock, Bell, Key, LogOut } from "lucide-react";

function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    username: "youtube_user",
    email: "user@example.com",
    fullName: "John Doe",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">⚙️ Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-200">
        {[
          { id: "profile", label: "Profile", icon: "👤" },
          { id: "security", label: "Security", icon: "🔒" },
          { id: "notifications", label: "Notifications", icon: "🔔" },
          { id: "api", label: "API Keys", icon: "🔑" },
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

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
          
          {/* Avatar */}
          <div className="mb-8 flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              JD
            </div>
            <div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Change Avatar
              </button>
              <p className="text-sm text-gray-600 mt-2">JPG, PNG or GIF (Max 5MB)</p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                placeholder="Tell us about yourself..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
              ></textarea>
            </div>

            <div className="flex gap-2">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Save size={16} />
                Save Changes
              </button>
              <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>
          
          <div className="space-y-6">
            {/* Change Password */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-gray-900">Change Password</h3>
                  <p className="text-sm text-gray-600 mt-1">Update your password regularly for security</p>
                </div>
                <Lock className="text-gray-400" size={20} />
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Change Password
              </button>
            </div>

            {/* Two-Factor Authentication */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600 mt-1">Add an extra layer of security to your account</p>
                </div>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Disabled</span>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Enable 2FA
              </button>
            </div>

            {/* Active Sessions */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-4">Active Sessions</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">Chrome on Windows</p>
                    <p className="text-sm text-gray-600">Last active: 2 hours ago</p>
                  </div>
                  <button className="text-red-600 hover:text-red-800">Logout</button>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">Safari on iPhone</p>
                    <p className="text-sm text-gray-600">Last active: 1 day ago</p>
                  </div>
                  <button className="text-red-600 hover:text-red-800">Logout</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
          
          <div className="space-y-4">
            {[
              { title: "Email Notifications", description: "Receive important updates via email" },
              { title: "Performance Alerts", description: "Get notified about significant changes" },
              { title: "Weekly Summary", description: "Receive weekly analytics summary" },
              { title: "New Features", description: "Be notified about new features" },
              { title: "Marketing Emails", description: "Receive promotional content" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <input type="checkbox" defaultChecked={idx < 3} className="w-5 h-5" />
              </div>
            ))}
          </div>

          <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Save size={16} />
            Save Preferences
          </button>
        </div>
      )}

      {/* API Keys Tab */}
      {activeTab === "api" && (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl">
          <h2 className="text-xl font-bold text-gray-900 mb-6">API Keys</h2>
          
          <div className="space-y-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-900">Production API Key</p>
                  <p className="text-sm text-gray-600 mt-1">Created: 2024-01-01</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
              </div>
              <div className="flex gap-2 mt-3">
                <input
                  type="password"
                  value="sk_live_••••••••••••••••"
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm"
                />
                <button className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors">
                  Copy
                </button>
              </div>
            </div>
          </div>

          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Key size={16} />
            Generate New Key
          </button>
        </div>
      )}

      {/* Danger Zone */}
      <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl">
        <h2 className="text-xl font-bold text-red-900 mb-4">⚠️ Danger Zone</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-white rounded border border-red-200">
            <div>
              <p className="font-medium text-gray-900">Logout from all devices</p>
              <p className="text-sm text-gray-600">Sign out from all active sessions</p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
              <LogOut size={16} />
              Logout All
            </button>
          </div>
          <div className="flex justify-between items-center p-4 bg-white rounded border border-red-200">
            <div>
              <p className="font-medium text-gray-900">Delete Account</p>
              <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
