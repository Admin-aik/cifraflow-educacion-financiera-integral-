import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, HelpCircle, Loader2, ArrowLeft } from 'lucide-react';
import { GameState } from '../types';

interface AIMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
}

export const AIMentorModal: React.FC<AIMentorModalProps> = ({ isOpen, onClose, gameState }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'mentor' | 'player'; text: string; source?: string }>>([
    {
      sender: 'mentor',
      text: `👋 ¡Saludos! Soy **CyberKiyosaki**, tu Mentor Financiero con Inteligencia Artificial. Tu efectivo disponible actual es de **$${gameState.financials.cash.toLocaleString()}**, y tu ingreso pasivo mensual es de **$${gameState.financials.passiveIncome}/mes** frente a **$${gameState.financials.totalExpenses}/mes** de gastos de vida. ¡Pregúntame cualquier duda sobre tu estrategia, inversiones o cómo escapar de la carrera de ratas!`,
      source: 'initial',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || query;
    if (!q.trim() || isLoading) return;

    const newMessages = [...messages, { sender: 'player' as const, text: q }];
    setMessages(newMessages);
    setQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerState: gameState,
          query: q,
          context: `El jugador está en el turno #${gameState.turnCount} (${gameState.isOnFastTrack ? 'VÍA RÁPIDA' : 'CARRERA DE RATAS'}). Activos que posee: ${gameState.assets.map((a) => a.name).join(', ') || 'Ninguno'}. Pasivos/Deudas: ${gameState.liabilities.map((l) => `${l.name} ($${l.principalBalance})`).join(', ') || 'Ninguno'}.`,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: 'mentor',
          text: data.advice || '¡Continúa enfocándote en generar flujo de caja mensual positivo y liquidar deudas de alto interés!',
          source: data.source,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'mentor',
          text: '💡 Consejo Táctico: Adquiere activos que pongan dinero en tu bolsillo cada mes. ¡Cuando tu ingreso pasivo supere tus gastos de vida, habrás ganado la carrera de ratas!',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'Evalúa mi estrategia de balance actual',
    '¿Debería pagar mis deudas primero o comprar activos?',
    '¿Qué es el retorno sobre efectivo (ROI) y cómo se calcula?',
    '¿Cómo uso la deuda buena vs deuda mala a mi favor?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl h-[560px] rounded-2xl bg-slate-900 border border-purple-500/40 shadow-2xl shadow-purple-950/60 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide">CYBERKIYOSAKI IA</h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-purple-950 text-purple-300 border border-purple-500/30">
                  GEMINI 2.5 FLASH
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">Asesor Financiero Táctico en Vivo</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono font-bold transition-colors"
              title="Volver a la pantalla del juego"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Volver</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === 'player' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-xl leading-relaxed whitespace-pre-wrap ${
                  m.sender === 'player'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                    : 'bg-slate-950 border border-purple-500/30 text-slate-200 shadow-md'
                }`}
              >
                {m.sender === 'mentor' && (
                  <div className="flex items-center gap-1 text-[10px] text-purple-400 font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5" /> CYBERKIYOSAKI
                  </div>
                )}
                {m.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="p-3 rounded-xl bg-slate-950 border border-purple-500/30 text-purple-300 flex items-center gap-2 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                <span>CyberKiyosaki está analizando tu balance general...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px] font-mono no-scrollbar">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 text-slate-400 hover:text-purple-300 whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Escribe una pregunta financiera..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !query.trim()}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
