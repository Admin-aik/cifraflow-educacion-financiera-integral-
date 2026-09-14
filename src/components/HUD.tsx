import React from 'react';
import {
  Wallet,
  TrendingUp,
  CreditCard,
  Sparkles,
  Volume2,
  VolumeX,
  FileText,
  Bot,
  Dices,
  RotateCcw,
  Compass,
  Zap,
} from 'lucide-react';
import { GameState } from '../types';

interface HUDProps {
  gameState: GameState;
  onRollDice: () => void;
  onOpenFinancialSheet: () => void;
  onOpenAIMentor: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
  onResetGame: () => void;
  cameraMode: 'isometric' | 'topdown' | 'follow';
  setCameraMode: (mode: 'isometric' | 'topdown' | 'follow') => void;
}

export const HUD: React.FC<HUDProps> = ({
  gameState,
  onRollDice,
  onOpenFinancialSheet,
  onOpenAIMentor,
  onToggleMute,
  isMuted,
  onResetGame,
  cameraMode,
  setCameraMode,
}) => {
  const { financials, isOnFastTrack, isRolling, diceResult, charityTurnsRemaining, selectedArchetype } = gameState;

  // Calculate Freedom Ratio (% of expenses covered by passive income)
  const freedomRatio = Math.min(100, Math.round((financials.passiveIncome / Math.max(1, financials.totalExpenses)) * 100));
  const canEscape = financials.passiveIncome >= financials.totalExpenses && !isOnFastTrack;

  return (
    <header className="w-full flex flex-col gap-3">
      {/* Top Navbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-cyan-500/20 backdrop-blur-xl shadow-xl">
        {/* Brand & Archetype */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xl shadow-lg shadow-cyan-500/30">
            {selectedArchetype?.avatar || '⚡'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white tracking-wide">CIFRAFLOW 2050</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-950 text-cyan-400 border border-cyan-500/40">
                {isOnFastTrack ? 'VÍA RÁPIDA' : 'CIRCUITO FINANCIERO'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {selectedArchetype?.title} • <span className="text-slate-500">{selectedArchetype?.role}</span>
            </p>
          </div>
        </div>

        {/* Core Financial Tickers */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {/* Cash on Hand */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-emerald-500/30">
            <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Efectivo Disponible</div>
              <div className="text-sm sm:text-base font-extrabold font-mono text-emerald-400">
                ${financials.cash.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Monthly Cashflow */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-cyan-500/30">
            <div className="p-1 rounded-md bg-cyan-500/10 text-cyan-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Flujo de Caja Mensual</div>
              <div
                className={`text-sm sm:text-base font-extrabold font-mono ${
                  financials.monthlyCashflow >= 0 ? 'text-cyan-400' : 'text-rose-400'
                }`}
              >
                {financials.monthlyCashflow >= 0 ? '+' : ''}${financials.monthlyCashflow.toLocaleString()}/mes
              </div>
            </div>
          </div>

          {/* Passive Income Freedom Meter */}
          <div className="hidden md:flex flex-col gap-1 min-w-[160px] px-3 py-1.5 rounded-xl bg-slate-950/70 border border-purple-500/30">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1 text-purple-300">
                <Sparkles className="w-3 h-3" /> Medidor de Libertad
              </span>
              <span className="font-bold text-white">{freedomRatio}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  canEscape
                    ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 animate-pulse'
                    : 'bg-gradient-to-r from-purple-500 to-cyan-500'
                }`}
                style={{ width: `${freedomRatio}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-slate-500">
              <span>Pasivo: ${financials.passiveIncome}/mes</span>
              <span>Gastos: ${financials.totalExpenses}/mes</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* AI Mentor Button */}
          <button
            onClick={onOpenAIMentor}
            id="ai-mentor-hud-btn"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/50 hover:to-pink-600/50 border border-purple-500/50 text-purple-200 text-xs font-semibold shadow-lg shadow-purple-900/30 transition-all active:scale-95"
            title="Consultar al Mentor IA CyberKiyosaki"
          >
            <Bot className="w-4 h-4 text-purple-400 animate-bounce" />
            <span className="hidden sm:inline">Mentor IA</span>
          </button>

          {/* Financial Sheet Drawer Toggle */}
          <button
            onClick={onOpenFinancialSheet}
            id="financial-sheet-hud-btn"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/50 text-slate-200 text-xs font-semibold shadow-md transition-all active:scale-95"
            title="Ver Balance General y Estado de Flujo"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Finanzas</span>
          </button>

          {/* Camera Preset Switcher */}
          <div className="hidden sm:flex items-center rounded-xl bg-slate-950/80 p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setCameraMode('isometric')}
              className={`px-2 py-1 rounded-lg transition-colors ${
                cameraMode === 'isometric' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Vista Isométrica 3D"
            >
              3D
            </button>
            <button
              onClick={() => setCameraMode('topdown')}
              className={`px-2 py-1 rounded-lg transition-colors ${
                cameraMode === 'topdown' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Vista Superior 2D"
            >
              2D
            </button>
            <button
              onClick={() => setCameraMode('follow')}
              className={`px-2 py-1 rounded-lg transition-colors ${
                cameraMode === 'follow' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Cámara de Seguimiento"
            >
              Cam
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
            title={isMuted ? 'Activar Efectos' : 'Silenciar Efectos'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* New Game */}
          <button
            onClick={onResetGame}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/50 text-slate-400 hover:text-rose-300 transition-colors"
            title="Reiniciar Partida"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Game Control Bar (Dice Roll & Turn Actions) */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-slate-950/95 border border-cyan-500/30 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300">
            <span className="text-slate-500">TURNO:</span>
            <span className="font-bold text-cyan-400">#{gameState.turnCount}</span>
          </div>

          {charityTurnsRemaining > 0 && (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-pink-950/60 border border-pink-500/40 text-xs font-mono text-pink-300 animate-pulse">
              <Zap className="w-3.5 h-3.5 text-pink-400" />
              <span>DONACIÓN ACTIVA: 2 DADOS ({charityTurnsRemaining} restantes)</span>
            </div>
          )}

          {canEscape && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-xs font-mono text-emerald-300 shadow-lg shadow-emerald-900/50 animate-bounce">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>¡CRITERIO DE ESCAPE CUMPLIDO! ABRE FINANZAS PARA ASCENDER</span>
            </div>
          )}
        </div>

        {/* Dice Result & Roll Button */}
        <div className="flex items-center gap-3 ml-auto">
          {diceResult.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-cyan-500/40 font-mono text-sm font-bold text-cyan-300">
              <span>DADOS:</span>
              <span className="text-white text-base">
                {diceResult.join(' + ')} = {diceResult.reduce((a, b) => a + b, 0)}
              </span>
            </div>
          )}

          <button
            onClick={onRollDice}
            disabled={isRolling || gameState.activeModal !== null}
            id="roll-dice-btn"
            className={`group relative flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-bold font-mono tracking-wider uppercase transition-all shadow-xl ${
              isRolling || gameState.activeModal !== null
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-95'
            }`}
          >
            <Dices className={`w-5 h-5 ${isRolling ? 'animate-spin text-cyan-400' : 'group-hover:rotate-45 transition-transform'}`} />
            <span>{isRolling ? 'LANZANDO...' : 'TIRAR DADOS'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
