import React from 'react';
const WelcomeCard = ({user_name}) => {
    <div className="fixed top-4 left-4 rounded-xl shadow-xl border-l-4 border-blue-500 px-6 py-4">
        <p className="text-gray-800 font-old text-lg">
            Welcome, <span className="text-blue-700">{user_name}</span>
        </p>
    </div>
}

export default WelcomeCard