import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserCheck, Eye, Radar, ShieldAlert, Play, Pause, Compass, ArrowRight, Gamepad2, Navigation } from 'lucide-react';
import { LiaTelemetry, AppView } from '../../types';
import { sound } from '../../lib/soundEngine';

interface FollowViewProps {
  telemetry: LiaTelemetry;
  onUpdateTelemetry: (updates: Partial<LiaTelemetry>) => void;
  onNavigate?: (view: AppView) => void;
}

export const FollowView: React.FC<FollowViewProps> = ({
  telemetry,
  onUpdateTelemetry,
  onNavigate,
}) => {
  const [isFollowing, setIsFollowing] = useState(telemetry.drivingMode === 'follow');
  const [targetDistance, setTargetDistance] = useState<number>(1.2); // meters
  const [followSpeed, setFollowSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');

  const handleToggleFollow = () => {
    sound.playClick();
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    onUpdateTelemetry({ drivingMode: nextState ? 'follow' : 'manual' });
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-purple-500/30 backdrop-blur-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Modo Seguir Usuário</h3>
          </div>
          <p className="text-[11px] text-slate-400">Rastreamento Autônomo Viso-Ultrassônico</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
          isFollowing
            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse'
            : 'bg-slate-800 text-slate-400 border border-slate-700'
        }`}>
          {isFollowing ? '• ATIVO' : 'PAUSADO'}
        </span>
      </div>

      {/* Target Vision & Camera Radar Display */}
      <div className="relative p-4 rounded-2xl bg-slate-950 border border-white/10 overflow-hidden flex flex-col items-center justify-center min-h-[200px]">
        {/* Grid lines background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:16px_16px] opacity-20" />

        {/* Circular Radar Sweep */}
        <div className="relative w-36 h-36 rounded-full border border-purple-500/30 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border border-purple-500/20 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border border-purple-500/10" />
          </div>

          {/* Radar Sweep Line */}
          {isFollowing && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-t-2 border-purple-400/80 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
            />
          )}

          {/* User Target Icon */}
          <motion.div
            animate={isFollowing ? { y: [-2, 2, -2] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
            className="relative z-10 p-2.5 rounded-full bg-purple-500/20 border-2 border-purple-400 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.6)]"
          >
            <UserCheck className="w-6 h-6" />
          </motion.div>
        </div>

        {/* Vision Detection HUD overlay */}
        <div className="mt-3 flex items-center justify-between w-full px-2 text-[11px] font-mono text-slate-400 border-t border-white/5 pt-2">
          <span className="flex items-center gap-1 text-purple-300">
            <Eye className="w-3.5 h-3.5" /> Visão IA: <strong className="text-white">98.5%</strong>
          </span>
          <span className="flex items-center gap-1 text-fuchsia-400">
            <Radar className="w-3.5 h-3.5" /> Distância: <strong className="text-white">{targetDistance}m</strong>
          </span>
        </div>
      </div>

      {/* Main Toggle Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleToggleFollow}
        className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2.5 shadow-lg transition-all cursor-pointer ${
          isFollowing
            ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 hover:bg-amber-500/30'
            : 'liquid-button text-white shadow-[0_0_25px_rgba(168,85,247,0.4)] font-extrabold'
        }`}
      >
        {isFollowing ? (
          <>
            <Pause className="w-4 h-4" /> PAUSAR MODO SEGUIR
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-white" /> ATIVAR MODO SEGUIR
          </>
        )}
      </motion.button>

      {/* Target Distance Controls */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-purple-400" /> Distância Mantida do Alvo
          </span>
          <span className="text-xs font-mono font-bold text-purple-300">{targetDistance} m</span>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[
            { label: 'Perto (0.8m)', val: 0.8 },
            { label: 'Média (1.2m)', val: 1.2 },
            { label: 'Longe (2.0m)', val: 2.0 },
          ].map((preset) => (
            <button
              key={preset.val}
              onClick={() => {
                sound.playClick();
                setTargetDistance(preset.val);
              }}
              className={`py-1.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                targetDistance === preset.val
                  ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-bold'
                  : 'bg-slate-950 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Speed & Sensitivity */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl space-y-2">
        <span className="text-xs font-bold text-white flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-purple-400" /> Velocidade de Acompanhamento
        </span>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'slow', label: 'Suave' },
            { id: 'normal', label: 'Padrão' },
            { id: 'fast', label: 'Rápido' },
          ].map((sp) => (
            <button
              key={sp.id}
              onClick={() => {
                sound.playClick();
                setFollowSpeed(sp.id as any);
              }}
              className={`py-1.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                followSpeed === sp.id
                  ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-bold'
                  : 'bg-slate-950 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {sp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Switch Driving Mode Quick Navigation */}
      {onNavigate && (
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl space-y-2">
          <p className="text-[11px] font-bold text-slate-300">Outros Modos de Condução:</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onUpdateTelemetry({ drivingMode: 'manual' });
                onNavigate('control');
              }}
              className="p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" /> Manual
              </span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => {
                onUpdateTelemetry({ drivingMode: 'autonomous' });
                onNavigate('summon');
              }}
              className="p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-cyan-400" /> Autônomo
              </span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
