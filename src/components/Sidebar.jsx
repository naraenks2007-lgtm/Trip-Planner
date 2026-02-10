import React from "react";

function Sidebar({ setSelectedOption }) {
  console.log('✅ Sidebar component is rendering!');

  return (
    <div className="w-64 bg-gray-800 dark:bg-gray-900 text-white p-4">

      <h2 className="font-bold mb-4">Travel Options</h2>

      <button onClick={() => setSelectedOption("restaurants")} className="block w-full bg-orange-500 hover:bg-orange-600 p-2 mb-2 rounded transition-colors">
        🍽️ Restaurants
      </button>

      <button onClick={() => setSelectedOption("hotels")} className="block w-full bg-purple-500 hover:bg-purple-600 p-2 mb-2 rounded transition-colors">
        🏨 Hotels
      </button>

      <button onClick={() => setSelectedOption("car-rentals")} className="block w-full bg-blue-500 hover:bg-blue-600 p-2 mb-2 rounded transition-colors">
        🚗 Car Rentals
      </button>

      <button onClick={() => setSelectedOption("tourist-attractions")} className="block w-full bg-pink-500 hover:bg-pink-600 p-2 mb-2 rounded transition-colors">
        📍 Tourist Attractions
      </button>

      <button onClick={() => setSelectedOption("bus")} className="block w-full bg-green-500 hover:bg-green-600 p-2 mb-2 rounded transition-colors">
        🚌 Bus Timing
      </button>

      <button onClick={() => setSelectedOption("famous")} className="block w-full bg-red-500 hover:bg-red-600 p-2 mb-2 rounded transition-colors">
        ⭐ Famous Places
      </button>

    </div>
  );
}

export default Sidebar;
