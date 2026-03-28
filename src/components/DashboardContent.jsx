import React from 'react';
import RnD from "../pages/R&D"
import Chart from "./Chart"
export default function DashboardContent() {
    return(
        <div className="flex flex-col max-w-7xl mx-auto gap-20">
            <div className="w-full">
                <RnD />
            </div>
            <div className="bg-white rounded-lg shadow-sm w-full p-4 border">
                <h2 className="text-lg font-medium text-gray-800 mb-3">
                    Device Analytics
                </h2>
                <Chart/>
            </div>
        </div>
    )
}