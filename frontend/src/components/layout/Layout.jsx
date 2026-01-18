import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState } from "react";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar for Desktop - NO GAP */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen z-40">
        <Sidebar />
      </div>
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Mobile Sidebar */}
      <div className={`fixed left-0 top-0 h-screen z-40 transform transition-transform duration-300 lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar />
      </div>

      {/* Main Content - Adjusted for fixed sidebar */}
      <div className="flex-1 flex flex-col lg:ml-64 w-full">
        <Header sidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 px-6 py-4 text-center text-sm text-gray-600">
          <p>© 2024 Notes Admin Dashboard. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default Layout;