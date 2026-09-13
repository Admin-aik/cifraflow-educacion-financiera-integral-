import React from 'react';
import { Award, Zap, AlertTriangle, Shield, TrendingUp, Flame } from 'lucide-react';
import { ScoreState, TeenAvatar } from '../types';

interface RightSideHUDProps {
  scoreState: ScoreState;
  selectedAvatar: TeenAvatar | null;
  currentLevelName?: string;
  onOpenQuickSummary?: () => void;
}

export const RightSideHUD: React.FC<RightSideHUDProps> = ({
  scoreState,
  selectedAvatar,
  currentLevelName = 'Reto Activo',
  onOpenQuickSummary,
}) => {
  const isNegative = scoreState.currentScore < 0;

  return (
    <aside
      id="right_hud_panel"
      className="fixed top-16 right-3 sm:right-6 z-30 w-44 sm:w-56 pointer-events-auto"
    >
      <div
        className={`rounded-2xl p-3 sm:p-3.5 backdrop-blur-xl border transition-all duration-300 shadow-2xl ${
          isNegative
            ? 'bg-rose-950/80 border-rose-500/80 shadow-rose-900/60 animate-pulse'
            : 'bg-slate-900/85 border-cyan-500/40 shadow-cyan-950/50'
        }`}
      >
        {/* Header Title */}
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-1.5 mb-2">
          <div className="flex items-center gap-1.5">
            <Zap className={`w-3.5 h-3.5 ${isNegative ? 'text-rose-400' : 'text-cyan-400'}`} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
              TELEMETRÍA HUD
            </span>
          </div>
          <span
            className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
              isNegative ? 'bg-rose-500/30 text-rose-300' : 'bg-cyan-500/20 text-cyan-300'
            }`}
          >
            {isNegative ? 'DÉFICIT' : 'ACUMULADO'}
          </span>
        </div>

        {/* Big Score Display (Supports Negative Numbers) */}
        <div className="text-center py-1">
          <span className="text-[10px] font-mono text-slate-400 block mb-0.5">PUNTUACIÓN GLOBAL</span>
          <div
            className={`text-2xl sm:text-3xl font-mono font-black tracking-tight ${
              isNegative ? 'text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]' : 'text-cyan-300 drop-shadow-[0_0_10px_rgba(0,243,255,0.6)]'
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

        {/* Selected Teen Avatar Badge */}
        {selectedAvatar && (
          <div
            className="mt-2 pt-2 border-t border-slate-700/60 flex items-center gap-2 rounded-xl p-1.5 transition-colors"
            style={{
              backgroundColor: `${selectedAvatar.glowColor}15`,
              borderColor: `${selectedAvatar.glowColor}40`,
            }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold shadow-inner"
              style={{
                backgroundColor: `${selectedAvatar.glowColor}25`,
                color: selectedAvatar.glowColor,
                border: `1px solid ${selectedAvatar.glowColor}`,
              }}
            >
              {selectedAvatar.avatarIcon}
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
