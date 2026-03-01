import React from 'react';

// Adding custom keyframes inline for unique animations not found in default Tailwind
const GlobalStyles = () => (
    <style>
        {`
        @keyframes puff {
            0% { transform: translateY(0) scale(1); opacity: 0.8; }
            100% { transform: translateY(-15px) scale(2); opacity: 0; }
        }
        .animate-smoke-puff {
            animation: puff 1.5s ease-out infinite;
        }
        .animate-smoke-puff-delay {
            animation: puff 1.5s ease-out infinite;
            animation-delay: 0.75s;
        }
        @keyframes rock {
            0%, 100% { transform: rotate(-5deg); }
            50% { transform: rotate(5deg); }
        }
        .animate-rocking {
            animation: rock 3s ease-in-out infinite;
        }
        @keyframes bob {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
        }
        .animate-bobbing {
            animation: bob 2s ease-in-out infinite;
        }
        @keyframes wave-move {
            0% { background-position-x: 0; }
            100% { background-position-x: -40px; }
        }
        .animate-wave-bg {
            animation: wave-move 2s linear infinite;
        }
        `}
    </style>
);

export const TrainVehicle = ({ className = "" }: { className?: string }) => (
    <div className={`relative w-8 h-8 flex items-end justify-center ${className}`}>
        <GlobalStyles />
        {/* Smoke Puffs */}
        <div className="absolute -top-3 left-1 w-2 h-2 bg-gray-400 rounded-full animate-smoke-puff blur-[1px]"></div>
        <div className="absolute -top-2 left-2 w-1.5 h-1.5 bg-gray-300 rounded-full animate-smoke-puff-delay blur-[1px]"></div>

        {/* Train Body SVG */}
        <div className="relative w-8 h-6 animate-bobbing">
            <svg viewBox="0 0 32 24" fill="currentColor" className="w-full h-full text-green-700">
                {/* Main Body */}
                <path d="M4 8 h18 v10 h-18 z" fill="currentColor" />
                <path d="M22 10 c3 0 5 2 5 5 v3 h-5 z" fill="currentColor" />
                {/* Roof */}
                <path d="M3 6 h20 c1 0 2 1 2 2 h-22 c0 -1 1 -2 2 -2 z" fill="#14532d" />
                {/* Window */}
                <rect x="7" y="10" width="4" height="4" fill="#e0f2fe" />
                <rect x="13" y="10" width="4" height="4" fill="#e0f2fe" />
                {/* Chimney */}
                <rect x="23" y="6" width="3" height="4" fill="#14532d" />
            </svg>
            {/* Spinning Wheels */}
            <svg viewBox="0 0 10 10" className="absolute bottom-[-2px] left-1 w-3 h-3 text-gray-800 animate-spin">
                <circle cx="5" cy="5" r="4" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
                <circle cx="5" cy="5" r="1.5" fill="currentColor" />
            </svg>
            <svg viewBox="0 0 10 10" className="absolute bottom-[-2px] left-5 w-3 h-3 text-gray-800 animate-spin">
                <circle cx="5" cy="5" r="4" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
                <circle cx="5" cy="5" r="1.5" fill="currentColor" />
            </svg>
        </div>
    </div>
);

export const ShipVehicle = ({ className = "" }: { className?: string }) => (
    <div className={`relative w-8 h-8 flex items-end justify-center ${className}`}>
        <GlobalStyles />
        {/* Ship SVG rocking */}
        <div className="relative w-8 h-6 animate-rocking">
            <svg viewBox="0 0 32 24" fill="currentColor" className="w-full h-full text-blue-700">
                {/* Hull */}
                <path d="M3 13 L29 13 L26 20 L6 20 Z" fill="currentColor" />
                {/* Superstructure */}
                <rect x="10" y="7" width="12" height="6" fill="#1e3a8a" />
                <rect x="14" y="3" width="4" height="4" fill="#1e3a8a" />
                {/* Windows */}
                <rect x="12" y="9" width="3" height="3" fill="#e0f2fe" />
                <rect x="17" y="9" width="3" height="3" fill="#e0f2fe" />
                {/* Line detail */}
                <line x1="6" y1="15" x2="26" y2="15" stroke="white" strokeWidth="1" />
            </svg>
            {/* Small waves hitting the front */}
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-blue-300 rounded-full animate-ping opacity-50"></div>
        </div>
    </div>
);

export const PlaneVehicle = ({ className = "" }: { className?: string }) => (
    <div className={`relative w-8 h-8 flex items-center justify-center ${className}`}>
        <GlobalStyles />
        {/* Jet stream */}
        <div className="absolute top-1/2 left-[-10px] w-4 h-1 bg-gradient-to-l from-white to-transparent rounded-full opacity-70 animate-pulse"></div>
        <div className="relative w-8 h-8 animate-bobbing -right-1">
            <svg viewBox="0 0 32 32" fill="currentColor" className="w-full h-full text-sky-600" style={{ transform: 'rotate(45deg)' }}>
                {/* Fuselage */}
                <path d="M16 2 C18 2 18 5 18 8 L18 22 C18 25 14 25 14 22 L14 8 C14 5 14 2 16 2 Z" fill="currentColor" />
                {/* Wings */}
                <path d="M16 12 L30 18 L30 20 L16 16 Z" fill="#0284c7" />
                <path d="M16 12 L2 18 L2 20 L16 16 Z" fill="#0284c7" />
                {/* Tail */}
                <path d="M16 22 L22 26 L22 28 L16 26 Z" fill="#0284c7" />
                <path d="M16 22 L10 26 L10 28 L16 26 Z" fill="#0284c7" />
                {/* Cockpit */}
                <path d="M16 4 C17 4 17 5 17 6 L15 6 C15 5 15 4 16 4 Z" fill="#e0f2fe" />
            </svg>
        </div>
    </div>
);

export const BusVehicle = ({ className = "" }: { className?: string }) => (
    <div className={`relative w-8 h-8 flex items-end justify-center ${className}`}>
        <GlobalStyles />
        {/* Bus SVG bobbing */}
        <div className="relative w-8 h-6 animate-bobbing">
            <svg viewBox="0 0 32 24" fill="currentColor" className="w-full h-full text-amber-500">
                {/* Body */}
                <rect x="2" y="6" width="28" height="12" rx="2" fill="currentColor" />
                {/* Windows */}
                <rect x="4" y="8" width="5" height="4" fill="#e0f2fe" />
                <rect x="10" y="8" width="5" height="4" fill="#e0f2fe" />
                <rect x="16" y="8" width="5" height="4" fill="#e0f2fe" />
                <rect x="22" y="8" width="5" height="4" fill="#e0f2fe" />
                {/* Stripe */}
                <rect x="2" y="14" width="28" height="1" fill="#b45309" />
            </svg>
            {/* Spinning Wheels */}
            <svg viewBox="0 0 10 10" className="absolute bottom-[-1px] left-2 w-3 h-3 text-gray-800 animate-spin">
                <circle cx="5" cy="5" r="4" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
                <circle cx="5" cy="5" r="1.5" fill="currentColor" />
            </svg>
            <svg viewBox="0 0 10 10" className="absolute bottom-[-1px] left-6 w-3 h-3 text-gray-800 animate-spin">
                <circle cx="5" cy="5" r="4" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
                <circle cx="5" cy="5" r="1.5" fill="currentColor" />
            </svg>
        </div>
    </div>
);
