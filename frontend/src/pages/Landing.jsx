import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ACCESS_TOKEN } from '../constants';
import {
  TrendingUp,
  BarChart3,
  Video,
  Users,
  Zap,
  ShieldCheck,
  Download,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Play,
  Clock,
  DollarSign,
  ChevronDown,
  Globe,
  Bell,
  Cpu,
  Menu,
  X,
  Star,
  ExternalLink,
  Eye,
  ArrowUp
} from 'lucide-react';

function Landing() {
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if logged in
  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      navigate('/dashboard' + location.search);
    }
  }, [navigate, location]);

  // Interactive Demo Tab State
  const [activeTab, setActiveTab] = useState('overview');
  // Mobile Navigation Drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Pricing toggle (monthly vs yearly)
  const [billingCycle, setBillingCycle] = useState('yearly');
  // Calculator state
  const [calculatorSubs, setCalculatorSubs] = useState(75000);
  // FAQ accordion open states
  const [openFaq, setOpenFaq] = useState(0);
  // Scroll state for sticky header and top button
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor scroll for header styling and Go To Top button
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Dynamic calculations based on subs slider
  const estimatedViews = Math.round(calculatorSubs * 4.2).toLocaleString();
  const estimatedRevenueGain = Math.round((calculatorSubs * 4.2 * 3.8) / 1000 * 0.35).toLocaleString();
  const estimatedHoursSaved = Math.round(calculatorSubs / 5000 + 14);

  const faqs = [
    {
      q: "Does this require full access to my YouTube channel credentials?",
      a: "No! We only use Google's official read-only OAuth scopes and public YouTube Data API v3 keys. We will never ask for your password or require permissions to edit or delete your videos."
    },
    {
      q: "How frequently is the analytics data synchronized?",
      a: "Our background Celery workers and Redis caching layer synchronize key video metrics hourly, while deep historical metrics and AI predictions refresh every 24 hours at 2:00 AM UTC."
    },
    {
      q: "Can I export professional reports for brand sponsors and agencies?",
      a: "Yes! You can instantly generate and schedule white-labeled PDF, Excel (.xlsx), and CSV performance reports that showcase engagement rate, retention curves, and demographic reach."
    },
    {
      q: "How does the AI growth engine predict viral potential?",
      a: "We benchmark your video's early velocity (first 2 to 24 hours of views, comments sentiment, and watch time ratio) against millions of anonymized video trajectories in your exact content category."
    },
    {
      q: "Can I cancel or switch my plan at any time?",
      a: "Absolutely. There are no contracts or commitments. You can upgrade, downgrade, or cancel directly from your profile settings in a single click."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-red-500 selection:text-white font-sans antialiased overflow-x-clip relative">
      {/* Background Ambient Glow Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-red-200/40 via-purple-200/35 to-indigo-100/40 blur-[120px] rounded-full" />
        <div className="absolute top-[40%] right-[-5%] w-[500px] h-[500px] bg-red-100/50 blur-[130px] rounded-full" />
        <div className="absolute bottom-[5%] left-[-5%] w-[600px] h-[600px] bg-indigo-100/50 blur-[140px] rounded-full" />
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{ 
            backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
            backgroundSize: '28px 28px'
          }} 
        />
      </div>

      {/* Top Notification Banner */}
      <div className="relative z-40 bg-gradient-to-r from-red-50 via-rose-50 to-indigo-50 border-b border-red-100/80 px-4 py-2 text-center text-xs sm:text-sm text-slate-700">
        <span className="inline-flex items-center gap-2 font-medium">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <strong className="text-slate-900 font-semibold">YouTube Data API v3 & Analytics 2026 Engine Active</strong>
          <span className="hidden md:inline text-slate-500">— Real-time tracking, Celery beat schedules & automated exports live</span>
        </span>
      </div>

      {/* STICKY HEADER SECTION */}
      <header className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm'
          : 'bg-white/85 backdrop-blur-md border-b border-slate-200/70 shadow-xs'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-11 h-11 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25 group-hover:shadow-red-500/40 group-hover:scale-105 transition-all duration-300">
                <Play className="w-5 h-5 text-white fill-white translate-x-0.5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900">
                    CreatorPulse
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 border border-red-200 rounded-md">
                    AI
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium tracking-wide">YouTube Analytics & Reporting</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-slate-600">
              <a href="#features" className="hover:text-red-600 transition-colors duration-200">Features</a>
              <a href="#preview" className="hover:text-red-600 transition-colors duration-200">Interactive Demo</a>
              <a href="#calculator" className="hover:text-red-600 transition-colors duration-200">Growth Calculator</a>
              <a href="#pricing" className="hover:text-red-600 transition-colors duration-200">Pricing</a>
              <a href="#faq" className="hover:text-red-600 transition-colors duration-200">FAQ</a>
            </nav>

            {/* Desktop Auth CTAs */}
            <div className="hidden lg:flex items-center space-x-3">
              <Link
                to="/login"
                className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl transition-all duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="relative group px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-rose-500 to-indigo-600 transition-all duration-300 group-hover:scale-105" />
                <span className="relative flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-200 bg-white/95 backdrop-blur-2xl px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col space-y-3 text-base font-semibold text-slate-700">
              <a 
                href="#features" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg hover:text-red-600 transition-colors"
              >
                Features
              </a>
              <a 
                href="#preview" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg hover:text-red-600 transition-colors"
              >
                Interactive Demo
              </a>
              <a 
                href="#calculator" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg hover:text-red-600 transition-colors"
              >
                Growth Calculator
              </a>
              <a 
                href="#pricing" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg hover:text-red-600 transition-colors"
              >
                Pricing
              </a>
              <a 
                href="#faq" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg hover:text-red-600 transition-colors"
              >
                FAQ
              </a>
            </nav>
            <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
              <Link
                to="/login"
                className="w-full text-center py-3 text-sm font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="w-full text-center py-3 text-sm font-bold text-white bg-gradient-to-r from-red-600 via-rose-600 to-indigo-600 rounded-xl shadow-lg shadow-red-500/25"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-14 sm:pt-20 pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs sm:text-sm font-semibold text-slate-700">
                Machine Learning Predictions + Automated Celery Reports
              </span>
              <span className="text-red-600 font-bold ml-1 text-xs">v2.4 &rarr;</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.1] mb-6">
              Turn YouTube Data into{' '}
              <span className="bg-gradient-to-r from-red-600 via-rose-600 to-indigo-600 bg-clip-text text-transparent">
                Predictable Revenue
              </span>{' '}
              & Viral Velocity
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal mb-10 max-w-3xl mx-auto">
              Harness official YouTube Analytics & Reporting APIs with real-time tracking, 
              AI viral forecasts, and automated PDF & Excel reporting that save creators 20+ hours a week.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 via-rose-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-white font-bold text-base rounded-2xl shadow-xl shadow-red-500/25 hover:shadow-red-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3"
              >
                <Zap className="w-5 h-5 fill-white" />
                <span>Start Free Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#preview"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-slate-800 font-bold text-base rounded-2xl border border-slate-200 shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2.5"
              >
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <span>Explore Live Demo</span>
              </a>
            </div>

            {/* Trust Points */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-600 font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Official Google OAuth Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Automated CSV, Excel & PDF</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>No Credit Card Required</span>
              </div>
            </div>
          </div>

          {/* Interactive SaaS Product Mockup Preview */}
          <div id="preview" className="mt-14 sm:mt-20 scroll-mt-28">
            <div className="relative mx-auto max-w-6xl rounded-3xl p-2 sm:p-3 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200 shadow-2xl border border-slate-200/90">
              {/* Window Header */}
              <div className="bg-slate-900 rounded-t-2xl px-4 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/90" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/90" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/90" />
                  <span className="ml-3 text-xs font-mono text-slate-400 hidden sm:inline">
                    creatorpulse.app/dashboard &bull; YouTube API v3 (Live Synchronized)
                  </span>
                </div>

                {/* Simulated Interactive Tab Switcher */}
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      activeTab === 'overview'
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('ai')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      activeTab === 'ai'
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    AI Predictions
                  </button>
                  <button
                    onClick={() => setActiveTab('reporting')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      activeTab === 'reporting'
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Celery Reports
                  </button>
                </div>
              </div>

              {/* Window Content Body */}
              <div className="bg-slate-50 rounded-b-2xl p-4 sm:p-8 border-t border-slate-200">
                {activeTab === 'overview' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    {/* Top KPI Cards Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                          <span className="text-xs sm:text-sm font-semibold">Total Views (30d)</span>
                          <Eye className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-slate-900">4,821,940</div>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 mt-2 font-bold">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>+24.8% vs last month</span>
                        </div>
                      </div>

                      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                          <span className="text-xs sm:text-sm font-semibold">Subscribers</span>
                          <Users className="w-4 h-4 text-purple-500" />
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-slate-900">128,450</div>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 mt-2 font-bold">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>+3,410 this week</span>
                        </div>
                      </div>

                      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                          <span className="text-xs sm:text-sm font-semibold">Estimated RPM</span>
                          <DollarSign className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-slate-900">$4.85</div>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 mt-2 font-bold">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>+$0.62 optimization</span>
                        </div>
                      </div>

                      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                          <span className="text-xs sm:text-sm font-semibold">Avg Watch Duration</span>
                          <Clock className="w-4 h-4 text-amber-500" />
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-slate-900">8m 42s</div>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 mt-2 font-bold">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>58.2% retention rate</span>
                        </div>
                      </div>
                    </div>

                    {/* Chart & Insights Area */}
                    <div className="grid lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-base font-bold text-slate-900">Hourly View Trajectory & Benchmark</h3>
                            <p className="text-xs text-slate-500">Comparing current upload against channel top 10% average</p>
                          </div>
                          <span className="px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                            +42% Above Benchmark
                          </span>
                        </div>
                        {/* SVG Simulated Chart Graphic */}
                        <div className="h-48 sm:h-56 w-full flex items-end gap-2 sm:gap-3 pt-6 pb-2 px-1">
                          {[38, 45, 52, 60, 58, 64, 75, 82, 79, 90, 88, 98, 110, 105, 120, 135, 140, 158].map((val, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                              <div
                                style={{ height: `${(val / 160) * 100}%` }}
                                className="w-full bg-gradient-to-t from-red-600 to-indigo-500 rounded-t-md group-hover:from-red-500 group-hover:to-rose-400 transition-all duration-200 shadow-xs"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                          <span>Upload (0h)</span>
                          <span>Hour 6</span>
                          <span>Hour 12</span>
                          <span>Hour 18</span>
                          <span>Hour 24</span>
                        </div>
                      </div>

                      {/* Right Side Live Alert Feed */}
                      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                              <Bell className="w-4 h-4 text-rose-500" />
                              System Intelligence Alerts
                            </span>
                            <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded-full">
                              LIVE
                            </span>
                          </div>
                          <div className="space-y-3">
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                              <div className="flex items-center justify-between text-emerald-700 font-bold mb-1">
                                <span>🚀 High Retention Spike</span>
                                <span className="text-slate-400 text-[10px]">12m ago</span>
                              </div>
                              <p className="text-slate-600">Video #142 reached 71% retention at timestamp 04:15.</p>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                              <div className="flex items-center justify-between text-amber-700 font-bold mb-1">
                                <span>🎯 Algorithm Recommendation</span>
                                <span className="text-slate-400 text-[10px]">1h ago</span>
                              </div>
                              <p className="text-slate-600">Best time to publish next video: Thursday 18:30 UTC.</p>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                              <div className="flex items-center justify-between text-blue-700 font-bold mb-1">
                                <span>📥 Celery Daily Sync</span>
                                <span className="text-slate-400 text-[10px]">3h ago</span>
                              </div>
                              <p className="text-slate-600">Generated channel report #104 (CSV/Excel ready).</p>
                            </div>
                          </div>
                        </div>

                        <Link
                          to="/register"
                          className="mt-4 block w-full py-2.5 text-center text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                        >
                          View Full Channel Analytics &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'ai' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
                          <Cpu className="w-5 h-5" />
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mb-2">Viral Probability Index</h4>
                        <div className="text-3xl font-black text-rose-600 mb-2">89 / 100</div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Title structure, CTR probability, and search query match score indicate 2.8x higher viral potential.
                        </p>
                      </div>

                      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mb-2">Optimal Upload Window</h4>
                        <div className="text-2xl font-black text-amber-600 mb-2">Thu & Sat @ 7:00 PM</div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Audience online concentration peaks between 18:30 and 21:00 UTC with maximum notification tap rate.
                        </p>
                      </div>

                      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mb-2">RPM Expansion Opportunity</h4>
                        <div className="text-3xl font-black text-emerald-600 mb-2">+$1,450 / mo</div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Extending average video length by 90 seconds unlocks 1 extra mid-roll slot with 94% viewer tolerance.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reporting' && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Automated Celery Beat Reporting Suite</h3>
                        <p className="text-xs text-slate-500">Scheduled exports generated in background and stored for instant download</p>
                      </div>
                      <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Celery Beat Running
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] tracking-wider font-bold">
                          <tr>
                            <th className="py-3 px-4 rounded-l-lg">Report Name</th>
                            <th className="py-3 px-4">Frequency</th>
                            <th className="py-3 px-4">Formats</th>
                            <th className="py-3 px-4">Last Generated</th>
                            <th className="py-3 px-4 rounded-r-lg text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr className="hover:bg-slate-100/50 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                              <Download className="w-4 h-4 text-red-500" />
                              Daily Channel Performance
                            </td>
                            <td className="py-3.5 px-4 font-medium">Daily @ 2:00 AM UTC</td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-[10px] font-bold">CSV</span>{' '}
                              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-[10px] font-bold">XLSX</span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-500">Today, 02:00 UTC</td>
                            <td className="py-3.5 px-4 text-right">
                              <span className="text-red-600 hover:text-red-700 cursor-pointer font-bold">Download</span>
                            </td>
                          </tr>
                          <tr className="hover:bg-slate-100/50 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                              <Download className="w-4 h-4 text-emerald-500" />
                              Weekly Monetization & RPM Audit
                            </td>
                            <td className="py-3.5 px-4 font-medium">Mondays @ 00:00 UTC</td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-[10px] font-bold">PDF</span>{' '}
                              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-[10px] font-bold">XLSX</span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-500">Oct 12, 00:00 UTC</td>
                            <td className="py-3.5 px-4 text-right">
                              <span className="text-red-600 hover:text-red-700 cursor-pointer font-bold">Download</span>
                            </td>
                          </tr>
                          <tr className="hover:bg-slate-100/50 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                              <Download className="w-4 h-4 text-purple-500" />
                              Audience Demographics & Geography
                            </td>
                            <td className="py-3.5 px-4 font-medium">Monthly 1st @ 00:00 UTC</td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-[10px] font-bold">CSV</span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-500">Oct 01, 00:00 UTC</td>
                            <td className="py-3.5 px-4 text-right">
                              <span className="text-red-600 hover:text-red-700 cursor-pointer font-bold">Download</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Growth Calculator */}
      <section id="calculator" className="py-20 sm:py-28 relative z-10 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3.5 py-1.5 rounded-full border border-red-200">
              ROI & Growth Estimator
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mt-4 mb-4">
              How Much Growth Are You Leaving on the Table?
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              Drag the slider to your current subscriber range to estimate your unlocked monthly views and revenue.
            </p>
          </div>

          <div className="max-w-4xl mx-auto p-6 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200 shadow-xl">
            {/* Slider */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-slate-700">Current Subscribers:</span>
                <span className="text-2xl font-black text-slate-900 bg-white px-4 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                  {calculatorSubs.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="500000"
                step="5000"
                value={calculatorSubs}
                onChange={(e) => setCalculatorSubs(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                <span>5,000</span>
                <span>100,000</span>
                <span>250,000</span>
                <span>500,000+</span>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">
                  Projected Monthly Views
                </div>
                <div className="text-3xl font-black text-slate-900">{estimatedViews}</div>
                <div className="text-xs text-emerald-600 mt-2 font-bold">+35% algorithmic discovery</div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">
                  Estimated Revenue Upside
                </div>
                <div className="text-3xl font-black text-emerald-600">+${estimatedRevenueGain}</div>
                <div className="text-xs text-slate-500 mt-2 font-medium">From RPM & mid-roll optimization</div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">
                  Hours Saved / Month
                </div>
                <div className="text-3xl font-black text-indigo-600">{estimatedHoursSaved} hrs</div>
                <div className="text-xs text-slate-500 mt-2 font-medium">Via automated Celery reporting</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-20 sm:py-32 relative z-10 border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-200">
              The Creator Arsenal
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mt-4 mb-4">
              Engineered for Serious YouTube Creators & Studios
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              Every tool you need to track channel velocity, predict breakout videos, and automate reporting workflows.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl bg-white border border-slate-200 hover:border-red-300 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Real-Time Ingestion & Hourly Sync</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Connected directly to YouTube Data API v3 with automatic exponential backoff retry. Never miss an algorithmic spike.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Hourly video view count updates</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Real-time subscriber velocity alerts</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Machine Learning Growth Predictor</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Trained algorithms evaluate early view momentum, comments sentiment, and historical retention curves.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Viral score probability (0-100)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Optimal day/hour upload recommendations</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Download className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Automated Celery Beat Reports</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Schedule recurring daily, weekly, or monthly performance audits exported into cleanly formatted CSV, XLSX, and PDF.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Celery background async generation</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Sponsor-ready presentation deliverables</li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 rounded-3xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <DollarSign className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Revenue & RPM Intelligence</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Understand exactly which topics, lengths, and demographic regions yield the highest revenue per mille (RPM).
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Geographic CPM breakdown</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Mid-roll ad placement yield audit</li>
              </ul>
            </div>

            {/* Feature 5 */}
            <div className="group p-8 rounded-3xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Audience & Geographic Mapping</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Explore country-by-country viewership distributions and viewer retention curves to discover untapped global audiences.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Global subscriber distribution</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Retention drop-off timestamp analysis</li>
              </ul>
            </div>

            {/* Feature 6 */}
            <div className="group p-8 rounded-3xl bg-white border border-slate-200 hover:border-rose-300 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Enterprise Security & API Quotas</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Built on Django REST Framework, JWT authentication, and automated rate-limiting to protect YouTube API quotas.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Read-only OAuth security</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Real-time API quota tracker & warnings</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 sm:py-32 relative z-10 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-200">
              Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mt-4 mb-4">
              Invest in Scalable Channel Growth
            </h2>
            <p className="text-base sm:text-lg text-slate-600 mb-8">
              Start with our free plan. Upgrade when you need deep AI models and automated exports.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
                  billingCycle === 'yearly'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Yearly
                <span className="text-[10px] bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded-md uppercase">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {/* Free Tier */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Creator Free</h3>
                <p className="text-xs text-slate-500 mb-6">Essential tracking for emerging creators starting out.</p>
                <div className="text-4xl font-black text-slate-900 mb-6">
                  $0 <span className="text-xs font-normal text-slate-500">/ forever</span>
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-700 font-medium mb-8">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> 1 YouTube Channel</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Daily metrics sync</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> 30-day historical chart retention</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Standard dashboard views</li>
                </ul>
              </div>
              <Link
                to="/register"
                className="w-full py-3 text-center text-sm font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-all shadow-xs"
              >
                Get Started
              </Link>
            </div>

            {/* Pro Creator - Highlighted */}
            <div className="relative p-8 rounded-3xl bg-white border-2 border-red-500 shadow-2xl shadow-red-500/15 flex flex-col justify-between transform md:-translate-y-2">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[11px] font-extrabold uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
                Most Popular
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Pro Creator</h3>
                <p className="text-xs text-slate-500 mb-6">For full-time creators and growing channels ready to 10x earnings.</p>
                <div className="text-4xl font-black text-slate-900 mb-6">
                  {billingCycle === 'yearly' ? '$19' : '$24'} <span className="text-xs font-normal text-slate-500">/ month</span>
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-700 font-semibold mb-8">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Up to 5 YouTube Channels</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Hourly real-time metrics sync</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Machine learning viral probability score</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Automated Celery Beat PDF & Excel exports</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> RPM & demographic optimization</li>
                </ul>
              </div>
              <Link
                to="/register"
                className="w-full py-3.5 text-center text-sm font-extrabold text-white bg-gradient-to-r from-red-600 via-rose-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-red-500/25 transition-all"
              >
                Claim Pro Trial (14 Days Free)
              </Link>
            </div>

            {/* Studio / Agency Tier */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Studio & Agency</h3>
                <p className="text-xs text-slate-500 mb-6">For multi-channel networks, talent managers, and media brands.</p>
                <div className="text-4xl font-black text-slate-900 mb-6">
                  {billingCycle === 'yearly' ? '$79' : '$99'} <span className="text-xs font-normal text-slate-500">/ month</span>
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-700 font-medium mb-8">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Unlimited YouTube Channels</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Custom team roles & permissions</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> White-labeled agency client reports</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Webhook API notifications & priority quota</li>
                </ul>
              </div>
              <Link
                to="/register"
                className="w-full py-3 text-center text-sm font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-all shadow-xs"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-20 sm:py-28 relative z-10 border-t border-slate-200 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-200">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Everything you need to know about API integration, safety, and background reporting.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white border border-slate-200/90 shadow-xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-red-600 transition-colors"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                      openFaq === index ? 'rotate-180 text-red-600' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pre-Footer Final CTA Card */}
      <section className="py-16 sm:py-24 relative z-10 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-red-600 via-rose-600 to-indigo-700 text-center overflow-hidden shadow-2xl text-white">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-5xl font-black mb-4">
                Ready to Take Control of Your YouTube Growth?
              </h2>
              <p className="text-sm sm:text-base text-red-100 mb-8 leading-relaxed font-medium">
                Connect your channel in 30 seconds. No credit card required. Experience official YouTube Analytics enhanced with AI.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-slate-900 hover:bg-slate-100 font-black text-base rounded-2xl shadow-xl hover:scale-105 transition-all duration-200"
              >
                <span>Launch Your Dashboard Now</span>
                <ArrowRight className="w-5 h-5 text-red-600" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-950 border-t border-slate-800 py-12 text-slate-400 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2.5 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center">
                  <Play className="w-4 h-4 text-white fill-white translate-x-0.5" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">CreatorPulse</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4 max-w-xs">
                Empowering video creators worldwide with automated YouTube Analytics, Reporting APIs, and predictive machine learning.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4 text-xs uppercase tracking-wider">Product</h4>
              <ul className="space-y-2.5">
                <li><Link to="/login" className="hover:text-white transition-colors">Channel Overview</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Video Velocity</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Audience Demographics</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Celery Reports</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4 text-xs uppercase tracking-wider">APIs & Integrations</h4>
              <ul className="space-y-2.5">
                <li><a href="https://developers.google.com/youtube/v3" target="_blank" rel="noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">YouTube Data v3 <ExternalLink className="w-3 h-3" /></a></li>
                <li><a href="https://developers.google.com/youtube/analytics" target="_blank" rel="noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">YouTube Reporting <ExternalLink className="w-3 h-3" /></a></li>
                <li><span className="text-slate-400">Django REST Framework</span></li>
                <li><span className="text-slate-400">Celery Beat Scheduler</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4 text-xs uppercase tracking-wider">Security & Legal</h4>
              <ul className="space-y-2.5">
                <li><span className="hover:text-white transition-colors cursor-pointer">Google API Compliance</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Security Practices</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
            <p>&copy; {new Date().getFullYear()} CreatorPulse Analytics. Built for content creators globally.</p>
            <p className="flex items-center gap-1.5">
              <span>Engineered with Django, Celery, React & YouTube APIs</span>
            </p>
          </div>
        </div>
      </footer>

      {/* FLOATING GO TO TOP BUTTON */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-50 p-3.5 bg-gradient-to-br from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-full shadow-2xl shadow-red-500/40 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group border border-white/20"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
}

export default Landing;
