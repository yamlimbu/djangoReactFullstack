import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center py-4 gap-4 lg:gap-0">
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">YouTube AI Analytics</h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Grow your channel smarter</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3 w-full lg:w-auto lg:flex-shrink-0">
              <Link 
                to="/login" 
                className="flex-1 lg:flex-none px-4 py-2.5 sm:px-6 text-xs sm:text-sm font-medium text-gray-700 bg-white/50 hover:bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 text-center lg:text-left"
              >
                Login
              </Link>
              <Link 
                to="/register"
                className="px-4 py-2.5 sm:px-6 text-xs sm:text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 flex-1 lg:flex-none text-center"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 sm:pt-20 pb-24 sm:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center lg:items-start">
            <div className="lg:pr-12 order-2 lg:order-1">
              <div className="inline-flex px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-2xl mb-6 sm:mb-8 shadow-2xl text-sm sm:text-base">
                🚀 AI-Powered YouTube Growth
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent leading-tight mb-4 sm:mb-6">
                Unlock Your Channel's
                <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-2xl">
                  True Potential
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-lg sm:max-w-2xl">
                AI analyzes your YouTube performance, predicts growth trends, and delivers personalized strategies to{' '}
                <span className="font-semibold text-gray-900">10x your earnings</span>. 
                Track every metric that matters.
              </p>
              <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 mb-10 sm:mb-12">
                <Link 
                  to="/register"
                  className="px-8 py-4 sm:px-10 sm:py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-base sm:text-lg font-bold rounded-2xl hover:from-indigo-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 w-full xs:w-auto"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  Start Free Trial
                </Link>
                <Link 
                  to="/login"
                  className="px-8 py-4 sm:px-10 sm:py-5 border-2 border-gray-200 text-base sm:text-lg font-bold rounded-2xl hover:bg-gray-50 hover:shadow-xl transition-all duration-300 flex items-center justify-center w-full xs:w-auto"
                >
                  View Demo
                </Link>
              </div>
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="text-center p-4 sm:p-6">
                  <div className="text-2xl sm:text-3xl font-black text-indigo-600 mb-1">500K+</div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">Channels Analyzed</div>
                </div>
                <div className="text-center p-4 sm:p-6">
                  <div className="text-2xl sm:text-3xl font-black text-green-600 mb-1">247%</div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">Avg Growth Boost</div>
                </div>
                <div className="text-center p-4 sm:p-6">
                  <div className="text-2xl sm:text-3xl font-black text-purple-600 mb-1">$12.4K</div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">Avg Monthly Revenue</div>
                </div>
                <div className="text-center p-4 sm:p-6">
                  <div className="text-2xl sm:text-3xl font-black text-red-600 mb-1">24/7</div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">AI Monitoring</div>
                </div>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="relative order-1 lg:order-2">
              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl border border-white/20 mx-auto max-w-sm sm:max-w-md lg:max-w-none">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="bg-white/70 rounded-2xl p-4 sm:p-6 shadow-lg">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">1.2M</div>
                    <div className="text-xs sm:text-sm text-gray-600">Total Views</div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mt-1 sm:mt-2">
                      <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-1.5 sm:h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                  </div>
                  <div className="bg-white/70 rounded-2xl p-4 sm:p-6 shadow-lg">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">28.4K</div>
                    <div className="text-xs sm:text-sm text-gray-600">Subscribers</div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mt-1 sm:mt-2">
                      <div className="bg-gradient-to-r from-blue-400 to-indigo-500 h-1.5 sm:h-2 rounded-full" style={{width: '72%'}}></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-white/70 p-3 sm:p-4 rounded-xl shadow-md">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">Live Analytics</span>
                    </div>
                    <div className="text-base sm:text-lg font-bold text-emerald-600">+12.4% growth</div>
                  </div>
                  <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white p-3 sm:p-4 rounded-xl shadow-lg">
                    <div className="font-semibold mb-1 text-sm sm:text-base">🎯 AI Suggestion</div>
                    <div className="text-xs sm:text-sm">Post 3x/week at 8PM EST for 34% more views</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent mb-4 sm:mb-6">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Dominate YouTube</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed">
              Complete analytics suite with AI insights that actually work
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="group p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2"/>
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Real-Time Analytics</h3>
              <p className="text-gray-600 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">Views, watch time, engagement - updated every hour. Never miss a trend.</p>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                <li className="flex items-center"><svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>Live subscriber growth</li>
                <li className="flex items-center"><svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>Video performance tracker</li>
              </ul>
            </div>

            <div className="group p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 border border-emerald-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a"/>
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">AI Growth Engine</h3>
              <p className="text-gray-600 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">Machine learning predicts your next viral video and optimal posting schedule.</p>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                <li className="flex items-center"><svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>Growth predictions</li>
                <li className="flex items-center"><svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>Optimal posting times</li>
              </ul>
            </div>

            <div className="group p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3"/>
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Revenue Intelligence</h3>
              <p className="text-gray-600 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">Forecast earnings, track RPM trends, optimize monetization.</p>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                <li className="flex items-center"><svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>RPM tracking</li>
                <li className="flex items-center"><svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>Revenue forecasts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-2xl font-bold">YouTube AI Analytics</h3>
              </div>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-md">
                The most advanced AI-powered analytics platform for YouTube creators. 
                Grow smarter, earn more.
              </p>
            </div>
            <div className="col-span-1 md:col-span-auto">
              <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Product</h4>
              <ul className="space-y-2 sm:space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors block py-1">Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors block py-1">Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors block py-1">AI Insights</a></li>
                <li><a href="#" className="hover:text-white transition-colors block py-1">Pricing</a></li>
              </ul>
            </div>
            <div className="col-span-1 md:col-span-auto">
              <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Company</h4>
              <ul className="space-y-2 sm:space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors block py-1">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors block py-1">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors block py-1">Press</a></li>
              </ul>
            </div>
            <div className="col-span-1 md:col-span-auto">
              <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Connect</h4>
              <ul className="space-y-2 sm:space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors block py-1">Discord</a></li>
                <li><a href="#" className="hover:text-white transition-colors block py-1">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors block py-1">YouTube</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center text-gray-400 text-xs sm:text-sm">
            <p>&copy; 2025 YouTube AI Analytics. Made with ❤️ for creators everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
