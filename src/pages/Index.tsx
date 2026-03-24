import React, { useState, useEffect } from 'react';
import { Settings2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import BottomNav from '@/components/layout/BottomNav';

// Helper component for simple split flap display (used here and in ServiceCard)
export const SplitFlapDigit = ({ digit, label }: { digit: string, label?: string }) => (
  <div className="flex flex-col items-center mx-0.5">
    <div className="split-flap w-7 h-9 sm:w-8 sm:h-10 text-lg sm:text-xl">
      {digit}
    </div>
    {label && <span className="text-[10px] text-gray-500 font-bold mt-1 uppercase">{label}</span>}
  </div>
);

export const SplitFlapGroup = ({ value, label }: { value: string, label: string }) => {
  return (
    <div className="flex items-center">
      {value.split('').map((char, i) => (
        <SplitFlapDigit key={i} digit={char} />
      ))}
      <span className="ml-1 mr-2 font-bold text-gray-700 text-sm sm:text-base">{label}</span>
    </div>
  );
};

type Branch = 'army' | 'navy' | 'airforce' | 'public';

const backgroundMap: Record<Branch, string> = {
  army: '/train_bg.png', // Train on railways
  navy: '/ship_bg.png', // Ship on ocean
  airforce: '/plane_bg.png', // Plane in sky
  public: '/bus_bg.png', // Bus on road
};

import useEmblaCarousel from 'embla-carousel-react';
import { useUserStore } from '@/stores/userStore';
import ServiceCard from '@/components/ServiceCard';

const Index = () => {
  const store = useUserStore();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  // Combine user and friends for the carousel
  const slides: Array<{ isUser: boolean; friend?: import('@/stores/userStore').FriendInfo }> = [
    { isUser: true },
    ...store.friends.map(f => ({ isUser: false, friend: f }))
  ];

  const currentSlide = slides[selectedIndex] || slides[0];
  const activeBranch = currentSlide.isUser ? store.branch : (currentSlide.friend?.branch || 'army');

  return (
    <div className="relative h-screen w-full max-w-md mx-auto overflow-hidden bg-gradient-to-b from-[#E6F3FA] via-[#FFE9DE] to-[#E2EDF8]">
      {/* Moving Background 3D Image with Smooth Crossfade */}
      <div className="absolute top-0 w-full h-[65%] overflow-hidden pointer-events-none">
        <AnimatePresence>
          <motion.div
            key={activeBranch}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center animate-vehicle-move"
            style={{
              backgroundImage: `url(${backgroundMap[activeBranch]})`,
              backgroundPosition: 'center 20%',
              maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
            }}
          />
        </AnimatePresence>
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center pb-24 pt-10 px-5">

        {/* Header */}
        <div className="w-full flex justify-between items-center mb-auto pt-2">
          <div className="flex items-center space-x-2">
            <div className="glass p-2 rounded-xl text-xs font-bold text-gray-800 shadow-sm animate-pulse-slow bg-white/40">
              Today: {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
            </div>
          </div>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="p-2 glass rounded-full opacity-80 hover:opacity-100 transition"
          >
            <Settings2 size={24} className="text-gray-800" />
          </button>
        </div>

        {/* Branch Configurator */}
        {isProfileOpen && (
          <div className="absolute top-20 right-5 w-48 glass-dark p-4 rounded-xl z-30 shadow-xl animate-[slideDown_0.2s_ease-out]">
            <h3 className="text-xs font-bold text-gray-800 mb-2 text-center">임시 테마 변경</h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => store.setBranch('army')} className={`p-1.5 rounded-lg text-[10px] font-semibold transition ${store.branch === 'army' ? 'bg-gray-800 text-white' : 'bg-white/50 text-gray-700 hover:bg-white/80'}`}>육군 (기차)</button>
              <button onClick={() => store.setBranch('navy')} className={`p-1.5 rounded-lg text-[10px] font-semibold transition ${store.branch === 'navy' ? 'bg-gray-800 text-white' : 'bg-white/50 text-gray-700 hover:bg-white/80'}`}>해군 (배)</button>
              <button onClick={() => store.setBranch('airforce')} className={`p-1.5 rounded-lg text-[10px] font-semibold transition ${store.branch === 'airforce' ? 'bg-gray-800 text-white' : 'bg-white/50 text-gray-700 hover:bg-white/80'}`}>공군 (비행기)</button>
              <button onClick={() => store.setBranch('public')} className={`p-1.5 rounded-lg text-[10px] font-semibold transition ${store.branch === 'public' ? 'bg-gray-800 text-white' : 'bg-white/50 text-gray-700 hover:bg-white/80'}`}>공익 (버스)</button>
            </div>
          </div>
        )}

        {/* Floating Station Tags removed since JourneyRoute handles it now */}

        {/* Swipable Service Cards */}
        <div className="w-full mt-auto mb-6">
          {/* Add Friend Button (placeholder visual) */}
          <div className="flex justify-end mb-2 px-2">
            <button className="text-[10px] font-bold text-gray-600 bg-white/40 px-3 py-1.5 rounded-full border border-white/50 shadow-sm flex items-center gap-1 hover:bg-white/60 transition active:scale-95">
              + 친구 추가
            </button>
          </div>

          <div className="overflow-hidden w-full" ref={emblaRef}>
            <div className="flex w-full space-x-4 px-2">
              {slides.map((slide, idx) => (
                <div className="flex-[0_0_90%] min-w-0" key={idx}>
                  <ServiceCard user={slide.isUser} friend={slide.friend} />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <BottomNav />
    </div>
  );
};

export default Index;
