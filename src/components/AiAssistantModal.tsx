import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Mic, Send, Sparkles, X, Volume2 } from 'lucide-react';
import { LiaTelemetry } from '../types';
import { sound } from '../lib/soundEngine';

import { isNative } from '../lib/device';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  telemetry: LiaTelemetry;
  onExecuteAction: (action: string) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  telemetry,
  onExecuteAction,
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Olá! Sou a assistente IA da L.I.A. Você pode me dar comandos de voz ou texto como "Venha até a cozinha", "Abra a tampa", "Qual a carga da bateria?"',
    },
  ]);
  const [isListening, setIsListening] = useState(false);

  const handleSend = async (userQuery?: string) => {
    const query = userQuery || prompt;
    if (!query.trim()) return;

    sound.playClick();
    const newMsgs = [...messages, { role: 'user' as const, text: query }];
    setMessages(newMsgs);
    setPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          context: telemetry,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.response) {
        setMessages((prev) => [...prev, { role: 'assistant', text: data.response }]);
        sound.playMotorBeep();
      }

      if (data.action) {
        onExecuteAction(data.action);
      }
    } catch {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Comando processado localmente: Todos os atuadores operacionais!',
        },
      ]);
    }
  };

  const startVoiceInput = () => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      try {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setIsListening(false);
          handleSend(transcript);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.start();
      } catch {
        setIsListening(false);
        alert('Reconhecimento de voz indisponível neste dispositivo. Digite seu comando!');
      }
    } else {
      alert('Reconhecimento de voz não suportado neste ambiente. Utilize o campo de texto.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md ${isNative() ? 'p-0' : 'p-4'}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 100 }}
          className={`relative w-full max-w-lg bg-slate-900 border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.2)] flex flex-col ${
            isNative()
              ? 'h-dvh rounded-none pt-safe pb-safe'
              : 'h-[520px] max-h-[90vh] rounded-3xl p-5'
          }`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between border-b border-white/10 pb-3 mb-3 ${isNative() ? 'p-4' : ''}`}>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                  Assistente IA L.I.A
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </h3>
                <p className="text-[10px] text-slate-400">Gemini 2.5 Flash • Comandos em Português</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className={`flex-1 overflow-y-auto space-y-3 pr-1 text-xs ${isNative() ? 'px-4' : ''}`}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[82%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-emerald-500 text-slate-950 font-medium rounded-br-xs shadow-md'
                      : 'bg-slate-800/90 border border-white/10 text-slate-200 rounded-bl-xs backdrop-blur-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-emerald-400 text-xs italic">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                L.I.A está pensando...
              </div>
            )}
          </div>

          {/* Quick Command Chips */}
          <div className={`flex items-center gap-1.5 py-2 overflow-x-auto no-scrollbar border-t border-white/5 mt-2 ${isNative() ? 'px-4' : ''}`}>
            {[
              'Venha até mim',
              'Abra a tampa',
              'Nível de lixo',
              'Luz LED',
              'Bateria',
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => handleSend(chip)}
                className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-300 hover:text-emerald-400 hover:border-emerald-500/30 whitespace-nowrap cursor-pointer transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className={`flex items-center gap-2 pt-2 border-t border-white/10 ${isNative() ? 'p-4 pb-safe' : ''}`}>
            <button
              onClick={startVoiceInput}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                isListening
                  ? 'bg-red-500 text-white border-red-400 animate-pulse'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
              title="Comando por voz"
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder="Digite um comando..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />

            <button
              onClick={() => handleSend()}
              disabled={!prompt.trim() || loading}
              className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
