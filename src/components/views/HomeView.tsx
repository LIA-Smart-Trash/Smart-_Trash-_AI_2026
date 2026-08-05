import React from 'react';
import { motion } from 'motion/react';
import { Battery, Trash2, Thermometer, Wind, Navigation, Lock, Unlock, Wifi, CheckCircle2 } from 'lucide-react';
import { LiaTelemetry } from '../../types';
import { sound } from '../../lib/soundEngine';
import { LiaLogo } from '../LiaLogo';

// Robot 3D render asset
import robotImg from '../../assets/images/lia_robot_bin_1785885574800.jpg';

interface HomeViewProps {
  telemetry: LiaTelemetry;
  onNavigate: (view: any) => void;
  onToggleLid: () => void;
  onSummon: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  telemetry,
  onNavigate,
  onToggleLid,
  onSummon,
}) => {
  const getBatteryColor = (level: number) => {
    if (level > 50) return 'from-purple-500 to-violet-400 text-purple-400';
    if (level > 20) return 'from-amber-500 to-yellow-400 text-amber-400';
    return 'from-red-500 to-rose-400 text-rose-400';
  };

  const getTrashColor = (level: number) => {
    if (level < 70) return 'bg-purple-500 text-purple-400';
    if (level < 85) return 'bg-amber-500 text-amber-400';
    return 'bg-red-500 text-rose-400';
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-4 bg-purple-950/40 border border-purple-500/30 backdrop-blur-xl shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/40 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-purple-400" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-ping opacity-75" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full border border-slate-900" />
            </div>
            <div>
              <h2 className="font-bold text-lg tracking-wide text-white flex items-center gap-2">
                L.I.A
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-purple-400" /> Online
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">ESP32 • {telemetry.ipAddress}</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('settings')}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <CheckCircle2 className="w-5 h-5 text-purple-400" />
          </button>
        </div>
      </motion.div>

      {/* Liquid Glass Orb & Robot Status Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card-purple relative group overflow-hidden rounded-3xl p-5 flex flex-col items-center justify-center text-center"
      >
        {/* L.I.A Logo Badge */}
        <div className="relative z-10 mb-1">
          <LiaLogo size="sm" showText={true} />
        </div>

        {/* Glowing refraction behind orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />

        {/* Liquid Glass Orb & Image Frame */}
        <div className="liquid-orb-container my-3">
          <div className="liquid-orb-glow" />
          <motion.div
            animate={{ y: [-4, 4, -4], rotate: [0, 2, -2, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            className="liquid-orb-sphere w-44 h-44 flex items-center justify-center relative z-10 p-2 overflow-hidden rounded-full border-2 border-purple-400/40 shadow-[0_0_30px_rgba(168,85,247,0.4)]"
          >
            {/* Top specular shine refraction overlay */}
            <div className="absolute top-2 left-4 z-20 w-16 h-8 rounded-full bg-gradient-to-b from-white/60 to-transparent blur-[1px] transform -rotate-12 pointer-events-none" />
            
            {/* Circular Framed Image */}
            <div className="w-36 h-36 rounded-full overflow-hidden border border-purple-300/30 bg-slate-950 relative z-10 shadow-inner flex items-center justify-center">
              <img
                src={robotImg}
                alt="Robô L.I.A"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 space-y-1 mt-1">
          <h3 className="text-base font-extrabold text-white tracking-wide">
            Robô L.I.A Autônomo
          </h3>
          <p className="text-xs text-slate-300 font-mono flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-[0_0_8px_#c084fc]" />
            Modo: <strong className="text-purple-300 capitalize">{telemetry.drivingMode}</strong> • {telemetry.batteryLevel}% Bateria
          </p>
        </div>
      </motion.div>

      {/* Battery Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl bg-slate-900/80 border border-white/10 p-4 backdrop-blur-xl shadow-lg"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Battery className="w-4 h-4 text-purple-400" /> Bateria
          </span>
          <span className="text-base font-bold text-purple-300 font-mono">
            {telemetry.batteryLevel}%
          </span>
        </div>
        <div className="relative w-full h-5 rounded-full bg-slate-800/80 p-0.5 border border-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${telemetry.batteryLevel}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full bg-gradient-to-r ${getBatteryColor(telemetry.batteryLevel)} shadow-[0_0_12px_rgba(168,85,247,0.5)]`}
          />
        </div>
      </motion.div>

      {/* Trash Fill Level Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-slate-900/80 border border-white/10 p-4 backdrop-blur-xl shadow-lg"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Trash2 className="w-4 h-4 text-purple-400" /> Nível de Lixo
          </span>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white font-mono">
              {telemetry.trashLevel}%
            </span>
            <span className="text-xs text-slate-400">({telemetry.trashWeightKg} kg)</span>
          </div>
        </div>
        <div className="relative w-full h-3 rounded-full bg-slate-800 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${telemetry.trashLevel}%` }}
            transition={{ duration: 0.8 }}
            className={`h-full rounded-full ${getTrashColor(telemetry.trashLevel)}`}
          />
        </div>
      </motion.div>

      {/* Telemetry Gauges Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Temperature */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl bg-slate-900/80 border border-white/10 p-3.5 backdrop-blur-xl"
        >
          <div className="flex items-center gap-2 mb-1">
            <Thermometer className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-400">Temperatura</span>
          </div>
          <p className="text-xl font-bold text-white font-mono">{telemetry.temperature} °C</p>
        </motion.div>

        {/* Gas / Air Quality */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl bg-slate-900/80 border border-white/10 p-3.5 backdrop-blur-xl"
        >
          <div className="flex items-center gap-2 mb-1">
            <Wind className="w-4 h-4 text-fuchsia-400" />
            <span className="text-xs text-slate-400">Qualidade do Ar</span>
          </div>
          <p className="text-xl font-bold text-purple-300 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_6px_#c084fc]" />
            {telemetry.gasQualityText}
          </p>
        </motion.div>
      </div>

      {/* Primary Action Button: Venha até mim */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          sound.playSummonRadar();
          onSummon();
        }}
        className="liquid-button w-full py-4 px-6 rounded-2xl font-extrabold text-base flex items-center justify-center gap-3 cursor-pointer shadow-[0_0_30px_rgba(168,85,247,0.4)] text-white"
      >
        <Navigation className="w-5 h-5 fill-white" />
        Venha até mim
      </motion.button>

      {/* Secondary Quick Action: Lid Toggle */}
      <button
        onClick={() => {
          sound.playLidToggle(!telemetry.lidOpen);
          onToggleLid();
        }}
        className={`w-full py-3 px-4 rounded-xl border flex items-center justify-center gap-2 font-medium text-sm transition-all duration-200 cursor-pointer ${
          telemetry.lidOpen
            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
        }`}
      >
        {telemetry.lidOpen ? <Unlock className="w-4 h-4 text-amber-400" /> : <Lock className="w-4 h-4" />}
        {telemetry.lidOpen ? 'Fechar Tampa' : 'Abrir Tampa'}
      </button>
    </div>
  );
};
