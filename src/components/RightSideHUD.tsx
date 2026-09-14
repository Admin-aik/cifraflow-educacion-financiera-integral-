import React, { useState } from 'react';
import {
  Award,
  Zap,
  AlertTriangle,
  Shield,
  TrendingUp,
  Flame,
  Minus,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  MinusCircle,
} from 'lucide-react';
import { ScoreState, TeenAvatar } from '../types';
import { sound } from '../utils/audio';

interface RightSideHUDProps {
  scoreState: ScoreState;
  selectedAvatar: TeenAvatar | null;
  cashBalance?: number;
  currentLevelName?: string;
  onOpenQuickSummary?: () => void;
}

export const RightSideHUD: React.FC<RightSideHUDProps> = ({
  scoreState,
  selectedAvatar,
  cashBalance,
  currentLevelName = 'Reto Activo',
  onOpenQuickSummary,
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const isNegative = scoreState.currentScore < 0;

  const toggleMinimize = () => {
    sound.playClick();
    setIsMinimized((prev) => !prev);
  };

  const positivePts = scoreState.positivePoints ?? 0;
  const negativePts = scoreState.negativePoints ?? 0;

  // Render Minimized Floating Pill
  if (isMinimized) {
    return (
      <aside
        id="right_hud_panel_minimized"
        className="fixed top-16 right-3 sm:right-6 z-30 pointer-events-auto"
      >
        <button
          onClick={toggleMinimize}
          className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl backdrop-blur-xl border font-mono shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer ${
            isNegative
              ? 'bg-rose-950/90 border-rose-500/80 text-rose-300 shadow-rose-950/60'
              : 'bg-slate-900/90 border-cyan-400 text-cyan-300 shadow-cyan-950/60'
          }`}
          title="Clic para desplegar el Tablero de Puntuación y Balance"
        >
          {selectedAvatar && (
            <div
              className="w-6 h-6 rounded-md overflow-hidden shrink-0 border"
              style={{ borderColor: selectedAvatar.glowColor }}
            >
              {selectedAvatar.imageUrl ? (
                <img
                  src={selectedAvatar.imageUrl}
                  alt={selectedAvatar.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs">{selectedAvatar.avatarIcon}</span>
              )}
            </div>
          )}

          <Zap className={`w-3.5 h-3.5 ${isNegative ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`} />
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span className="text-slate-400 text-[10px]">PUNTOS:</span>
            <span className={`text-xs sm:text-sm font-black ${isNegative ? 'text-rose-400' : 'text-cyan-300'}`}>
              {scoreState.currentScore > 0 ? `+${scoreState.currentScore}` : scoreState.currentScore} PTS
            </span>
          </div>

          {cashBalance !== undefined && (
            <div className="flex items-center gap-1 text-[11px] pl-2 border-l border-slate-700 text-emerald-400 font-black">
              <span>BAL:</span>
              <span>${cashBalance.toLocaleString()}</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-[10px] pl-1.5 border-l border-slate-700 hidden sm:flex">
            <span className="text-emerald-400">+{scoreState.totalHits}</span>
            <span className="text-slate-500">/</span>
            <span className="text-rose-400">-{scoreState.totalErrors}</span>
          </div>

          <Maximize2 className="w-3.5 h-3.5 ml-1 text-slate-400 hover:text-white" />
        </button>
      </aside>
    );
  }

  // Render Full Expanded Scoreboard
  return (
    <aside
      id="right_hud_panel"
      className="fixed top-16 right-3 sm:right-6 z-30 w-52 sm:w-64 pointer-events-auto animate-in fade-in zoom-in-95 duration-200"
    >
      <div
        className={`rounded-2xl p-3 sm:p-3.5 backdrop-blur-xl border transition-all duration-300 shadow-2xl ${
          isNegative
            ? 'bg-rose-950/85 border-rose-500/80 shadow-rose-900/60 animate-pulse'
            : 'bg-slate-900/90 border-cyan-500/40 shadow-cyan-950/50'
        }`}
      >
        {/* Header Title with Minimize Button */}
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-1.5 mb-2">
          <div className="flex items-center gap-1.5">
            <Zap className={`w-3.5 h-3.5 ${isNegative ? 'text-rose-400' : 'text-cyan-400'}`} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
              TABLERO DE PUNTOS
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                isNegative ? 'bg-rose-500/30 text-rose-300' : 'bg-cyan-500/20 text-cyan-300'
              }`}
            >
              {isNegative ? 'DÉFICIT' : 'ACTIVO'}
            </span>

            {/* Minimize Toggle Button */}
            <button
              onClick={toggleMinimize}
              id="minimize-hud-btn"
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Minimizar tablero"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Big Net Score Display (Supports Negative Numbers) */}
        <div className="text-center py-1">
          <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 block mb-0.5 uppercase tracking-wider">
            PUNTUACIÓN GLOBAL NETA
          </span>
          <div
            className={`text-2xl sm:text-3xl font-mono font-black tracking-tight ${
              isNegative
                ? 'text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]'
                : 'text-cyan-300 drop-shadow-[0_0_10px_rgba(0,243,255,0.6)]'
            }`}
          >
            {scoreState.currentScore > 0 ? `+${scoreState.currentScore}` : scoreState.currentScore}
            <span className="text-xs ml-1 font-bold">PTS</span>
          </div>

          {isNegative && (
            <div className="flex items-center justify-center gap-1 mt-1 text-[10px] font-mono text-rose-300">
              <AlertTriangle className="w-3 h-3" />
              <span>Penalizaciones acumuladas</span>
            </div>
          )}
        </div>

        {/* Financial Cash Balance Bar */}
        {cashBalance !== undefined && (
          <div className="my-1.5 p-2 rounded-xl bg-slate-950/90 border border-emerald-500/40 font-mono flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-bold uppercase">BALANCE EFECTIVO:</span>
            <span className="font-black text-emerald-400 text-xs sm:text-sm">
              ${cashBalance.toLocaleString()}
            </span>
          </div>
        )}

        {/* Breakdown: Affirmative (+) and Negative (-) Points */}
        <div className="my-1.5 p-2 rounded-xl bg-slate-950/80 border border-slate-800 font-mono space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1 text-emerald-400 font-bold">
              <PlusCircle className="w-3 h-3" />
              <span>AFIRMATIVOS SUMADOS:</span>
            </div>
            <span className="font-black text-emerald-400">+{positivePts} PTS</span>
          </div>

          <div className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1 text-rose-400 font-bold">
              <MinusCircle className="w-3 h-3" />
              <span>NEGATIVOS RESTADOS:</span>
            </div>
            <span className="font-black text-rose-400">-{negativePts} PTS</span>
          </div>
        </div>

        {/* Stats Grid: Aciertos, Fallos, Racha */}
        <div className="grid grid-cols-3 gap-1 my-2 text-center font-mono">
          <div className="p-1 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-[8px] text-slate-400 block">ACIERTOS</span>
            <span className="text-xs font-bold text-emerald-400">{scoreState.totalHits}</span>
          </div>
          <div className="p-1 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-[8px] text-slate-400 block">FALLOS</span>
            <span className="text-xs font-bold text-rose-400">{scoreState.totalErrors}</span>
          </div>
          <div className="p-1 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-[8px] text-slate-400 block">RACHA</span>
            <div className="flex items-center justify-center gap-0.5 text-xs font-bold text-amber-400">
              <Flame className="w-2.5 h-2.5" />
              <span>{scoreState.streak}x</span>
            </div>
          </div>
        </div>

        {/* Selected Teen Avatar Badge with Caricature Image */}
        {selectedAvatar && (
          <div
            className="mt-2 pt-2 border-t border-slate-700/60 flex items-center gap-2 rounded-xl p-1.5 transition-colors"
            style={{
              backgroundColor: `${selectedAvatar.glowColor}15`,
              borderColor: `${selectedAvatar.glowColor}40`,
            }}
          >
            <div
              className="w-9 h-9 rounded-xl overflow-hidden shrink-0 shadow-md border"
              style={{
                borderColor: selectedAvatar.glowColor,
                backgroundColor: `${selectedAvatar.glowColor}25`,
              }}
            >
              {selectedAvatar.imageUrl ? (
                <img
                  src={selectedAvatar.imageUrl}
                  alt={selectedAvatar.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-bold">
                  {selectedAvatar.avatarIcon}
                </div>
              )}
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-[10px] font-bold text-white leading-tight truncate">
                {selectedAvatar.name}
              </p>
              <p
                className="text-[8px] font-mono font-bold uppercase truncate"
                style={{ color: selectedAvatar.glowColor }}
              >
                {selectedAvatar.perkTitle}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
