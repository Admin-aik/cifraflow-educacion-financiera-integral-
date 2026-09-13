import React from 'react';
import {
  FileText,
  Building2,
  Rocket,
  TrendingUp,
  ShieldAlert,
  Gamepad2,
  ArrowRight,
  Play,
  CheckCircle,
  Clock,
  Sparkles,
  Award,
} from 'lucide-react';
import { LearningModule, TeenAvatar, StudentProfile, ScoreState } from '../types';
import { LEARNING_MODULES } from '../data/cifraFlowData';
import { sound } from '../utils/audio';

interface ModuleSelectionPhase2Props {
  studentProfile: StudentProfile;
  selectedAvatar: TeenAvatar;
  scoreState: ScoreState;
  onSelectModule: (moduleId: string) => void;
  onStartCampaign: () => void;
  onOpen3DSimulator: () => void;
  textScale?: number;
}

export const ModuleSelectionPhase2: React.FC<ModuleSelectionPhase2Props> = ({
  studentProfile,
  selectedAvatar,
  scoreState,
  onSelectModule,
  onStartCampaign,
  onOpen3DSimulator,
  textScale = 1.0,
}) => {
  const getIcon = (name: string, color: string) => {
    switch (name) {
      case 'FileText':
        return <FileText className="w-6 h-6" style={{ color }} />;
      case 'Building2':
        return <Building2 className="w-6 h-6" style={{ color }} />;
      case 'Rocket':
        return <Rocket className="w-6 h-6" style={{ color: '#34d399' }} />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6" style={{ color }} />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-6 h-6" style={{ color }} />;
      default:
        return <Sparkles className="w-6 h-6" style={{ color }} />;
    }
  };

  return (
    <div
      id="module-selection-phase-2"
      className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6"
      style={{ fontSize: `${textScale * 100}%` }}
    >
      {/* Top Banner with Quick Actions */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-[10px] font-mono font-bold uppercase">
              FASE 2: RUTA FORMATIVA Y SIMULACIONES
            </span>
            <span className="text-xs font-mono text-slate-400">
              Operador: <strong className="text-white">{selectedAvatar.name}</strong>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">
            CENTRO DE MISIONES & MÓDULOS PEDAGÓGICOS
          </h2>
          <p className="text-xs sm:text-sm font-mono text-slate-300 max-w-2xl">
            Supera cada reto para sumar puntos al HUD acumulativo. Selecciona un área específica o activa la campaña continua.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Quick Start Continuous Campaign */}
          <button
            onClick={() => {
              sound.playLevelUp();
              onStartCampaign();
            }}
            id="start-campaign-btn"
            className="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-mono text-xs font-black uppercase tracking-wider shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>INICIAR RUTA COMPLETA (MODO CAMPAÑA)</span>
          </button>

          {/* Direct 3D Cashflow Simulator entry */}
          <button
            onClick={() => {
              sound.playLevelUp();
              onOpen3DSimulator();
            }}
            id="open-3d-simulator-btn"
            className="flex-1 md:flex-none px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-fuchsia-500/50 text-fuchsia-300 hover:text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            title="Abrir el simulador interactivo de tablero 3D Cashflow 2050"
          >
            <Gamepad2 className="w-4 h-4 text-fuchsia-400" />
            <span>SIMULADOR TABLERO 3D</span>
          </button>
        </div>
      </div>

      {/* Grid of the 5 Official Learning Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {LEARNING_MODULES.map((module) => {
          const isEmprendimiento = module.category === 'EMPRENDIMIENTO';
          const moduleColor = isEmprendimiento ? '#34d399' : module.color;

          return (
            <div
              key={module.id}
              onClick={() => {
                sound.playClick();
                onSelectModule(module.id);
              }}
              id={`module-card-${module.id}`}
              className="rounded-3xl p-5 bg-slate-900/80 hover:bg-slate-900/95 border-2 border-slate-800 hover:border-cyan-400/80 transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-xl hover:shadow-cyan-950/60 hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Accent Top Bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: moduleColor }}
              />

              <div className="space-y-3">
                {/* Header Badge and Icon */}
                <div className="flex items-center justify-between">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border"
                    style={{
                      borderColor: moduleColor,
                      color: moduleColor,
                      backgroundColor: `${moduleColor}15`,
                    }}
                  >
                    {module.badge}
                  </span>

                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                    style={{
                      backgroundColor: `${moduleColor}20`,
                      border: `1px solid ${moduleColor}60`,
                    }}
                  >
                    {getIcon(module.iconName, moduleColor)}
                  </div>
                </div>

                {/* Module Title */}
                <div>
                  <h3 className="text-base font-black text-white group-hover:text-cyan-200 transition-colors">
                    {module.title.includes('Emprendimiento') ? (
                      <>
                        <span className="text-[#34d399] font-black">Emprendimiento</span> & Estructura de Costos
                      </>
                    ) : (
                      module.title
                    )}
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mt-0.5 leading-snug">
                    {module.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {module.description}
                </p>

                {/* Challenges count and points reward */}
                <div className="flex items-center gap-2 pt-2 text-[11px] font-mono text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                    {module.challenges.length} Retos Críticos
                  </span>
                  <span className="text-emerald-400 font-bold">
                    +{(module.challenges.length * 140)} Pts Máx
                  </span>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-cyan-400 group-hover:text-white transition-colors flex items-center gap-1">
                  <span>INICIAR RETOS</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Penalización por fallo admitida
                </span>
              </div>
            </div>
          );
        })}

        {/* 6th Card: Interactive 3D Simulator */}
        <div
          onClick={() => {
            sound.playLevelUp();
            onOpen3DSimulator();
          }}
          id="module-card-simulator"
          className="rounded-3xl p-5 bg-gradient-to-br from-slate-900/90 to-purple-950/40 border-2 border-fuchsia-500/50 hover:border-fuchsia-400 transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-xl hover:shadow-fuchsia-950/60 hover:-translate-y-1 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-fuchsia-500 to-cyan-400" />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border border-fuchsia-400 text-fuchsia-300 bg-fuchsia-500/15">
                SIMULADOR 3D EN VIVO
              </span>
              <div className="w-10 h-10 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/60 flex items-center justify-center text-fuchsia-300 shadow-md">
                <Gamepad2 className="w-6 h-6" />
              </div>
            </div>

            <div>
              <h3 className="text-base font-black text-white group-hover:text-fuchsia-200 transition-colors">
                Simulador CifraFlow 2050
              </h3>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                Carrera de Ratas & Vía Rápida en Tablero 3D
              </p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Pon a prueba tus conocimientos en el tablero de finanzas: gestiona flujo de caja neto, compra activos digitales, paga pasivos y alcanza la libertad financiera.
            </p>

            <div className="flex items-center gap-2 pt-2 text-[11px] font-mono text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-fuchsia-300 font-bold">
                Tablero 3D Completo
              </span>
              <span className="text-cyan-400 font-bold">
                Motor de Dados & Balance
              </span>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-fuchsia-300 group-hover:text-white transition-colors flex items-center gap-1">
              <span>ENTRAR AL TABLERO</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Preservación 100% activa
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
