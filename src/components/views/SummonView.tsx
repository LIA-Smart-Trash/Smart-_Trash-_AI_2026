import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navigation, Radar, CheckCircle2, AlertOctagon, Sparkles } from 'lucide-react';
import { LiaTelemetry } from '../../types';
import { sound } from '../../lib/soundEngine';

interface SummonViewProps {
  telemetry: LiaTelemetry;
  onSummonActiveChange: (active: boolean) => void;
}

export const SummonView: React.FC<SummonViewProps> = ({ onSummonActiveChange }) => {
  const [isSummoning, setIsSummoning] = useState<boolean>(false);
  const [distanceMeters, setDistanceMeters] = useState<number>(4.8);
  const [statusText, setStatusText] = useState<string>('Pronto');

  useEffect(() => {
    let interval: any = null;
    if (isSummoning) {
      sound.playSummonRadar();
      setStatusText('Navegando em sua direção...');
      interval = setInterval(() => {
        setDistanceMeters((prev) => {
          if (prev <= 0.6) {
            clearInterval(interval);
            setIsSummoning(false);
            onSummonActiveChange(false);
            setStatusText('L.I.A chegou ao seu local!');
            sound.playLidToggle(true);
            return 0.5;
          }
          return +(prev - 0.4).toFixed(1);
        });
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isSummoning, onSummonActiveChange]);

  const handleToggleSummon = () => {
    if (isSummoning) {
      setIsSummoning(false);
      onSummonActiveChange(false);
      setStatusText('Navegação Autônoma Cancelada.');
      setDistanceMeters(4.8);
      sound.playClick();
    } else {
      setIsSummoning(true);
      onSummonActiveChange(true);
      setDistanceMeters(4.8);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Title */}
      <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl text-center">
        <h3 className="text-sm font-bold text-white flex items-center justify-center gap-2">
          <Navigation className="w-4 h-4 text-purple-400" /> Venha até mim
        </h3>
        <p className="text-xs text-slate-400 font-mono mt-0.5">{statusText}</p>
      </div>

      {/* Futuristic Radar Canvas */}
      <div className="relative w-full h-64 rounded-3xl bg-slate-950 border border-purple-500/30 overflow-hidden flex flex-col items-center justify-center shadow-[0_0_35px_rgba(168,85,247,0.25)]">
        {/* Radar Concentric Circles */}
        <div className="absolute w-56 h-56 rounded-full border border-purple-500/20" />
        <div className="absolute w-40 h-40 rounded-full border border-purple-500/30" />
        <div className="absolute w-24 h-24 rounded-full border border-purple-500/40" />
        <div className="absolute w-10 h-10 rounded-full border border-purple-500/60" />

        {/* Crosshair lines */}
        <div className="absolute w-full h-[1px] bg-purple-500/10" />
        <div className="absolute h-full w-[1px] bg-purple-500/10" />

        {/* Radar Scanning Line */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
          className="absolute w-56 h-56 rounded-full origin-center pointer-events-none"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(168,85,247,0.35) 60deg, transparent 65deg)',
          }}
        />

        {/* Center Target Node (User Position) */}
        <div className="relative z-10 w-8 h-8 rounded-full bg-purple-500/30 border border-purple-400 flex items-center justify-center">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
        </div>

        {/* Robot Node Approaching */}
        <AnimatePresence>
          <motion.div
            animate={{
              y: isSummoning ? (distanceMeters / 5) * 80 : 80,
            }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute z-20 flex flex-col items-center"
          >
            <div className="px-2 py-0.5 rounded-md bg-purple-500 text-[10px] font-bold text-white shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-fuchsia-300" /> L.I.A ({distanceMeters}m)
            </div>
            <div className="w-5 h-5 rounded-full bg-purple-400 border-2 border-white shadow-[0_0_12px_#c084fc]" />
          </motion.div>
        </AnimatePresence>

        {/* Live Distance Meter Overlay */}
        <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-200 font-mono backdrop-blur-md">
          Distância: <span className="text-purple-300 font-bold">{distanceMeters} m</span>
        </div>
      </div>

      {/* Guide Text */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 text-center text-xs text-slate-300">
        Aproxime-se e toque em <strong className="text-purple-300">INICIAR</strong> para a L.I.A calcular o caminho seguro e ir até você.
      </div>

      {/* Start / Cancel Action Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggleSummon}
        className={`w-full py-4 px-6 rounded-2xl font-bold text-base shadow-xl flex items-center justify-center gap-3 cursor-pointer transition-all border ${
          isSummoning
            ? 'bg-red-500/20 border-red-500/40 text-red-300 hover:bg-red-500/30'
            : 'liquid-button text-white'
        }`}
      >
        {isSummoning ? (
          <>
            <AlertOctagon className="w-5 h-5 text-red-400" /> Cancelar Chamado
          </>
        ) : (
          <>
            <Radar className="w-5 h-5" /> Iniciar Navegação Autônoma
          </>
        )}
      </motion.button>
    </div>
  );
};
