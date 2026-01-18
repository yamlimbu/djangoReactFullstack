// src/App.simple.jsx
export default function AppSimple() {
  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        🔴 Tailwind CSS v4 Test
      </h1>
      
      <div className="bg-green-500 text-white p-6 rounded-xl mb-4">
        <p className="text-xl">This should have a green background</p>
      </div>
      
      <div className="bg-blue-500 text-white p-6 rounded-xl mb-4">
        <p className="text-xl">This should have a blue background</p>
      </div>
      
      <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl">
        Gradient Button
      </button>
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-800">
          If you see colors and rounded corners, Tailwind CSS v4 is working! ✅
        </p>
      </div>
    </div>
  );
}