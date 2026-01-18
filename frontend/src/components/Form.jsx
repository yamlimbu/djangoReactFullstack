import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post(route, { username, password });
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                
                // Store username if remember me is checked
                if (rememberMe) {
                    localStorage.setItem("rememberedUser", username);
                }
                
                navigate("/");
            } else {
                navigate("/login");
            }
        } catch (error) {
            alert(error.response?.data?.detail || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
                    {/* Logo/Brand */}
                    <div className="text-center mb-8">
                        <div className="inline-block p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
                            <span className="text-3xl text-white">
                                {method === "login" ? "🔐" : "👋"}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {method === "login" ? "Welcome Back" : "Create Account"}
                        </h1>
                        <p className="text-gray-600 mt-2">
                            {method === "login" 
                                ? "Sign in to your admin dashboard" 
                                : "Join us and start managing your notes"}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {method === "login" && (
                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input 
                                        type="checkbox" 
                                        className="rounded text-blue-600 focus:ring-blue-500"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                                </label>
                                <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                                    Forgot password?
                                </a>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                                    {method === "login" ? "Signing in..." : "Creating account..."}
                                </span>
                            ) : (
                                name
                            )}
                        </button>
                    </form>

                    {/* Divider & Links */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-center text-sm text-gray-600">
                            {method === "login" ? (
                                <>
                                    Don't have an account?{" "}
                                    <a href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                                        Sign up
                                    </a>
                                </>
                            ) : (
                                <>
                                    Already have an account?{" "}
                                    <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                                        Sign in
                                    </a>
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Form;