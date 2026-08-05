import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Radio, Wind, Thermometer, Droplets, Trash2, Battery, AreaChart as ChartIcon } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { LiaTelemetry, SensorHistoryPoint } from '../../types';

interface SensorsViewProps {
  telemetry: LiaTelemetry;
  history: SensorHistoryPoint[];
}

export const SensorsView: React.FC<SensorsViewProps> = ({ telemetry, history }) => {
  const [selectedMetric, setSelectedMetric] = useState<'temperature' | 'trashLevel' | 'gasPpm' | 'humidity'>('trashLevel');

  const sensorCards = [
    {
      id: 'distance',
      title: 'Distância (Frontal)',
      value: `${telemetry.distanceFrontCm} cm`,
      icon: Radio,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
      sub: 'Sonar Ultra-sônico (HC-SR04)'
    },
    {
      id: 'gas',
      title: 'Gás (MQ-2)',
      value: `${telemetry.gasPpm} ppm`,
      icon: Wind,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/20',
      sub: `Qualidade: ${telemetry.gasQualityText}`,
      metricKey: 'gasPpm' as const
    },
    {
      id: 'temp',
      title: 'Temperatura',
      value: `${telemetry.temperature} °C`,
      icon: Thermometer,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/20',
      sub: 'Sensor Térmico Interno',
      metricKey: 'temperature' as const
    },
    {
      id: 'humidity',
      title: 'Umidade',
      value: `${telemetry.humidity} %`,
      icon: Droplets,
      color: 'text-blue-400',
      borderColor: 'border-blue-500/20',
      sub: 'Sensor Ambiental',
      metricKey: 'humidity' as const
    },
    {
      id: 'trash',
      title: 'Nível de Lixo',
      value: `${telemetry.trashLevel} %`,
      icon: Trash2,
      color: 'text-purple-400',
      borderColor: 'border-purple-500/20',
      sub: `${telemetry.trashWeightKg} kg aproximado`,
      metricKey: 'trashLevel' as const
    },
    {
      id: 'battery',
      title: 'Bateria',
      value: `${telemetry.batteryLevel} %`,
      icon: Battery,
      color: 'text-green-400',
      borderColor: 'border-green-500/20',
      sub: `${telemetry.batteryVoltage} V (Lítio 3S)`
    }
  ];

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl">
        <div>
          <h3 className="text-sm font-bold text-white">Telemetria de Sensores</h3>
          <p className="text-xs text-slate-400">Leituras IoT em tempo real</p>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          Live 1Hz
        </span>
      </div>

      {/* Grid of 6 Sensor Cards */}
      <div className="grid grid-cols-2 gap-3">
        {sensorCards.map((card, idx) => {
          const IconComponent = card.icon;
          const isSelectable = !!card.metricKey;
          const isSelected = card.metricKey === selectedMetric;

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => {
                if (card.metricKey) setSelectedMetric(card.metricKey);
              }}
              className={`p-3.5 rounded-2xl bg-slate-900/90 border backdrop-blur-xl transition-all ${
                isSelected
                  ? 'border-emerald-400 bg-emerald-950/20 ring-1 ring-emerald-400/40 shadow-lg'
                  : `${card.borderColor} hover:border-white/20`
              } ${isSelectable ? 'cursor-pointer' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <IconComponent className={`w-5 h-5 ${card.color}`} />
                {isSelectable && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    {isSelected ? '● Gráfico' : 'Ver'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-medium">{card.title}</p>
              <p className="text-xl font-bold text-white font-mono mt-0.5">{card.value}</p>
              <p className="text-[10px] text-slate-400 mt-1 truncate">{card.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Telemetry Chart Section */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChartIcon className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Histórico do Sensor: {selectedMetric}
            </span>
          </div>
          <div className="flex gap-1 text-[10px] font-mono">
            {(['trashLevel', 'temperature', 'gasPpm', 'humidity'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMetric(m)}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  selectedMetric === m
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m === 'trashLevel' ? 'Lixo' : m === 'temperature' ? 'Temp' : m === 'gasPpm' ? 'Gás' : 'Umid'}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#10b981',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorMetric)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
