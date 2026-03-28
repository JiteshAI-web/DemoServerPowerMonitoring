import React from 'react';
export default function Footer() {
    return(
        <footer className="text-center text-gray-500 text-sm">
            <p>Power Monitoring Dashboard • Bariflo Cybernetics - {new Date().getFullYear()}</p>
        </footer>
    );
}