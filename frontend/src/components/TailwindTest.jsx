// src/components/TailwindTest.jsx
export default function TailwindTest() {
  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          🎨 Tailwind CSS Test
        </h1>
        
        {/* Test Card 1 - Basic Colors */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">1. Basic Colors & Text</h2>
          <div className="space-y-3">
            <p className="text-red-500 font-medium">This text should be red</p>
            <p className="text-green-500 font-medium">This text should be green</p>
            <p className="text-blue-500 font-medium">This text should be blue</p>
          </div>
        </div>
        
        {/* Test Card 2 - Backgrounds */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-red-100 p-4 rounded-xl border-l-4 border-red-500">
            <p className="text-red-800">Red Background</p>
          </div>
          <div className="bg-green-100 p-4 rounded-xl border-l-4 border-green-500">
            <p className="text-green-800">Green Background</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-xl border-l-4 border-blue-500">
            <p className="text-blue-800">Blue Background</p>
          </div>
        </div>
        
        {/* Test Card 3 - Buttons */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-purple-600 mb-4">2. Buttons & Hover Effects</h2>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Blue Button
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition">
              Gradient Button
            </button>
            <button className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 transition">
              Outline Button
            </button>
          </div>
        </div>
        
        {/* Test Card 4 - Grid System */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Grid System</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(num => (
              <div key={num} className="bg-gray-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-700">Box {num}</div>
                <p className="text-sm text-gray-600">Responsive grid item</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Result Message */}
        <div className="mt-8 text-center">
          <div className="inline-block p-4 bg-green-100 rounded-xl">
            <p className="text-green-800 font-bold">
              ✅ If you see colors, gradients, and rounded corners, Tailwind is working!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}