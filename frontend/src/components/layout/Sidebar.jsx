import { NavLink } from "react-router-dom";

function Sidebar() {
  const baseClass = "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200";

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-blue-600 to-indigo-700 text-white flex flex-col shadow-2xl">
      {/* Logo */}
      <div className="p-6">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <div className="bg-white/20 p-2 rounded-lg">⚡</div>
          ADMIN
        </h2>
        <p className="text-white/60 text-sm mt-2">Dashboard v2.0</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 flex flex-col gap-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${baseClass} ${isActive 
              ? 'bg-white/20 shadow-lg font-semibold backdrop-blur-sm' 
              : 'hover:bg-white/10 hover:shadow-md'
            }`
          }
        >
          <div className="p-2 bg-white/20 rounded-lg">
            📊
          </div>
          Dashboard
        </NavLink>

        <NavLink
          to="/notes"
          className={({ isActive }) =>
            `${baseClass} ${isActive 
              ? 'bg-white/20 shadow-lg font-semibold backdrop-blur-sm' 
              : 'hover:bg-white/10 hover:shadow-md'
            }`
          }
        >
          <div className="p-2 bg-white/20 rounded-lg">
            📝
          </div>
          Notes
          <span className="ml-auto bg-white/20 text-xs px-2 py-1 rounded-full">
            12
          </span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `${baseClass} ${isActive 
              ? 'bg-white/20 shadow-lg font-semibold backdrop-blur-sm' 
              : 'hover:bg-white/10 hover:shadow-md'
            }`
          }
        >
          <div className="p-2 bg-white/20 rounded-lg">
            ⚙️
          </div>
          Settings
        </NavLink>
      </nav>

      {/* User Info */}
      <div className="p-6 border-t border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="font-semibold">Y</span>
          </div>
          <div>
            <p className="font-medium">Yam</p>
            <p className="text-sm text-white/60">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;