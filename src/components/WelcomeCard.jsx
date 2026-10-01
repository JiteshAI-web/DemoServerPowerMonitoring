import React from 'react';

const WelcomeCard = ({ user_name }) => {
    return (
        <div className="fixed top-4 left-4 bg-white rounded-xl shadow-xl border-l-4 border-blue-500 px-6 py-4 z-40">
            <p className="text-gray-800 font-bold text-lg">
                Welcome, <span className="text-blue-700">{user_name || 'bariflolabs.deploy@gmail.com'}</span>
            </p>
        </div>
    );
};

export default WelcomeCard;