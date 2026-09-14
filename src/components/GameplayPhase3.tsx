import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  HelpCircle,
  Volume2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  AlertTriangle,
  FileText,
  ShieldAlert,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { EducationalQuestion, EducationalOption, TeenAvatar, StudentProfile } from '../types';
import { sound } from '../utils/audio';

interface GameplayPhase3Props {
  question: EducationalQuestion;
  challengeNumber: number;
  totalChallenges: number;
  selectedAvatar: TeenAvatar;
  studentProfile: StudentProfile;
  onCorrectAnswer: (pointsEarned: number, errorsMade: number) => void;
  onWrongAnswerPenalty: (penalty: number) => void;
  onBackToModules: () => void;
  onAdvanceToTransition?: () => void;
  onOpenRuleta?: () => void;
  textScale?: number;
}

export const GameplayPhase3: React.FC<GameplayPhase3Props> = ({
  question,
  challengeNumber,
  totalChallenges,
  selectedAvatar,
  studentProfile,
  onCorrectAnswer,
  onWrongAnswerPenalty,
  onBackToModules,
  onAdvanceToTransition,
  onOpenRuleta,
  textScale = 1.0,
}) => {
  // Set of failed option IDs
  const [failedOptionIds, setFailedOptionIds] = useState<string[]>([]);
  // Was correct option chosen?
  const [solved, setSolved] = useState<boolean>(false);
  const [pointsAwarded, setPointsAwarded] = useState<boolean>(false);
  const [selectedCorrectOption, setSelectedCorrectOption] = useState<EducationalOption | null>(null);
  const [errorsInCurrentReto, setErrorsInCurrentReto] = useState<number>(0);
  const [lastFeedback, setLastFeedback] = useState<string>('');

  // Reset state whenever the question changes
  useEffect(() => {
    setFailedOptionIds([]);
    setSolved(false);
    setPointsAwarded(false);
    setSelectedCorrectOption(null);
    setErrorsInCurrentReto(0);
    setLastFeedback('');

    // Narration of the challenge question
    const timer = setTimeout(() => {
      sound.speak(`${question.topic}. ${question.question}`);
    }, 400);

    return () => clearTimeout(timer);
  }, [question.id]);

  const handleSelectOption = (option: EducationalOption) => {
    // If already solved or option already failed, ignore
    if (solved || failedOptionIds.includes(option.id)) return;

    if (option.isCorrect) {
      // ACIERTO: Únicamente al pulsar la opción correcta se ilumina en verde esmeralda
      sound.playAssetAcquired();
      setSolved(true);
      setSelectedCorrectOption(option);
      setLastFeedback(option.explanation);

      // Speak feedback in Latin American voice
      sound.speak(`¡Excelente! Respuesta afirmativa. ${option.explanation}`);

      // Calculate avatar bonus (e.g. +20 pts)
      const avatarBonus = selectedAvatar.bonusEffect ? 20 : 0;
      const netPoints = question.pointsReward + avatarBonus;

      if (!pointsAwarded) {
        setPointsAwarded(true);
        // Suman los puntos afirmativos y se incrementa el balance en tiempo real
        onCorrectAnswer(netPoints, errorsInCurrentReto);
      }
    } else {
      // ERROR:
      // 1. Se descuenta penalización en HUD derecho y balance (-25 a -50 pts)
      // 2. Opción queda deshabilitada y marcada como fallo
      // 3. LA RESPUESTA CORRECTA NUNCA SE MUESTRA NI SE ILUMINA EN VERDE ANTE UN ERROR
      // 4. El estudiante DEBE seguir intentando entre las opciones restantes
      sound.playDoodadPenalty();
      setFailedOptionIds((prev) => [...prev, option.id]);
      setErrorsInCurrentReto((prev) => prev + 1);
      setLastFeedback(option.explanation);

      onWrongAnswerPenalty(question.penaltyAmount);
      sound.speak(`Incorrecto. ${option.explanation}. Intenta con otra opción.`);
    }
  };

  const handleReadAgain = () => {
    sound.playClick();
    sound.speak(`${question.topic}. ${question.question}`);
  };

  const handleContinueToTransition = () => {
    if (!solved) return;
    sound.playClick();

    if (onAdvanceToTransition) {
      onAdvanceToTransition();
    } else {
      const avatarBonus = selectedAvatar.bonusEffect ? 20 : 0;
      const netPoints = question.pointsReward + avatarBonus;
      if (!pointsAwarded) {
        setPointsAwarded(true);
        onCorrectAnswer(netPoints, errorsInCurrentReto);
      }
    }
  };

  return (
    <div
      id="gameplay-phase-3"
      className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6"
      style={{ fontSize: `${textScale * 100}%` }}
    >
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl overflow-hidden border-2 shrink-0 shadow-md bg-slate-950"
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
              <div className="w-full h-full flex items-center justify-center text-xl">
                {selectedAvatar.avatarIcon}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-[10px] font-mono font-bold uppercase">
                FASE 3: RETO ACTIVO {challengeNumber} / {totalChallenges}
              </span>
              <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                Asesor: <strong className="text-white">{selectedAvatar.name}</strong>
              </span>
            </div>
            <p className="text-xs font-mono text-slate-300 mt-0.5">
              Módulo: <strong className="text-cyan-300">{question.moduleTitle}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenRuleta && (
            <button
              onClick={onOpenRuleta}
              id="open-ruleta-gameplay-btn"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400 text-slate-950 text-xs font-mono font-black uppercase tracking-wider transition-all shadow-lg shadow-rose-950/40 hover:scale-105 active:scale-95 cursor-pointer"
              title="Girar la Ruleta del Simulador"
            >
              <span>🎰 RULETA SIMULADOR</span>
            </button>
          )}

          <button
            onClick={handleReadAgain}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-mono font-bold transition-colors cursor-pointer"
            title="Escuchar locución del reto en audio"
          >
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">LEER EN VOZ ALTA</span>
          </button>

          <button
            onClick={onBackToModules}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono font-bold transition-colors border border-slate-700 cursor-pointer"
          >
            MÓDULOS
          </button>
        </div>
      </div>

      {/* Main Challenge Card */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-7 backdrop-blur-xl shadow-2xl space-y-5">
        {/* Topic Title and Rewards info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-base sm:text-xl font-black text-white tracking-wide">
            {question.topic}
          </h2>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
              +{question.pointsReward} PTS ACIERTO
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold">
              {question.penaltyAmount} PTS PENALIZACIÓN
            </span>
          </div>
        </div>

        {/* Context Document Box (Terminal / Contract Style) */}
        {question.contextDocument && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 font-mono text-xs sm:text-sm text-cyan-200/90 leading-relaxed shadow-inner space-y-1 relative">
            <div className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-1">
              <FileText className="w-3.5 h-3.5" />
              <span>DOCUMENTO DE CASO / EXPEDIENTE DE AUDITORÍA:</span>
            </div>
            <p className="whitespace-pre-line">{question.contextDocument}</p>
          </div>
        )}

        {/* Specific Question Prompt */}
        <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800">
          <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
            {question.question}
          </p>
        </div>

        {/* Error / Attempt Warning Banner */}
        {failedOptionIds.length > 0 && !solved && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/80 flex items-center gap-2 text-xs font-mono text-rose-300 animate-shake">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <strong>OPCIÓN INCORRECTA ({question.penaltyAmount} PTS).</strong> La respuesta correcta se mantiene confidencial. Por favor analiza el caso y selecciona entre las opciones restantes.
            </div>
          </div>
        )}

        {/* Feedback description for failed or successful selection */}
        {lastFeedback && (
          <div
            className={`p-3 rounded-xl border text-xs font-mono leading-relaxed transition-all ${
              solved
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                : 'bg-slate-950/70 border-slate-800 text-slate-300'
            }`}
          >
            <strong>DICTAMEN TÁCTICO:</strong> {lastFeedback}
          </div>
        )}

        {/* The 4 Options Buttons */}
        <div className="space-y-3 pt-2">
          {question.options.map((opt) => {
            const isFailed = failedOptionIds.includes(opt.id);
            const isCorrectAndSelected = solved && opt.isCorrect;

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt)}
                disabled={isFailed || solved}
                id={`option-${opt.id}`}
                className={`w-full p-4 rounded-2xl text-left font-mono text-xs sm:text-sm border-2 transition-all flex items-start justify-between gap-3 ${
                  isCorrectAndSelected
                    ? 'bg-emerald-950/90 border-emerald-400 text-white shadow-xl shadow-emerald-500/30 scale-[1.01]'
                    : isFailed
                    ? 'bg-rose-950/30 border-rose-900/60 text-slate-500 cursor-not-allowed line-through opacity-60'
                    : 'bg-slate-950/60 border-slate-800 hover:border-cyan-400/80 hover:bg-slate-900 text-slate-200 cursor-pointer active:scale-[0.99]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      isCorrectAndSelected
                        ? 'bg-emerald-400 text-slate-950'
                        : isFailed
                        ? 'bg-rose-950 text-rose-500 border border-rose-800'
                        : 'bg-slate-800 text-cyan-300'
                    }`}
                  >
                    {opt.id.toUpperCase()}
                  </span>
                  <span className="leading-relaxed">{opt.text}</span>
                </div>

                {isCorrectAndSelected && (
                  <div className="shrink-0 flex items-center gap-1 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="hidden sm:inline">CORRECTO</span>
                  </div>
                )}

                {isFailed && (
                  <div className="shrink-0 text-rose-500">
                    <XCircle className="w-5 h-5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Insight Card & Next Step Button (enabled only upon correct answer) */}
        {solved && (
          <div className="mt-6 pt-4 border-t border-slate-800 space-y-4 animate-in fade-in zoom-in-95">
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs font-mono space-y-1">
              <span className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                CONOCIMIENTO FINANCIERO CLAVE:
              </span>
              <p>{question.richInsight}</p>
            </div>

            <button
              onClick={handleContinueToTransition}
              id="advance-to-transition-btn"
              className="w-full py-4 rounded-2xl font-mono text-sm sm:text-base font-extrabold uppercase tracking-wider bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>AVANZAR A TRANSICIÓN ("GAME OVER DE RETO")</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
