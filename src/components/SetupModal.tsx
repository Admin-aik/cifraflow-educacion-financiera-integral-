import React, { useState } from 'react';
import {
  User,
  Trophy,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  CreditCard,
  Wallet,
  Shield,
  Zap,
} from 'lucide-react';
import { ARCHETYPES, DREAM_GOALS } from '../data/gameData';
import { CharacterArchetype, DreamGoal } from '../types';

interface SetupModalProps {
  onStartGame: (archetype: CharacterArchetype, dream: DreamGoal) => void;
}

export const SetupModal: React.FC<SetupModalProps> = ({ onStartGame }) => {
  const [selectedArchetypeIndex, setSelectedArchetypeIndex] = useState(0);
  const [selectedDreamIndex, setSelectedDreamIndex] = useState(0);
  const [step, setStep] = useState<'ARCHETYPE' | 'DREAM'>('ARCHETYPE');

  const curArchetype = ARCHETYPES[selectedArchetypeIndex];
  const curDream = DREAM_GOALS[selectedDreamIndex];

  const totalStartingExpenses = Object.values(curArchetype.startingExpenses).reduce((a, b) => a + b, 0);
  const startingNetCashflow = curArchetype.startingSalary - totalStartingExpenses;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl shadow-cyan-950/60 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xl shadow-lg shadow-cyan-500/30">
              ⚡
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-white tracking-wide uppercase font-mono">
                CIFRAFLOW 2050
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Motor de Educación Financiera 3D Cyberpunk
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span
              className={`px-3 py-1 rounded-full border ${
                step === 'ARCHETYPE'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                  : 'bg-slate-800 text-slate-500 border-slate-700'
              }`}
            >
              1. ARQUETIPO
            </span>
            <span
              className={`px-3 py-1 rounded-full border ${
                step === 'DREAM'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold'
                  : 'bg-slate-800 text-slate-500 border-slate-700'
              }`}
            >
              2. META SOÑADA
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {step === 'ARCHETYPE' ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-mono uppercase text-slate-400 font-bold tracking-wider mb-3">
                  SELECCIONA TU ARQUETIPO NATIVO DIGITAL
                </h2>
                {/* Archetype Cards Carousel */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {ARCHETYPES.map((arch, idx) => {
                    const isSelected = idx === selectedArchetypeIndex;
                    return (
                      <button
                        key={arch.id}
                        onClick={() => setSelectedArchetypeIndex(idx)}
                        className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                          isSelected
                            ? 'bg-cyan-950/60 border-cyan-400 shadow-lg shadow-cyan-950/60 scale-105'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                        }`}
                      >
                        <div className="text-3xl p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                          {arch.avatar}
                        </div>
                        <div>
                          <div className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                            {arch.title}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[90px]">{arch.role}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Archetype Financials Breakdown */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{curArchetype.avatar}</span>
                      <span>{curArchetype.title}</span>
                      <span className="text-xs font-mono text-cyan-400 font-normal">({curArchetype.role})</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{curArchetype.bio}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 font-mono uppercase">Ahorros Iniciales</div>
                    <div className="text-sm sm:text-base font-mono font-extrabold text-emerald-400">
                      ${curArchetype.startingSavings.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Salario Mensual</div>
                    <div className="text-sm font-bold text-white">${curArchetype.startingSalary.toLocaleString()}/mes</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Gastos Mensuales</div>
                    <div className="text-sm font-bold text-rose-400">-${totalStartingExpenses.toLocaleString()}/mes</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/30">
                    <div className="text-[10px] text-cyan-400 uppercase">Flujo de Caja Neto Inicial</div>
                    <div className="text-sm font-bold text-cyan-300">
                      +${startingNetCashflow.toLocaleString()}/mes
                    </div>
                  </div>
                </div>

                {/* Educational Insight for this role */}
                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-slate-300 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>
                    💡 <strong>Lección Financiera:</strong> {curArchetype.title} comienza con $
                    {(curArchetype.startingLiabilities.creditCardDebt +
                      curArchetype.startingLiabilities.carLoan +
                      curArchetype.startingLiabilities.studentLoan).toLocaleString()}{' '}
                    en deuda total. ¡Liquidar la deuda de tarjeta de crédito liberará flujo mensual para adquirir activos!
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-mono uppercase text-slate-400 font-bold tracking-wider mb-3">
                  ELIGE TU META SOÑADA EN LA VÍA RÁPIDA
                </h2>
                <p className="text-xs text-slate-400 mb-4">
                  Una vez que escapes de la Carrera de Ratas, caer en tu Meta Soñada elegida con el capital necesario te dará la ¡VICTORIA TOTAL!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {DREAM_GOALS.map((dream, idx) => {
                    const isSelected = idx === selectedDreamIndex;
                    return (
                      <button
                        key={dream.id}
                        onClick={() => setSelectedDreamIndex(idx)}
                        className={`p-4 rounded-2xl border text-left space-y-2 transition-all ${
                          isSelected
                            ? 'bg-purple-950/50 border-purple-400 shadow-xl shadow-purple-950/50 scale-[1.02]'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{dream.icon}</span>
                          <span className="text-xs font-mono font-bold text-purple-400">
                            ${dream.cost.toLocaleString()}
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-sm">{dream.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{dream.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          {step === 'DREAM' ? (
            <button
              onClick={() => setStep('ARCHETYPE')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>VOLVER AL ARQUETIPO</span>
            </button>
          ) : (
            <div className="text-xs text-slate-500 font-mono">Escape: Ingreso Pasivo &gt; Gastos Totales</div>
          )}

          {step === 'ARCHETYPE' ? (
            <button
              onClick={() => setStep('DREAM')}
              id="proceed-to-dream-btn"
              className="px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-lg shadow-cyan-500/30 flex items-center gap-2 active:scale-95 transition-all"
            >
              <span>SIGUIENTE: ELEGIR META</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onStartGame(curArchetype, curDream)}
              id="start-game-btn"
              className="px-6 py-2.5 rounded-xl font-mono text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 hover:scale-105 text-slate-950 shadow-xl shadow-cyan-500/30 flex items-center gap-2 active:scale-95 transition-all"
            >
              <span>COMENZAR PARTIDA</span>
              <Zap className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
