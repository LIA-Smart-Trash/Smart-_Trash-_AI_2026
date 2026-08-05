import React from 'react';
import { Smartphone, LayoutGrid, Bot, Volume2, VolumeX, Sparkles, RefreshCw } from 'lucide-react';
import { DisplayMode } from '../types';
import { sound } from '../lib/soundEngine';
import { LiaLogo } from './LiaLogo';

interface HeaderProps {
  displayMode: DisplayMode;
  onToggleDisplayMode: (mode: DisplayMode) => void;
  onOpenAi: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSimulateDataPulse: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  displayMode,
  onToggleDisplayMode,
  onOpenAi,
  soundEnabled,
  onToggleSound,
  onSimulateDataPulse,
}) => {
  return (
    <header className="w-full max-w-7xl mx-auto mb-6 flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-slate-900/80 border border-purple-500/30 backdrop-blur-2xl shadow-xl">
      {/* Brand & Logo */}
      <LiaLogo size="md" showText={true} />

      {/* Right Action Controls */}

      {/* Right Action Controls */}
      <div className="flex items-center gap-2">
        {/* Gemini AI Voice Button */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenAi();
          }}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 via-violet-500/20 to-fuchsia-500/20 border border-purple-500/40 text-purple-300 font-bold text-xs hover:bg-purple-500/30 flex items-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <Bot className="w-4 h-4 text-purple-400" />
          <span>Assistente IA</span>
          <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
        </button>

        {/* Pulse Telemetry Simulator */}
        <button
          onClick={() => {
            sound.playClick();
            onSimulateDataPulse();
          }}
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Simular pulso de dados IoT"
        >
          <RefreshCw className="w-4 h-4 text-purple-400" />
        </button>

        {/* Sound Toggle */}
        <button
          onClick={() => {
            onToggleSound();
          }}
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title={soundEnabled ? 'Efeitos Sonoros Ativados' : 'Som Desativado'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Mode Switcher (Phone Frame vs Wide Dashboard) */}
        <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-white/10">
          <button
            onClick={() => {
              sound.playClick();
              onToggleDisplayMode('mobile');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              displayMode === 'mobile'
                ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onToggleDisplayMode('dashboard');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              displayMode === 'dashboard'
                ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Painel
          </button>
        </div>
      </div>
    </header>
  );
};
