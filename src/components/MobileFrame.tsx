import React from 'react';
import { motion } from 'motion/react';
import { Home, Gamepad2, Navigation, UserCheck, Activity, Lock, Settings, Bell } from 'lucide-react';
import { AppView } from '../types';
import { sound } from '../lib/soundEngine';

interface MobileFrameProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  children: React.ReactNode;
  unreadAlertsCount: number;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  currentView,
  onSelectView,
  children,
  unreadAlertsCount,
}) => {
  const navItems = [
    { id: 'home' as AppView, label: 'Início', icon: Home },
    { id: 'control' as AppView, label: 'Manual', icon: Gamepad2 },
    { id: 'summon' as AppView, label: 'Autônomo', icon: Navigation },
    { id: 'follow' as AppView, label: 'Seguir', icon: UserCheck },
    { id: 'sensors' as AppView, label: 'Sensores', icon: Activity },
    { id: 'lid' as AppView, label: 'Tampa', icon: Lock },
    { id: 'settings' as AppView, label: 'Config.', icon: Settings },
    { id: 'alerts' as AppView, label: 'Alertas', icon: Bell, badge: unreadAlertsCount },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[420px] h-[840px] rounded-[48px] bg-slate-950 p-4 border-[6px] border-purple-950/60 shadow-[0_0_90px_rgba(168,85,247,0.35)] flex flex-col overflow-hidden ring-1 ring-purple-500/20 select-none">
      {/* Dynamic Notch / Camera Island */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-40 w-36 h-7 rounded-b-2xl bg-black border-x border-b border-purple-500/20 flex items-center justify-between px-4">
        <span className="text-[10px] font-mono text-purple-400 font-bold">09:30</span>
        <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500/80" />
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-[9px] text-slate-400 font-mono">5G</span>
        </div>
      </div>

      {/* Main Viewport Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-8 px-1">
        {children}
      </div>

      {/* Floating Liquid Glass Bottom Navigation Bar */}
      <div className="absolute bottom-3 left-3 right-3 z-30 p-1.5 rounded-2xl bg-slate-900/95 border border-purple-500/30 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        <div className="grid grid-cols-8 gap-0.5">
          {navItems.map((item) => {
            const IconComp = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  onSelectView(item.id);
                }}
                className={`relative flex flex-col items-center justify-center py-1.5 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-purple-300 bg-purple-500/20 font-bold shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <IconComp className="w-4 h-4 shrink-0" />
                <span className="text-[9px] mt-0.5 truncate tracking-tight">{item.label}</span>

                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-0.5 w-3.5 h-3.5 rounded-full bg-fuchsia-500 text-[8px] font-bold text-white flex items-center justify-center shadow-sm">
                    {item.badge}
                  </span>
                ) : null}

                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute -bottom-0.5 w-4 h-0.5 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
