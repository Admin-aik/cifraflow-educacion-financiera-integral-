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
    sound.speakGameOverReto();
  }, []);

  const handleReplayVoice = () => {
    sound.playClick();
    sound.speak('GAME OVER. Fin de este reto, vamos al siguiente.');
  };

  const netRetoPoints = pointsEarnedInReto - penaltiesInReto;

  return (
    <div
      id="transition-phase-4"
      className="min-h-[calc(100vh-100px)] flex items-center justify-center p-4 sm:p-6"
      style={{ fontSize: `${textScale * 100}%` }}
    >
      <div className="w-full max-w-xl rounded-3xl bg-slate-900/95 border-2 border-cyan-400/80 shadow-2xl shadow-cyan-950/80 p-6 sm:p-8 text-center space-y-6 backdrop-blur-2xl animate-in zoom-in-95 duration-300">
        {/* BANNER OBLIGATORIO */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>TRANSICIÓN TÁCTICA DE NIVEL</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono uppercase tracking-tight text-white drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]">
            GAME OVER
          </h2>

          <p className="text-sm sm:text-base font-mono font-bold text-cyan-300">
            "Fin de este reto, vamos al siguiente."
          </p>
        </div>

        {/* Challenge Completed Badge */}
        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300">
          <span className="text-slate-500 block mb-0.5">RETO SUPERADO:</span>
          <strong className="text-white text-sm">{completedTopic}</strong>
        </div>

        {/* Desglose de Puntos Sumados en Este Reto */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono">
            <span className="text-[10px] text-slate-400 block">BASE ACIERTO</span>
            <span className="text-sm sm:text-base font-bold text-emerald-400">
              +{pointsEarnedInReto}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono">
            <span className="text-[10px] text-slate-400 block">DEDUCCIÓN FALLOS</span>
            <span className="text-sm sm:text-base font-bold text-rose-400">
              -{penaltiesInReto}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono">
            <span className="text-[10px] text-slate-400 block">NETO DEL RETO</span>
            <span
              className={`text-sm sm:text-base font-black ${
                netRetoPoints >= 0 ? 'text-cyan-300' : 'text-rose-400'
              }`}
            >
              {netRetoPoints >= 0 ? `+${netRetoPoints}` : netRetoPoints}
            </span>
          </div>
        </div>

        {/* Total Acumulado Global en el HUD */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/40 font-mono space-y-1">
          <span className="text-xs text-slate-400">PUNTUACIÓN GLOBAL ACUMULADA EN TELEMETRÍA:</span>
          <div className="text-3xl sm:text-4xl font-black text-cyan-300">
            {scoreState.currentScore > 0 ? `+${scoreState.currentScore}` : scoreState.currentScore} PTS
          </div>
          <p className="text-[10px] text-slate-400">
            {selectedAvatar.name} • {selectedAvatar.badge}
          </p>
        </div>

        {/* Voice replay button */}
        <div className="flex justify-center">
          <button
            onClick={handleReplayVoice}
            className="flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-white transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Repetir locución de audio</span>
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
