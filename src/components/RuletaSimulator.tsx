import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Play,
  RotateCw,
  Award,
  ArrowRight,
  TrendingUp,
  Building2,
  Rocket,
  ShieldAlert,
  FileText,
  Zap,
  Shield,
  HelpCircle,
  Volume2,
} from 'lucide-react';
import { SIMULATOR_RULETA_STEPS } from '../data/cifraFlowData';
import { RuletaStep } from '../types';
import { sound } from '../utils/audio';

interface RuletaSimulatorProps {
  onSelectStep: (step: (typeof SIMULATOR_RULETA_STEPS)[0]) => void;
  onClose?: () => void;
  textScale?: number;
  initialStepIndex?: number;
}

export const RuletaSimulator: React.FC<RuletaSimulatorProps> = ({
  onSelectStep,
  onClose,
  textScale = 1.0,
  initialStepIndex,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [selectedStep, setSelectedStep] = useState<(typeof SIMULATOR_RULETA_STEPS)[0] | null>(
    initialStepIndex !== undefined ? SIMULATOR_RULETA_STEPS[initialStepIndex] || null : null
  );
  const [spinCount, setSpinCount] = useState(0);

  const steps = SIMULATOR_RULETA_STEPS;
  const numSlices = steps.length;
  const sliceAngle = 360 / numSlices;

  // Icons mapper
  const getStepIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'FileText':
        return <FileText className={className} />;
      case 'Building2':
        return <Building2 className={className} />;
      case 'Rocket':
        return <Rocket className={className} />;
      case 'TrendingUp':
        return <TrendingUp className={className} />;
      case 'ShieldAlert':
        return <ShieldAlert className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Shield':
        return <Shield className={className} />;
      default:
        return <Award className={className} />;
    }
  };

  const handleSpinRoulette = () => {
    if (isSpinning) return;

    sound.playDiceRoll();
    setIsSpinning(true);
    setSelectedStep(null);

    // Pick a random step or weighted step
    const chosenIndex = Math.floor(Math.random() * numSlices);
    
    // Calculate final rotation: multiple full rotations + angle to align with top pointer
    // The top pointer is at angle 270 deg (or 0 deg depending on orientation)
    // Slice center angle = (chosenIndex + 0.5) * sliceAngle
    const extraSpins = 5 + Math.floor(Math.random() * 3); // 5 to 7 full 360 rotations
    const targetSliceCenter = (chosenIndex + 0.5) * sliceAngle;
    
    // We want the target slice to stop at top (90 degrees or 270 depending on SVG layout)
    // In our SVG, slice 0 starts at angle -90 + (0 * sliceAngle)
    const finalAngle = rotationDegrees + (extraSpins * 360) + (360 - (targetSliceCenter % 360));

    setRotationDegrees(finalAngle);

    // Sound ticking effect while spinning
    let tickCount = 0;
    const maxTicks = 20;
    const interval = setInterval(() => {
      tickCount++;
      sound.playRuletaTick();
      if (tickCount >= maxTicks) {
        clearInterval(interval);
      }
    }, 120);

    // Animation timeout (matches CSS transition 3.5s)
    setTimeout(() => {
      clearInterval(interval);
      setIsSpinning(false);
      const landedStep = steps[chosenIndex];
      setSelectedStep(landedStep);
      setSpinCount((prev) => prev + 1);
      sound.playLevelUp();
      sound.speak(`¡Has obtenido ${landedStep.title}! Prepárate para las preguntas y respuestas.`);
    }, 3600);
  };

  const handleGoToQuestions = () => {
    if (!selectedStep) return;
    sound.playClick();
    onSelectStep(selectedStep);
  };

  // Helper to generate SVG pie slices
  const getSliceCoordinates = (startAngle: number, endAngle: number, radius: number) => {
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const x1 = 150 + radius * Math.cos(startRad);
    const y1 = 150 + radius * Math.sin(startRad);
    const x2 = 150 + radius * Math.cos(endRad);
    const y2 = 150 + radius * Math.sin(endRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return `M 150 150 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <div
      id="ruleta-simulator-container"
      className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6"
      style={{ fontSize: `${textScale * 100}%` }}
    >
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900/90 border border-cyan-500/40 p-5 sm:p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>RULETA SIMULADOR DE PASOS FINANCIEROS</span>
              </span>
              <span className="text-xs font-mono text-slate-400">
                {numSlices} Pasos Formativos
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              GIRA LA RULETA PARA DETERMINAR TU RETO
            </h2>
            <p className="text-xs sm:text-sm font-mono text-slate-300 max-w-xl">
              Gira la ruleta del simulador. Cada casilla te conducirá a las preguntas y respuestas del paso obtenido con bonificaciones especiales de puntuación.
            </p>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono font-bold border border-slate-700 transition-colors"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>

      {/* Main Roulette Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left / Center: The Spinning Wheel */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl relative">
          {/* Pointer indicator at top */}
          <div className="relative z-20 -mb-5 flex flex-col items-center drop-shadow-[0_0_15px_rgba(0,243,255,0.9)]">
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-cyan-400 animate-bounce" />
          </div>

          {/* Wheel Frame & Canvas Container */}
          <div className="relative w-[280px] sm:w-[330px] h-[280px] sm:h-[330px] flex items-center justify-center">
            {/* Outer Glow Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500/50 shadow-[0_0_30px_rgba(0,243,255,0.3)] pointer-events-none" />

            {/* Rotating SVG Wheel */}
            <svg
              viewBox="0 0 300 300"
              className="w-full h-full rounded-full shadow-2xl"
              style={{
                transform: `rotate(${rotationDegrees}deg)`,
                transition: isSpinning ? 'transform 3.5s cubic-bezier(0.15, 0.9, 0.25, 1)' : 'none',
              }}
            >
              {steps.map((step, idx) => {
                const startAngle = idx * sliceAngle;
                const endAngle = (idx + 1) * sliceAngle;
                const midAngle = startAngle + sliceAngle / 2;
                const midRad = ((midAngle - 90) * Math.PI) / 180;
                const textRadius = 105;
                const tx = 150 + textRadius * Math.cos(midRad);
                const ty = 150 + textRadius * Math.sin(midRad);

                return (
                  <g key={step.id}>
                    {/* Pie slice */}
                    <path
                      d={getSliceCoordinates(startAngle, endAngle, 145)}
                      fill={step.color}
                      fillOpacity="0.25"
                      stroke={step.color}
                      strokeWidth="2"
                    />

                    {/* Step label / Number */}
                    <text
                      x={tx}
                      y={ty}
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${midAngle + 90}, ${tx}, ${ty})`}
                      className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                    >
                      P{step.stepNumber}
                    </text>
                  </g>
                );
              })}

              {/* Center Hub */}
              <circle cx="150" cy="150" r="34" fill="#020617" stroke="#00f3ff" strokeWidth="3" />
              <circle cx="150" cy="150" r="28" fill="#0f172a" />
            </svg>

            {/* Center Spin Button inside wheel */}
            <button
              onClick={handleSpinRoulette}
              disabled={isSpinning}
              id="spin-roulette-center-btn"
              className={`absolute z-30 w-16 h-16 rounded-full flex flex-col items-center justify-center font-mono font-black text-[11px] uppercase transition-all shadow-xl ${
                isSpinning
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-tr from-cyan-400 to-emerald-400 text-slate-950 hover:scale-110 active:scale-95 shadow-cyan-500/50 cursor-pointer'
              }`}
              title="Girar la Ruleta"
            >
              <RotateCw className={`w-5 h-5 mb-0.5 ${isSpinning ? 'animate-spin text-slate-500' : ''}`} />
              <span>{isSpinning ? '...' : 'GIRAR'}</span>
            </button>
          </div>

          {/* Main Action Spin Button Below */}
          <div className="w-full mt-6">
            <button
              onClick={handleSpinRoulette}
              disabled={isSpinning}
              id="spin-roulette-main-btn"
              className={`w-full py-4 rounded-2xl font-mono text-sm sm:text-base font-black uppercase tracking-wider flex items-center justify-center gap-3 transition-all shadow-xl cursor-pointer ${
                isSpinning
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 text-slate-950 shadow-cyan-500/40 hover:scale-[1.02] active:scale-95'
              }`}
            >
              <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'RULETA GIRANDO...' : '🎰 GIRAR LA RULETA DEL SIMULADOR'}</span>
            </button>
          </div>
        </div>

        {/* Right: Step Result & Navigation to Questions and Answers */}
        <div className="lg:col-span-5 space-y-4">
          {selectedStep ? (
            <div
              id="ruleta-step-result-card"
              className="rounded-3xl bg-slate-900/95 border-2 p-5 sm:p-6 space-y-4 backdrop-blur-xl shadow-2xl animate-in zoom-in-95 duration-300"
              style={{ borderColor: selectedStep.color }}
            >
              {/* Step Category & Badge */}
              <div className="flex items-center justify-between gap-2">
                <span
                  className="px-3 py-1 rounded-full text-[11px] font-mono font-extrabold uppercase border"
                  style={{
                    borderColor: selectedStep.color,
                    color: selectedStep.color,
                    backgroundColor: `${selectedStep.color}15`,
                  }}
                >
                  {selectedStep.category}
                </span>

                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono text-xs font-bold">
                  +{selectedStep.pointsReward} PTS RECOMPENSA
                </span>
              </div>

              {/* Title & Icon */}
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
                  style={{
                    backgroundColor: `${selectedStep.color}25`,
                    color: selectedStep.color,
                    border: `1px solid ${selectedStep.color}`,
                  }}
                >
                  {getStepIcon(selectedStep.iconName, 'w-6 h-6')}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white tracking-wide">
                    {selectedStep.title}
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    Paso #{selectedStep.stepNumber} del Simulador
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-200 font-mono leading-relaxed">
                {selectedStep.description}
              </div>

              {/* Action: Go to questions and answers */}
              <button
                onClick={handleGoToQuestions}
                id="advance-to-questions-btn"
                className="w-full py-4 rounded-2xl font-mono text-sm sm:text-base font-black uppercase tracking-wider bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>IR A PREGUNTAS Y RESPUESTAS DEL PASO</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 text-center space-y-3 font-mono">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white uppercase">
                Esperando Giro de la Ruleta
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Presiona el botón <strong className="text-cyan-300">"GIRAR LA RULETA"</strong> para seleccionar al azar uno de los 8 pasos formativos del simulador y desbloquear sus preguntas y respuestas.
              </p>
            </div>
          )}

          {/* Quick List of the 8 Steps of the Simulator */}
          <div className="p-4 rounded-3xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
              PASOS DEL SIMULADOR DISPONIBLES:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {steps.map((step) => {
                const isSelected = selectedStep?.id === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => {
                      if (isSpinning) return;
                      sound.playClick();
                      setSelectedStep(step);
                    }}
                    className={`p-2 rounded-xl text-left border transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-400 text-white font-bold'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: step.color }}
                    />
                    <span className="truncate text-[10px]">
                      P{step.stepNumber}: {step.title.split(':')[1]?.trim() || step.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
