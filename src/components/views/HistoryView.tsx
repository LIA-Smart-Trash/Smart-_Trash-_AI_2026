import React, { useState } from 'react';
import { motion } from 'motion/react';
import { History, MapPin, CheckCircle2, Battery, Wrench, Download, Search } from 'lucide-react';
import { CollectionLog } from '../../types';

interface HistoryViewProps {
  logs: CollectionLog[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({ logs }) => {
  const [filterTab, setFilterTab] = useState<'coletas' | 'rotas' | 'todas'>('coletas');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterTab === 'coletas') return matchesSearch && (log.type === 'coleta' || log.type === 'bateria');
    if (filterTab === 'rotas') return matchesSearch && (log.type === 'rota' || log.type === 'manutencao');
    return matchesSearch;
  });

  const getLogIcon = (type: CollectionLog['type']) => {
    switch (type) {
      case 'coleta':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'bateria':
        return <Battery className="w-4 h-4 text-green-400" />;
      case 'manutencao':
        return <Wrench className="w-4 h-4 text-amber-400" />;
      default:
        return <MapPin className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header & Filter Tabs */}
      <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Histórico de Atividades</h3>
          </div>
          <button
            onClick={() => alert('Relatório CSV exportado com sucesso!')}
            className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 hover:text-white hover:bg-white/10 flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
        </div>

        {/* Tab Pills matching screen 4 design */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-950 border border-white/5">
          <button
            onClick={() => setFilterTab('coletas')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filterTab === 'coletas'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Coletas
          </button>
          <button
            onClick={() => setFilterTab('rotas')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filterTab === 'rotas'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Rotas
          </button>
          <button
            onClick={() => setFilterTab('todas')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filterTab === 'todas'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todas
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por local ou nota..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
          />
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-2.5">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-white/5 text-slate-400 text-xs">
            Nenhum registro encontrado para esse filtro.
          </div>
        ) : (
          filteredLogs.map((log, idx) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl hover:border-emerald-500/30 transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                  {log.date} - {log.time}
                </span>
                <div className="flex items-center gap-1">
                  {getLogIcon(log.type)}
                  <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">
                    {log.type}
                  </span>
                </div>
              </div>

              <div className="text-xs text-white font-medium">
                {log.type === 'coleta' && `Coleta realizada • Nível: ${log.fillLevelBefore}%`}
                {log.type === 'bateria' && `Carga completa (100%)`}
                {log.type === 'manutencao' && `Manutenção do sistema realizada`}
                {log.type === 'rota' && `Navegação autônoma até o destino`}
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">Local: {log.location}</span>
              </div>

              {log.notes && (
                <p className="text-[10px] text-slate-400/80 bg-slate-950/50 p-2 rounded-lg border border-white/5 italic">
                  "{log.notes}"
                </p>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
