import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  Trophy,
  CheckCircle2,
  Shield,
  Download,
  Printer,
  RotateCcw,
  Gamepad2,
  Sparkles,
  ArrowRight,
  School,
  User,
} from 'lucide-react';
import { StudentProfile, TeenAvatar, ScoreState } from '../types';
import { sound } from '../utils/audio';

interface FinalEvaluationPhase5Props {
  studentProfile: StudentProfile;
  selectedAvatar: TeenAvatar;
  scoreState: ScoreState;
  onRestartAll: () => void;
  onOpen3DSimulator: () => void;
  textScale?: number;
}

export const FinalEvaluationPhase5: React.FC<FinalEvaluationPhase5Props> = ({
  studentProfile,
  selectedAvatar,
  scoreState,
  onRestartAll,
  onOpen3DSimulator,
  textScale = 1.0,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Blast confetti celebration
    sound.playLevelUp();
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
    });

    sound.speak(
      `¡Felicitaciones ${studentProfile.fullName}! Has completado con éxito la misión de CIFRA FLOW FINANCIERO.`
    );
  }, []);

  const totalAnswers = scoreState.totalHits + scoreState.totalErrors;
  const accuracyPercent =
    totalAnswers > 0 ? Math.round((scoreState.totalHits / totalAnswers) * 100) : 100;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('es-VE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div
      id="final-evaluation-phase-5"
      className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8"
      style={{ fontSize: `${textScale * 100}%` }}
    >
      {/* FIN DE LA MISIÓN Title Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider">
          <Trophy className="w-4 h-4 text-emerald-300" />
          <span>MISIÓN FORMATIVA COMPLETADA</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black font-mono uppercase text-white tracking-wide">
          FIN DE LA MISIÓN: SCORE CARD GENERAL
        </h1>
        <p className="text-xs sm:text-sm font-mono text-slate-300 max-w-xl mx-auto">
          Evaluación telemetría de competencias financieras, contratos, banca digital y ciberseguridad.
        </p>
      </div>

      {/* Stats KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/40 text-center font-mono">
          <span className="text-[10px] text-slate-400 uppercase block mb-1">PUNTUACIÓN FINAL</span>
          <div
            className={`text-2xl sm:text-3xl font-black ${
              scoreState.currentScore >= 0 ? 'text-cyan-300' : 'text-rose-400'
            }`}
          >
            {scoreState.currentScore > 0 ? `+${scoreState.currentScore}` : scoreState.currentScore}
          </div>
          <span className="text-[9px] text-slate-500">Puntos Netos</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/40 text-center font-mono">
          <span className="text-[10px] text-slate-400 uppercase block mb-1">PRECISIÓN DE AUDITORÍA</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            {accuracyPercent}%
          </div>
          <span className="text-[9px] text-slate-500">{scoreState.totalHits} Aciertos</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-rose-500/40 text-center font-mono">
          <span className="text-[10px] text-slate-400 uppercase block mb-1">FALLOS CORREGIDOS</span>
          <div className="text-2xl sm:text-3xl font-black text-rose-400">
            {scoreState.totalErrors}
          </div>
          <span className="text-[9px] text-slate-500">Reintentos asistidos</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/40 text-center font-mono">
          <span className="text-[10px] text-slate-400 uppercase block mb-1">AVATAR OPERADOR</span>
          <div className="text-sm font-bold text-amber-300 truncate">
            {selectedAvatar.name.split(' ')[0]}
          </div>
          <span className="text-[9px] text-amber-400/80 uppercase">{selectedAvatar.badge}</span>
        </div>
      </div>

      {/* OFICIAL: CERTIFICADO DIGITAL DE COMPETENCIAS FINANCIERAS */}
      <div
        ref={certificateRef}
        id="digital-competency-certificate"
        className="rounded-3xl bg-slate-950 border-4 border-amber-400/70 p-6 sm:p-10 relative overflow-hidden shadow-2xl shadow-amber-950/40 text-center space-y-6"
      >
        {/* Background Digital Certificate Watermark / Guilloche */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.06)_0%,transparent_70%)] pointer-events-none" />

        {/* Certificate Header with Logo */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-400 p-0.5 bg-slate-900 shadow-md">
            <img
              src="/src/assets/images/cifraflow_logo_1789305364181.jpg"
              alt="Logo CifraFlow"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase font-bold">
            REPÚBLICA BOLIVARIANA DE VENEZUELA • EDUCACIÓN FINANCIERA JUVENIL
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-wider font-serif">
            CERTIFICADO DIGITAL DE COMPETENCIAS
          </h2>
          <p className="text-xs font-mono text-slate-400 max-w-xl mx-auto">
            Por haber culminado con éxito la simulación integral en la plataforma <strong>CIFRA FLOW FINANCIERO</strong>
          </p>
        </div>

        {/* Certificate Recipient Information */}
        <div className="py-4 border-y border-amber-400/30 space-y-2 font-mono">
          <span className="text-xs text-slate-400 uppercase">Se otorga el presente reconocimiento a:</span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-300 uppercase tracking-wide">
            {studentProfile.fullName}
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300">
            <span>Cédula: <strong>{studentProfile.idNumber}</strong></span>
            <span>•</span>
            <span>Institución: <strong>{studentProfile.institution}</strong></span>
          </div>
        </div>

        {/* Competencies Breakdown */}
        <div className="text-xs font-mono text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Acreditado en: Comprensión Lectora de Contratos y TEA/CAT, Apertura Digital Bancaria (BDV/Plaza/Tesoro), Pago Móvil C2P, <span className="text-[#34d399] font-bold">Emprendimiento</span> (50/30/20 y SENIAT), Bolsa de Valores de Caracas (BVC / SUNAVAL) y Ciberseguridad FIDO2 / Zero Trust.
        </div>

        {/* Certificate Signatures & Security Stamp */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-800 text-left font-mono">
          <div className="space-y-1 text-center sm:text-left">
            <div className="w-32 border-b border-slate-600 mb-1 mx-auto sm:mx-0" />
            <span className="text-[10px] text-slate-400 block font-bold">DIRECCIÓN PEDAGÓGICA</span>
            <span className="text-[9px] text-slate-500">CIFRA FLOW FINANCIERO 2050</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-400 flex flex-col items-center justify-center text-[8px] font-bold text-amber-400 uppercase text-center p-1">
              <span>SELLO DIGITAL</span>
              <span className="text-[7px]">VERIFICADO</span>
            </div>
            <div className="text-[10px] text-slate-400">
              <p>Fecha: <strong>{currentDate}</strong></p>
              <p>Avatar Asesor: <strong>{selectedAvatar.name}</strong></p>
              <p className="text-emerald-400 font-bold">Score: {scoreState.currentScore} PTS</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions: Print Certificate, Open 3D Simulator, Restart */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={handlePrint}
          id="print-certificate-btn"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Printer className="w-4 h-4 text-cyan-400" />
          <span>IMPRIMIR / GUARDAR CERTIFICADO</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onRestartAll}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>NUEVA MISIÓN</span>
          </button>

          <button
            onClick={() => {
              sound.playLevelUp();
              onOpen3DSimulator();
            }}
            id="open-board-simulator-after-mission-btn"
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400 text-slate-950 font-mono text-xs font-black uppercase tracking-wider shadow-xl shadow-fuchsia-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>PROBAR EN TABLERO 3D</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
