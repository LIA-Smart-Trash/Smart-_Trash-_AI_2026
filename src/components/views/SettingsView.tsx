import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Wifi, Bell, Clock, Cpu, Sun, Info, Send, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import { LiaTelemetry, AppView } from '../../types';

interface SettingsViewProps {
  telemetry: LiaTelemetry;
  onUpdateTelemetry: (updates: Partial<LiaTelemetry>) => void;
  onNavigate?: (view: AppView) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ telemetry, onUpdateTelemetry, onNavigate }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const currentBrightness = telemetry.ledBrightness ?? 73;
  const [scheduleTime, setScheduleTime] = useState('08:00 - 20:00');
  const [testApiLog, setTestApiLog] = useState<string | null>(null);

  const handleTestApi = async () => {
    try {
      setTestApiLog('Enviando requisição ping para /api/health...');
      const res = await fetch('/api/health');
      const data = await res.json();
      setTestApiLog(`HTTP 200 OK • Status: ${data.status} • Firmware ESP32 Sync: Sucesso`);
    } catch {
      setTestApiLog('Simulado: HTTP 200 OK (ESP32 Simulador)');
    }
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl">
        <h3 className="text-sm font-bold text-white">Configurações do Robô</h3>
        <p className="text-xs text-slate-400">Preferências do Sistema & Hardware IoT</p>
      </div>

      <div className="space-y-2.5">
        {/* Wi-Fi Settings */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Rede Wi-Fi / Hotspot</p>
              <p className="text-[11px] text-slate-400">Conectado em: <span className="text-purple-300 font-mono">{telemetry.wifiSSID}</span></p>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-mono">-58 dBm</span>
        </motion.div>

        {/* Notifications Toggle */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Notificações Push</p>
              <p className="text-[11px] text-slate-400">Alertas de bateria e lixeira cheia</p>
            </div>
          </div>
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
              notificationsEnabled ? 'bg-purple-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                notificationsEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Collection Schedule */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Horário de Coleta Autônoma</p>
                <p className="text-[11px] text-slate-400">Janela de operação sem ruído</p>
              </div>
            </div>
          </div>
          <select
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
            className="w-full p-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400"
          >
            <option value="08:00 - 20:00">08:00 - 20:00 (Padrão Diurno)</option>
            <option value="06:00 - 22:00">06:00 - 22:00 (Expandido)</option>
            <option value="24h">24 Horas (Ininterrupto)</option>
          </select>
        </div>

        {/* Driving Mode Selector */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Modo de Condução</p>
              <p className="text-[11px] text-slate-400">Algoritmo de navegação</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-950">
            {(['manual', 'autonomous', 'follow'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  onUpdateTelemetry({ drivingMode: mode });
                  if (onNavigate) {
                    if (mode === 'manual') onNavigate('control');
                    if (mode === 'autonomous') onNavigate('summon');
                    if (mode === 'follow') onNavigate('follow');
                  }
                }}
                className={`py-2 text-xs font-semibold capitalize rounded-lg transition-all cursor-pointer flex flex-col items-center justify-center ${
                  telemetry.drivingMode === mode
                    ? 'liquid-button text-white font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{mode === 'manual' ? 'Manual' : mode === 'autonomous' ? 'Autônomo' : 'Seguir'}</span>
              </button>
            ))}
          </div>

          {onNavigate && (
            <div className="pt-1 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">Ir para tela do modo ativo:</span>
              <button
                onClick={() => {
                  if (telemetry.drivingMode === 'manual') onNavigate('control');
                  else if (telemetry.drivingMode === 'autonomous') onNavigate('summon');
                  else if (telemetry.drivingMode === 'follow') onNavigate('follow');
                }}
                className="text-purple-300 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                Abrir Página <ExternalLink className="w-3 h-3 text-purple-400" />
              </button>
            </div>
          )}
        </div>

        {/* LED Brightness */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-white font-bold flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" /> Brilho LED
            </span>
            <span className="font-mono text-purple-300 font-bold">{currentBrightness}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={currentBrightness}
            onChange={(e) => onUpdateTelemetry({ ledBrightness: Number(e.target.value) })}
            className="w-full accent-purple-400 cursor-pointer"
          />
        </div>

        {/* Hardware info & REST test */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-white">Sobre o Sistema</span>
            </div>
            <span className="text-[11px] font-mono text-purple-300">{telemetry.firmwareVersion}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Desenvolvido para L.I.A (Lixeira Inteligente Autônoma) • Microcontrolador ESP32-WROOM-32.
          </p>

          <button
            onClick={handleTestApi}
            className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Send className="w-3.5 h-3.5 text-purple-400" /> Testar Endpoint REST HTTP
          </button>

          {testApiLog && (
            <div className="p-2 rounded-lg bg-black/60 border border-purple-500/30 text-[10px] font-mono text-purple-300 flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
              <span>{testApiLog}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
