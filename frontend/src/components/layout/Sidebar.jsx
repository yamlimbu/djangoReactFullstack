import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Video,
  Users,
  DollarSign,
  Globe,
  TrendingUp,
  Settings,
  Home,
  MessageSquare,
  Bell,
  FileText,
  Zap,
  Shield,
  StickyNote,
  List,
  PieChart
} from "lucide-react";

function Sidebar() {
  const baseClass = "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200";

  const menuItems = [
    // Core Analytics
    { path: "/", icon: <Home size={20} />, label: "Dashboard", badge: null },
    { path: "/analytics", icon: <BarChart3 size={20} />, label: "Analytics", badge: "Live" },
    
    // Content Management
    { path: "/videos", icon: <Video size={20} />, label: "Videos", badge: null },
    { path: "/playlists", icon: <List size={20} />, label: "Playlists", badge: null },
    
    // Audience Insights
    { path: "/audience", icon: <Users size={20} />, label: "Audience", badge: null },
    { path: "/geographic", icon: <Globe size={20} />, label: "Geographic", badge: null },
    { path: "/demographics", icon: <PieChart size={20} />, label: "Demographics", badge: null },
    
    // Performance
    { path: "/revenue", icon: <DollarSign size={20} />, label: "Revenue", badge: null },
    { path: "/trends", icon: <TrendingUp size={20} />, label: "Trends", badge: "New" },
    { path: "/predictions", icon: <Zap size={20} />, label: "Predictions", badge: null },
    
    // Engagement
    { path: "/comments", icon: <MessageSquare size={20} />, label: "Comments", badge: null },
    { path: "/alerts", icon: <Bell size={20} />, label: "Alerts", badge: null },
    
    // Reports & Export
    { path: "/reports", icon: <FileText size={20} />, label: "Reports", badge: null },
    
    // Settings & Admin
    { path: "/settings", icon: <Settings size={20} />, label: "Settings", badge: null },
    { path: "/admin", icon: <Shield size={20} />, label: "Administration", badge: null },
    { path: "/notes", icon: <StickyNote size={20} />, label: "Notes", badge: null },
  ];

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-2xl overflow-y-auto">
      {/* Logo */}
      <div className="p-6 sticky top-0 bg-gradient-to-b from-gray-900 to-gray-800 z-10">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
            📊
          </div>
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            YT Analytics
          </span>
        </h2>
        <p className="text-gray-400 text-sm mt-2">Big Data Project</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 flex flex-col gap-1 py-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `${baseClass} ${isActive 
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-l-4 border-blue-400 font-semibold' 
                : 'hover:bg-white/5'
              }`
            }
          >
            <div className="text-gray-300">{item.icon}</div>
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                typeof item.badge === 'number' 
                  ? 'bg-blue-500/20 text-blue-300'
                  : item.badge.startsWith('$')
                  ? 'bg-green-500/20 text-green-300'
                  : 'bg-purple-500/20 text-purple-300'
              }`}>
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Channel Stats */}
      <div className="p-6 border-t border-gray-700 sticky bottom-0 bg-gradient-to-t from-gray-800 to-gray-800/0">
        {/* <div className="mb-4">
          <h3 className="text-sm text-gray-400 mb-2">Channel Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Subscribers</span>
              <span className="font-semibold text-green-400">+2,340</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Views Today</span>
              <span className="font-semibold text-blue-400">45.2K</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Revenue</span>
              <span className="font-semibold text-amber-400">$4,280</span>
            </div>
          </div>
        </div> */}
        
        {/* User Info */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-700">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="font-bold text-sm">YT</span>
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">YouTube Analytics</p>
            <p className="text-xs text-gray-400 truncate">Big Data Project</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
