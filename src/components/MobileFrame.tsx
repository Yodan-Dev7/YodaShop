import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Wifi, Battery, Smartphone, Monitor } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const { isMobileFrameMode, setIsMobileFrameMode } = useApp();
  const [time, setTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  if (!isMobileFrameMode) {
    return <div className="min-h-screen bg-slate-50 flex flex-col">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 py-6 px-4 flex flex-col items-center justify-center overflow-x-hidden">
      {/* Mobile Frame Outer Chassis */}
      <div className="relative w-full max-w-[410px] h-[850px] bg-slate-950 rounded-[50px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-4 border-slate-800 flex flex-col overflow-hidden">
        {/* Notch / Dynamic Island */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
          <div className="w-2 h-2 rounded-full bg-indigo-900/60" />
        </div>

        {/* Status Bar */}
        <div className="pt-2 px-6 pb-2 flex items-center justify-between text-white text-[11px] font-bold z-30 select-none">
          <span>{time}</span>
          <div className="flex items-center gap-1.5 text-white/90">
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 fill-white" />
          </div>
        </div>

        {/* Phone Screen Viewport */}
        <div className="flex-1 bg-slate-50 rounded-[38px] overflow-hidden flex flex-col relative border border-slate-800/20">
          {children}
        </div>

        {/* Home Indicator Gesture Bar */}
        <div className="pt-2 pb-1 flex justify-center z-30">
          <div className="w-32 h-1 bg-slate-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};
