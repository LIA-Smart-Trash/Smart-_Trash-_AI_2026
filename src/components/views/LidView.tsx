import React from 'react';
import { motion } from 'motion/react';
import { Lock, Unlock, Clock, ShieldCheck } from 'lucide-react';
import { LiaTelemetry } from '../../types';
import { sound } from '../../lib/soundEngine';

interface LidViewProps {
  telemetry: LiaTelemetry;
  onToggleLid: (forcedState?: boolean) => void;
}

export const LidView: React.FC<LidViewProps> = ({ telemetry, onToggleLid }) => {
  const [autoCloseSeconds, setAutoCloseSeconds] = React.useState<number>(10);

  const handleOpen = () => {
    sound.playLidToggle(true);
    onToggleLid(true);
  };

  const handleClose = () => {
    sound.playLidToggle(false);
    onToggleLid(false);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Title */}
      <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl text-center">
        <h3 className="text-sm font-bold text-white">Controle da Tampa</h3>
        <p className="text-xs text-slate-400">Atuador Servo Motor Proporcional</p>
      </div>

      {/* Animated 3D/SVG Lid Visualizer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-3xl bg-slate-950 border border-emerald-500/20 p-6 flex flex-col items-center justify-center shadow-xl"
      >
        <div className="relative w-40 h-44 flex items-center justify-center">
          {/* Bin Container SVG */}
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]">
            {/* Bin Body */}
            <path
              d="M 20 40 L 25 110 Q 25 115 30 115 L 70 115 Q 75 115 75 110 L 80 40 Z"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="2"
            />
            {/* Front Panel Accent */}
            <path
              d="M 30 50 L 33 100 L 67 100 L 70 50 Z"
              fill="#1e293b"
              stroke="#10b981"
              strokeWidth="1"
              strokeOpacity="0.4"
            />
            {/* Recycling Icon */}
            <path
              d="M 45 65 L 50 60 L 55 65 M 50 60 L 50 80 M 42 75 L 58 75"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Lid Hinge */}
            <circle cx="20" cy="40" r="3" fill="#10b981" />

            {/* Animated Lid Flap */}
            <g
              style={{
                transformOrigin: '20px 40px',
                transform: `rotate(${telemetry.lidOpen ? -70 : 0}deg)`,
                transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <path
                d="M 15 40 L 85 40 Q 88 40 88 35 L 85 32 L 15 32 Z"
                fill="#10b981"
                stroke="#34d399"
                strokeWidth="1.5"
              />
              <rect x="42" y="28" width="16" height="4" rx="2" fill="#059669" />
            </g>
          </svg>
        </div>

        <div className="mt-4 text-center space-y-1">
          <p className="text-lg font-bold text-white flex items-center justify-center gap-2">
            {telemetry.lidOpen ? (
              <span className="text-amber-400 flex items-center gap-1.5">
                <Unlock className="w-5 h-5" /> Tampa Aberta (70°)
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <Lock className="w-5 h-5" /> Tampa Fechada (0°)
              </span>
            )}
          </p>
          <p className="text-xs text-slate-400">
            {telemetry.lidOpen
              ? 'Atuador ativado. Fechamento automático habilitado.'
              : 'Vedação hermética ativa contra odores.'}
          </p>
        </div>
      </motion.div>

      {/* Action Buttons: Abrir & Fechar */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpen}
          className={`py-3.5 px-4 rounded-2xl font-bold text-base shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2 ${
            telemetry.lidOpen
              ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300'
              : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30'
          }`}
        >
          <Unlock className="w-5 h-5" /> Abrir
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClose}
          className={`py-3.5 px-4 rounded-2xl font-bold text-base shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2 ${
            !telemetry.lidOpen
              ? 'bg-slate-800 border border-white/20 text-white ring-2 ring-white/30'
              : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
          }`}
        >
          <Lock className="w-5 h-5" /> Fechar
        </motion.button>
      </div>

      {/* Auto-Close Settings Card */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-400" /> Fechamento Automático
          </span>
          <span className="text-xs font-mono font-bold text-emerald-400">
            {autoCloseSeconds} Segundos
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[5, 10, 15, 30].map((sec) => (
            <button
              key={sec}
              onClick={() => setAutoCloseSeconds(sec)}
              className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                autoCloseSeconds === sec
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-950/60 border border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {sec}s
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Sensor de presença anti-esmagamento ativo.</span>
        </div>
      </div>
    </div>
  );
};
