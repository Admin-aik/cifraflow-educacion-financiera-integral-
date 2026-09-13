import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, RotateCcw, Award, TrendingUp, DollarSign, ArrowLeft, X } from 'lucide-react';
import { GameState } from '../types';

interface VictoryModalProps {
  gameState: GameState;
  onRestart: () => void;
  onClose?: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ gameState, onRestart, onClose }) => {
  useEffect(() => {
    // Blast confetti fireworks on victory
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  const { financials, assets, turnCount, selectedArchetype, selectedDream, winReason } = gameState;
  const totalAssetValue = assets.reduce((sum, a) => sum + a.cost, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in zoom-in-95">
      <div className="w-full max-w-xl rounded-3xl bg-slate-900 border-2 border-emerald-400 shadow-2xl shadow-emerald-500/50 p-6 sm:p-8 text-center space-y-6 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Volver a la pantalla del tablero"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Trophy icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-yellow-400 via-emerald-400 to-cyan-400 flex items-center justify-center text-4xl shadow-xl shadow-yellow-400/30 animate-bounce">
          🏆
        </div>

        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/40">
            LIBERTAD FINANCIERA ALCANZADA
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-mono tracking-wide">
            ¡GANASTE CIFRAFLOW 2050!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-mono">
            {winReason || `¡Adquiriste con éxito tu meta soñada: ${selectedDream?.title}!`}
          </p>
        </div>

        {/* Financial IQ Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs text-left">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Efectivo Final</div>
            <div className="text-sm font-extrabold text-emerald-400">
              ${financials.cash.toLocaleString()}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Ingreso Pasivo</div>
            <div className="text-sm font-extrabold text-cyan-400">
              +${financials.passiveIncome.toLocaleString()}/mes
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Turnos Totales</div>
            <div className="text-sm font-extrabold text-purple-400">{turnCount} Turnos</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Activos Obtenidos</div>
            <div className="text-sm font-extrabold text-white">{assets.length} Activos Digitales</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 sm:col-span-2">
            <div className="text-[10px] text-slate-400 uppercase">Calificación IQ Financiero</div>
            <div className="text-sm font-extrabold text-amber-400 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>MAESTRO DEL FLUJO DE CAJA (NOTA A+)</span>
            </div>
          </div>
        </div>

        {/* Rich Dad takeaway message */}
        <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-slate-300 text-left space-y-1.5">
          <div className="font-bold text-purple-300 font-mono flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> LECCIONES CLAVE PARA LA VIDA REAL:
          </div>
          <p className="leading-relaxed">
            1. <strong>No trabajes por dinero — haz que el dinero trabaje para ti</strong> mediante activos que generen flujo de caja constante.
            <br />
            2. <strong>Controla tus pasivos:</strong> Liquida deudas con altas tasas de interés y evita gastos impulsivos o caprichos.
            <br />
            3. <strong>El flujo de caja es el rey:</strong> La plusvalía es buena, ¡pero el flujo de caja recurrente es lo que te da verdadera libertad!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              id="return-to-board-btn"
              className="w-full sm:w-1/2 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>VOLVER AL TABLERO</span>
            </button>
          )}

          <button
            onClick={onRestart}
            id="play-again-btn"
            className={`${onClose ? 'w-full sm:w-1/2' : 'w-full'} py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>NUEVA PARTIDA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
