// components/TopBar.jsx
import React from 'react';
import { IoWifiSharp } from 'react-icons/io5';

const TopBar = ({ wifiStatus, handleLogout }) => {
  return (
    <div className="flex justify-between items-center md:px-30 px-2">
      <div className="flex items-center gap-2 bg-gray-200 px-2 py-1 rounded shadow">
        <IoWifiSharp className={`w-5 h-5 ${wifiStatus === "ALIVE" ? "text-green-600" : "text-red-600"}`} />
        <span className="text-sm font-semibold text-gray-700">
          {wifiStatus === "ALIVE" ? "Connected" : "Disconnected"}
        </span>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-sm font-medium shadow cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};

export default TopBar;