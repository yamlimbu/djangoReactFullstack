import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/layout/Layout";

// Import new pages
import Analytics from "./pages/Analytics";
import Videos from "./pages/Videos";
import Audience from "./pages/Audience";
import Revenue from "./pages/Revenue";
import Geographic from "./pages/Geographic";
import Trends from "./pages/Trends";
import Comments from "./pages/Comments";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" replace />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing */}
        <Route path="/" element={<Landing />} />
        
        {/* Protected Area */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} /> 
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/audience" element={<Audience />} />
          <Route path="/revenue" element={<Revenue />} />
          <Route path="/geographic" element={<Geographic />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/comments" element={<Comments />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/notes" element={<Home />} />
        </Route>

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
