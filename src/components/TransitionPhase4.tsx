import React, { useEffect } from 'react';
import {
  Award,
  Zap,
  ArrowRight,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Volume2,
} from 'lucide-react';
import { TeenAvatar, StudentProfile, ScoreState } from '../types';
import { sound } from '../utils/audio';

interface TransitionPhase4Props {
  completedTopic: string;
  pointsEarnedInReto: number;
  penaltiesInReto: number;
  scoreState: ScoreState;
  selectedAvatar: TeenAvatar;
  isLastChallenge: boolean;
  onProceedNext: () => void;
  textScale?: number;
}

export const TransitionPhase4: React.FC<TransitionPhase4Props> = ({
  completedTopic,
  pointsEarnedInReto,
  penaltiesInReto,
  scoreState,
  selectedAvatar,
  isLastChallenge,
  onProceedNext,
  textScale = 1.0,
}) => {
  // Execute mandatory locution and sound
  useEffect(() => {
    sound.speakGameOverReto(scoreState.currentScore);
  }, [scoreState.currentScore]);

  const handleReplayVoice = () => {
    sound.playClick();
    sound.speak(`GAME OVER. Usted tiene ${scoreState.currentScore} puntos.`);
  };

  const netRetoPoints = pointsEarnedInReto - penaltiesInReto;
  const totalPositive = scoreState.positivePoints ?? 0;
  const totalNegative = scoreState.negativePoints ?? 0;

  return (
    <div
      id="transition-phase-4"
      className="min-h-[calc(100vh-100px)] flex items-center justify-center p-4 sm:p-6"
      style={{ fontSize: `${textScale * 100}%` }}
    >
      <div className="w-full max-w-xl rounded-3xl bg-slate-900/95 border-2 border-cyan-400/80 shadow-2xl shadow-cyan-950/80 p-6 sm:p-8 text-center space-y-5 backdrop-blur-2xl animate-in zoom-in-95 duration-300">
        {/* Avatar Caricature Portrait Celebrating */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden border-2 shadow-2xl bg-slate-950 relative group"
            style={{ borderColor: selectedAvatar.glowColor }}
          >
            {selectedAvatar.imageUrl ? (
              <img
                src={selectedAvatar.imageUrl}
                alt={selectedAvatar.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                {selectedAvatar.avatarIcon}
              </div>
            )}
          </div>
          <span className="text-xs font-mono text-slate-300 font-bold">
            Operador: <span className="text-white">{selectedAvatar.name}</span> ({selectedAvatar.badge})
          </span>
        </div>

        {/* BANNER OBLIGATORIO */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>NIVEL COMPLETADO CON RESPUESTA AFIRMATIVA</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono uppercase tracking-tight text-white drop-shadow-[0_0_20px_rgba(0,243,255,0.7)]">
            GAME OVER
          </h2>

          <div className="p-3.5 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 shadow-inner">
            <p className="text-base sm:text-xl font-mono font-black text-cyan-300">
              USTED TIENE{' '}
              <span className="text-white text-xl sm:text-2xl underline decoration-cyan-400">
                {scoreState.currentScore > 0 ? `+${scoreState.currentScore}` : scoreState.currentScore}
              </span>{' '}
              PUNTOS
            </p>
          </div>
        </div>

        {/* Challenge Completed Badge */}
        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300">
          <span className="text-slate-500 block mb-0.5">NIVEL / RETO SUPERADO:</span>
          <strong className="text-white text-sm">{completedTopic}</strong>
        </div>

        {/* Desglose Visible de Puntos Sumados y Restados en Pantalla */}
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 font-mono space-y-3">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
            BALANCE DE PUNTOS ACUMULADOS EN PANTALLA:
          </span>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center">
              <span className="text-[10px] text-emerald-400 font-bold block mb-0.5">
                (+) PUNTOS AFIRMATIVOS SUMADOS
              </span>
              <span className="text-xl sm:text-2xl font-black text-emerald-300">
                +{totalPositive} PTS
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">
                {scoreState.totalHits} Aciertos Afirmativos
              </span>
            </div>

            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-center">
              <span className="text-[10px] text-rose-400 font-bold block mb-0.5">
                (-) PUNTOS NEGATIVOS RESTADOS
              </span>
              <span className="text-xl sm:text-2xl font-black text-rose-400">
                -{totalNegative} PTS
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">
                {scoreState.totalErrors} Penalizaciones
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center justify-between text-xs">
            <span className="text-slate-300">PUNTUACIÓN GLOBAL FINAL:</span>
            <span className="font-black text-base text-cyan-300">
              {scoreState.currentScore > 0 ? `+${scoreState.currentScore}` : scoreState.currentScore} PTS
            </span>
          </div>
        </div>

        {/* Desglose de Este Reto Específico */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 font-mono">
            <span className="text-[9px] text-slate-400 block">ACIERTO NIVEL</span>
            <span className="text-xs sm:text-sm font-bold text-emerald-400">
              +{pointsEarnedInReto}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 font-mono">
            <span className="text-[9px] text-slate-400 block">PENALIZACIÓN</span>
            <span className="text-xs sm:text-sm font-bold text-rose-400">
              -{penaltiesInReto}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 font-mono">
            <span className="text-[9px] text-slate-400 block">NETO NIVEL</span>
            <span
              className={`text-xs sm:text-sm font-black ${
                netRetoPoints >= 0 ? 'text-cyan-300' : 'text-rose-400'
              }`}
            >
              {netRetoPoints >= 0 ? `+${netRetoPoints}` : netRetoPoints}
            </span>
          </div>
        </div>

        {/* Voice replay button */}
        <div className="flex justify-center">
          <button
            onClick={handleReplayVoice}
            className="flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-white transition-colors cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Repetir locución: "Game Over. Usted tiene {scoreState.currentScore} puntos."</span>
          </button>
        </div>

        {/* Proceed Next Challenge Button */}
        <button
          onClick={() => {
            sound.playLevelUp();
            onProceedNext();
          }}
          id="continue-to-next-challenge-btn"
          className="w-full py-4 rounded-2xl font-mono text-sm sm:text-base font-black uppercase tracking-wider bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 text-slate-950 shadow-xl shadow-cyan-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{isLastChallenge ? 'FINALIZAR MISIÓN & VER CERTIFICADO' : 'CONTINUAR AL SIGUIENTE RETO'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
