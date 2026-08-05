import React from 'react';
import { motion } from 'motion/react';
import { HomeView } from './views/HomeView';
import { ControlView } from './views/ControlView';
import { SensorsView } from './views/SensorsView';
import { HistoryView } from './views/HistoryView';
import { LidView } from './views/LidView';
import { SummonView } from './views/SummonView';
import { FollowView } from './views/FollowView';
import { SettingsView } from './views/SettingsView';
import { AlertsView } from './views/AlertsView';
import { LiaTelemetry, CollectionLog, LiaAlert, SensorHistoryPoint, RobotPosition, AppView } from '../types';

interface FullDashboardViewProps {
  telemetry: LiaTelemetry;
  logs: CollectionLog[];
  alerts: LiaAlert[];
  history: SensorHistoryPoint[];
  robotPos: RobotPosition;
  onNavigate: (v: AppView) => void;
  onToggleLid: (forced?: boolean) => void;
  onSummon: () => void;
  onDriveCommand: (dir: 'up' | 'down' | 'left' | 'right' | 'stop') => void;
  onToggleHeadlights: () => void;
  onDismissAlert: (id: string) => void;
  onClearAlerts: () => void;
  onUpdateTelemetry: (updates: Partial<LiaTelemetry>) => void;
}

export const FullDashboardView: React.FC<FullDashboardViewProps> = ({
  telemetry,
  logs,
  alerts,
  history,
  robotPos,
  onNavigate,
  onToggleLid,
  onSummon,
  onDriveCommand,
  onToggleHeadlights,
  onDismissAlert,
  onClearAlerts,
  onUpdateTelemetry,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Driving Modes Grid: Manual, Autônomo, Seguir */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl bg-slate-900/90 border border-purple-500/30 p-5 backdrop-blur-xl shadow-xl"
        >
          <ControlView
            telemetry={telemetry}
            robotPos={robotPos}
            onDriveCommand={onDriveCommand}
            onToggleHeadlights={onToggleHeadlights}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-3xl bg-slate-900/90 border border-white/10 p-5 backdrop-blur-xl shadow-xl"
        >
          <SummonView
            telemetry={telemetry}
            onSummonActiveChange={() => {}}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl bg-slate-900/90 border border-white/10 p-5 backdrop-blur-xl shadow-xl"
        >
          <FollowView
            telemetry={telemetry}
            onUpdateTelemetry={onUpdateTelemetry}
            onNavigate={onNavigate}
          />
        </motion.div>
      </div>

      {/* Middle Grid: Sensors & History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-3xl bg-slate-900/90 border border-white/10 p-5 backdrop-blur-xl shadow-xl"
        >
          <SensorsView telemetry={telemetry} history={history} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl bg-slate-900/90 border border-white/10 p-5 backdrop-blur-xl shadow-xl"
        >
          <HistoryView logs={logs} />
        </motion.div>
      </div>

      {/* Bottom Grid: Lid, Settings & Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl bg-slate-900/90 border border-white/10 p-5 backdrop-blur-xl shadow-xl">
          <LidView telemetry={telemetry} onToggleLid={onToggleLid} />
        </div>
        <div className="rounded-3xl bg-slate-900/90 border border-white/10 p-5 backdrop-blur-xl shadow-xl">
          <SettingsView telemetry={telemetry} onUpdateTelemetry={onUpdateTelemetry} onNavigate={onNavigate} />
        </div>
        <div className="rounded-3xl bg-slate-900/90 border border-white/10 p-5 backdrop-blur-xl shadow-xl">
          <AlertsView alerts={alerts} onDismissAlert={onDismissAlert} onClearAll={onClearAlerts} />
        </div>
      </div>
    </div>
  );
};
