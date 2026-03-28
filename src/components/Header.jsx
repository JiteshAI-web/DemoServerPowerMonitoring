// components/Header.jsx
import React from 'react';
import { IoWarning } from 'react-icons/io5';
export default function Header({passedMessage, alertStatus}) {
    return(
        <header className="text-center mb-2 mt-2">
            <h2 className="font-semibold text-gray-800 text-2xl mb-1">Power Monitoring Dashboard</h2>
            {
                passedMessage ? (
                    <h2 className="text-lg text-indigo-700 mt-2 font-medium">
                        🕒 Start: {passedMessage.start_time}, Duration: {passedMessage.duration}s
                    </h2>
                ): (
                    <h2 className="text-gray-600 text-lg mt-2">No schedule published.</h2>
                )
            }
            <div className='flex justify-center items-center gap-2'>
             <IoWarning className="text-red-500 text-xl"/>
             <h2 className="text-lg text-red-500 mt-1">
                {alertStatus ? `Alert: ${alertStatus}` : "No recent alert status"}
             </h2>
            </div>

        </header>
    )
}