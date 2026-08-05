import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Square, Sun, AlertTriangle, Gauge } from 'lucide-react';
import { LiaTelemetry, RobotPosition } from '../../types';
import { sound } from '../../lib/soundEngine';

interface ControlViewProps {
  telemetry: LiaTelemetry;
  robotPos: RobotPosition;
  onDriveCommand: (dir: 'up' | 'down' | 'left' | 'right' | 'stop') => void;
  onToggleHeadlights: () => void;
}

export const ControlView: React.FC<ControlViewProps> = ({
  telemetry,
  robotPos,
  onDriveCommand,
  onToggleHeadlights,
}) => {
  const [speed, setSpeed] = useState<number>(60);
  const [lastDirection, setLastDirection] = useState<string>('Parado');

  const handlePress = (dir: 'up' | 'down' | 'left' | 'right' | 'stop') => {
    sound.playMotorBeep();
    const names = {
      up: 'Frente ⬆️',
      down: 'Trás ⬇️',
      left: 'Esquerda ⬅️',
      right: 'Direita ➡️',
      stop: 'Parado 🛑',
    };
    setLastDirection(names[dir]);
    onDriveCommand(dir);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Status Bar */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl">
        <div>
          <h3 className="text-sm font-bold text-white">Controle Manual</h3>
          <p className="text-xs text-purple-300 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-[0_0_6px_#c084fc]" />
            Conectado (WiFi)
          </p>
        </div>
        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
          Direção: <span className="text-purple-300 font-bold">{lastDirection}</span>
        </div>
      </div>

      {/* Live Floor Map & Physics Canvas */}
      <div className="relative w-full h-44 rounded-2xl bg-slate-950 border border-purple-500/30 overflow-hidden shadow-inner flex items-center justify-center">
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#a855f715_1px,transparent_1px),linear-gradient(to_bottom,#a855f715_1px,transparent_1px)] bg-[size:20px_20px]" />
        
        {/* Robot Indicator on Floor Map */}
        <motion.div
          animate={{
            x: (robotPos.x - 50) * 2.8,
            y: (robotPos.y - 50) * 1.5,
            rotate: robotPos.headingAngle,
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="relative z-10 w-12 h-12 rounded-xl bg-purple-500/25 border-2 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.6)] flex flex-col items-center justify-center"
        >
          {/* Headlights beam */}
          {telemetry.headlightsOn && (
            <div className="absolute -top-10 w-8 h-10 bg-gradient-to-t from-yellow-300/40 via-yellow-200/10 to-transparent blur-xs pointer-events-none clip-triangle" />
          )}
          <div className="w-2 h-2 rounded-full bg-purple-300 animate-ping" />
          <span className="text-[9px] font-bold text-white tracking-tighter mt-0.5">L.I.A</span>
        </motion.div>

        {/* Speedometer overlay */}
        <div className="absolute bottom-2 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md text-[11px] text-slate-300 font-mono">
          <Gauge className="w-3.5 h-3.5 text-purple-400" />
          Velocidade: {speed}%
        </div>
      </div>

      {/* D-PAD Joystick */}
      <div className="relative flex flex-col items-center justify-center py-4">
        <div className="w-56 h-56 relative rounded-full bg-slate-900/90 border border-purple-500/30 p-2 shadow-[0_0_35px_rgba(168,85,247,0.25)] flex items-center justify-center">
          {/* UP */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handlePress('up')}
            className="absolute top-2 w-16 h-14 rounded-2xl bg-gradient-to-b from-purple-500/30 to-slate-800 border border-purple-500/50 text-purple-300 flex items-center justify-center hover:bg-purple-500/40 active:bg-purple-500/60 shadow-md cursor-pointer"
          >
            <ChevronUp className="w-8 h-8" />
          </motion.button>

          {/* DOWN */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handlePress('down')}
            className="absolute bottom-2 w-16 h-14 rounded-2xl bg-gradient-to-t from-purple-500/30 to-slate-800 border border-purple-500/50 text-purple-300 flex items-center justify-center hover:bg-purple-500/40 active:bg-purple-500/60 shadow-md cursor-pointer"
          >
            <ChevronDown className="w-8 h-8" />
          </motion.button>

          {/* LEFT */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handlePress('left')}
            className="absolute left-2 w-14 h-16 rounded-2xl bg-gradient-to-r from-purple-500/30 to-slate-800 border border-purple-500/50 text-purple-300 flex items-center justify-center hover:bg-purple-500/40 active:bg-purple-500/60 shadow-md cursor-pointer"
          >
            <ChevronLeft className="w-8 h-8" />
          </motion.button>

          {/* RIGHT */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handlePress('right')}
            className="absolute right-2 w-14 h-16 rounded-2xl bg-gradient-to-l from-purple-500/30 to-slate-800 border border-purple-500/50 text-purple-300 flex items-center justify-center hover:bg-purple-500/40 active:bg-purple-500/60 shadow-md cursor-pointer"
          >
            <ChevronRight className="w-8 h-8" />
          </motion.button>

          {/* CENTER STOP BUTTON */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => handlePress('stop')}
            className="w-16 h-16 rounded-2xl bg-slate-800 border border-white/20 text-slate-300 flex items-center justify-center hover:bg-slate-700 active:bg-red-500/30 cursor-pointer shadow-lg"
          >
            <Square className="w-6 h-6 fill-current text-white" />
          </motion.button>
        </div>
      </div>

      {/* Speed Slider */}
      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
        <div className="flex justify-between text-xs text-slate-300">
          <span>Potência dos Motores</span>
          <span className="font-mono font-bold text-purple-400">{speed}%</span>
        </div>
        <input
          type="range"
          min={20}
          max={100}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-full accent-purple-400 cursor-pointer"
        />
      </div>

      {/* Bottom Action Controls */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            sound.playAlert();
            handlePress('stop');
          }}
          className="py-3 px-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 font-bold text-sm hover:bg-red-500/30 flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <AlertTriangle className="w-4 h-4 text-red-400" />
          Parar
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            sound.playClick();
            onToggleHeadlights();
          }}
          className={`py-3 px-4 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md ${
            telemetry.headlightsOn
              ? 'bg-amber-500/30 border-amber-400 text-yellow-200'
              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
          }`}
        >
          <Sun className={`w-4 h-4 ${telemetry.headlightsOn ? 'text-yellow-300 animate-pulse' : ''}`} />
          Luz LED
        </motion.button>
      </div>
    </div>
  );
};
