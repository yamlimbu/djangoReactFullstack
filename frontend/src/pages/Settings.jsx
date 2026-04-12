import { useState, useEffect } from "react";
import { Settings, Save, Lock, Bell, Key, LogOut, Video, RefreshCw } from "lucide-react";
import api, { youtubeApi } from "../api";

function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    bio: ""
  });
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("");

  const [channels, setChannels] = useState([]);
  const [syncChannelId, setSyncChannelId] = useState("");
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchChannels();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/api/user/profile/');
      setFormData({
        username: res.data.username || "",
        email: res.data.email || "",
        fullName: res.data.fullName || "",
        bio: res.data.bio || ""
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChannels = async () => {
    try {
      const res = await youtubeApi.get('/youtube/channels/');
      setChannels(res.data.channels || []);
    } catch (err) {
      console.error("Error fetching channels:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setSaveStatus("saving");
    try {
      await api.put('/api/user/profile/', formData);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      setSaveStatus("error");
    }
  };

  const handleSyncChannel = async () => {
    if (!syncChannelId) return;
    setSyncing(true);
    try {
      await youtubeApi.post('/youtube/channels/', { channel_id: syncChannelId });
      setSyncChannelId("");
      fetchChannels();
      alert("Channel synced successfully!");
    } catch (err) {
      console.error("Sync error:", err);
      alert("Failed to sync channel. Please check the ID and try again.");
    } finally {
      setSyncing(false);
    }
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
          { id: "channels", label: "YouTube Channels", icon: "📺" },
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
              {formData.fullName ? formData.fullName.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'U'}
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
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
              ></textarea>
            </div>

            <div className="flex gap-4 items-center">
              <button 
                onClick={handleSaveProfile}
                disabled={saveStatus === "saving"}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                {saveStatus === "saving" ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                {saveStatus === "saving" ? "Saving..." : "Save Changes"}
              </button>
              {saveStatus === "success" && <span className="text-sm text-green-600 font-medium">Profile updated successfully!</span>}
              {saveStatus === "error" && <span className="text-sm text-red-600 font-medium">Failed to save profile.</span>}
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

      {/* YouTube Channels Tab */}
      {activeTab === "channels" && (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Linked YouTube Channels</h2>
          
          <div className="space-y-4 mb-8">
            {channels.length === 0 ? (
              <p className="text-gray-500">No YouTube channels linked yet.</p>
            ) : (
              channels.map(channel => (
                <div key={channel.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {channel.thumbnail && <img src={channel.thumbnail} alt="Thumbnail" className="w-12 h-12 rounded-full" />}
                    <div>
                      <p className="font-medium text-gray-900">{channel.title}</p>
                      <p className="text-sm text-gray-600">ID: {channel.id}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">Linked</span>
                </div>
              ))
            )}
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-4">Sync New Channel</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Paste YouTube Channel ID (e.g. UC_x5XG...)"
              value={syncChannelId}
              onChange={(e) => setSyncChannelId(e.target.value)}
              className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              onClick={handleSyncChannel}
              disabled={syncing || !syncChannelId}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:bg-red-400"
            >
              {syncing ? <RefreshCw className="animate-spin" size={16} /> : <Video size={16} />}
              {syncing ? "Syncing..." : "Sync"}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">Connecting a channel may take a few moments as we download all relevant analytics.</p>
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
