import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Battery, Trash2, Thermometer, CheckCircle2, ShieldAlert } from 'lucide-react';
import { LiaAlert } from '../../types';
import { sound } from '../../lib/soundEngine';

interface AlertsViewProps {
  alerts: LiaAlert[];
  onDismissAlert: (id: string) => void;
  onClearAll: () => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({ alerts, onDismissAlert, onClearAll }) => {
  const getAlertStyle = (severity: LiaAlert['severity']) => {
    switch (severity) {
      case 'danger':
        return {
          cardBg: 'bg-red-950/40 border-red-500/40 text-red-200',
          badgeBg: 'bg-red-500/20 text-red-400 border-red-500/40',
          icon: <Battery className="w-5 h-5 text-red-400" />,
        };
      case 'warning':
        return {
          cardBg: 'bg-amber-950/40 border-amber-500/40 text-amber-200',
          badgeBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
          icon: <Trash2 className="w-5 h-5 text-amber-400" />,
        };
      case 'success':
        return {
          cardBg: 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200',
          badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
        };
      default:
        return {
          cardBg: 'bg-blue-950/40 border-blue-500/40 text-blue-200',
          badgeBg: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
          icon: <Thermometer className="w-5 h-5 text-blue-400" />,
        };
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Alertas & Notificações</h3>
        </div>
        {alerts.length > 0 && (
          <button
            onClick={() => {
              sound.playClick();
              onClearAll();
            }}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Limpar tudo
          </button>
        )}
      </div>

      {/* Alerts List matching Screen 8 design */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-white/5 text-slate-400 text-xs">
            Nenhum alerta pendente. Todos os sistemas funcionando perfeitamente!
          </div>
        ) : (
          alerts.map((alertItem, idx) => {
            const style = getAlertStyle(alertItem.severity);
            return (
              <motion.div
                key={alertItem.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-4 rounded-2xl border backdrop-blur-xl ${style.cardBg} transition-all space-y-2`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border ${style.badgeBg}`}>
                      {style.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{alertItem.title}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">{alertItem.timestamp}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      sound.playClick();
                      onDismissAlert(alertItem.id);
                    }}
                    className="text-slate-500 hover:text-white text-xs p-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-1">
                  {alertItem.description}
                </p>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
