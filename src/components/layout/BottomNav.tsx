import { Home, MapPin, Calendar, MessageSquare, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const tabs = [
  { path: '/', icon: Home, label: '홈' },
  { path: '/running', icon: MapPin, label: '뜀걸음' },
  { path: '/calendar', icon: Calendar, label: '캘린더' },
  { path: '/community', icon: MessageSquare, label: '소통' },
  { path: '/profile', icon: User, label: '내 정보' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-[9999] pointer-events-auto">
      <div className="flex items-center justify-around p-2 rounded-[32px] border border-white/60 bg-white/30 backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              type="button"
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center justify-center w-14 h-14 rounded-full cursor-pointer pointer-events-auto transition-all"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomnav-indicator"
                  className="absolute inset-0 rounded-full bg-white/60 shadow-sm border border-white/50"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <tab.icon
                  size={20}
                  className={isActive ? 'text-gray-900 drop-shadow-sm' : 'text-gray-600'}
                />
                <span
                  className={`text-[10px] font-bold ${isActive ? 'text-gray-900 drop-shadow-sm' : 'text-gray-600'
                    }`}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
