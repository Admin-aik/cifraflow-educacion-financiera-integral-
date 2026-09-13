import React, { useState } from 'react';
import {
  Sparkles,
  Shield,
  Zap,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Volume2,
  Award,
} from 'lucide-react';
import { TeenAvatar, StudentProfile } from '../types';
import { TEEN_AVATARS } from '../data/cifraFlowData';
import { sound } from '../utils/audio';

interface AvatarSelectionPhase1Props {
  studentProfile: StudentProfile;
  selectedAvatar: TeenAvatar | null;
  onSelectAvatar: (avatar: TeenAvatar) => void;
  onProceed: () => void;
  onBack: () => void;
  textScale?: number;
}

export const AvatarSelectionPhase1: React.FC<AvatarSelectionPhase1Props> = ({
  studentProfile,
  selectedAvatar,
  onSelectAvatar,
  onProceed,
  onBack,
  textScale = 1.0,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleChoose = (avatar: TeenAvatar) => {
    sound.playClick();
    onSelectAvatar(avatar);
    sound.speak(
      `Has seleccionado a ${avatar.name}, ${avatar.title}. Habilidad táctica: ${avatar.perkTitle}.`
    );
  };

  return (
    <div
      id="avatar-selection-phase-1"
      className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6"
      style={{ fontSize: `${textScale * 100}%` }}
    >
      {/* Top Header info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-[10px] font-mono font-bold uppercase tracking-wider">
              FASE 1: CINEMÁTICA DE CADETES
            </span>
            <span className="text-xs font-mono text-slate-400">
              Estudiante: <strong className="text-white">{studentProfile.fullName}</strong> ({studentProfile.institution})
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wide">
            ELIGE A TU AVATAR ADOLESCENTE OPERADOR
          </h2>
          <p className="text-xs sm:text-sm font-mono text-slate-300 max-w-2xl">
            Cada joven estudiante cuenta con ventajas y perks tácticos para auditoría de contratos, ciberseguridad FIDO2, <span className="text-[#34d399] font-bold">Emprendimiento</span> y Bolsa de Valores (BVC).
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono font-bold transition-all border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>VOLVER A DATOS</span>
          </button>

          <button
            onClick={() => {
              if (selectedAvatar) {
                sound.playLevelUp();
                onProceed();
              }
            }}
            disabled={!selectedAvatar}
            id="confirm-avatar-btn"
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all shadow-lg ${
              selectedAvatar
                ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow-cyan-500/30 hover:scale-105 active:scale-95 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <span>CONFIRMAR & IR A MÓDULOS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of 4 Cinematic Big 3D Teenager Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {TEEN_AVATARS.map((avatar) => {
          const isSelected = selectedAvatar?.id === avatar.id;
          const isHovered = hoveredId === avatar.id;

          return (
            <div
              key={avatar.id}
              onClick={() => handleChoose(avatar)}
              onMouseEnter={() => setHoveredId(avatar.id)}
              onMouseLeave={() => setHoveredId(null)}
              id={`avatar-card-${avatar.id}`}
              className={`rounded-3xl p-5 backdrop-blur-xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden group shadow-xl ${
                isSelected
                  ? 'bg-slate-900/95 scale-[1.03] shadow-2xl'
                  : 'bg-slate-900/70 hover:bg-slate-900/90 hover:scale-[1.01]'
              }`}
              style={{
                borderColor: isSelected ? avatar.glowColor : `${avatar.glowColor}40`,
                boxShadow: isSelected ? `0 0 25px ${avatar.glowColor}60` : undefined,
              }}
            >
              {/* Top Accent Glow Stripe */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: avatar.glowColor }}
              />

              <div className="space-y-4">
                {/* Header Tag and Icon */}
                <div className="flex items-center justify-between">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-wider border"
                    style={{
                      borderColor: avatar.glowColor,
                      color: avatar.glowColor,
                      backgroundColor: `${avatar.glowColor}15`,
                    }}
                  >
                    {avatar.badge}
                  </span>

                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
                    style={{
                      backgroundColor: `${avatar.glowColor}25`,
                      border: `1px solid ${avatar.glowColor}80`,
                    }}
                  >
                    {avatar.avatarIcon}
                  </div>
                </div>

                {/* Teenager Name and Title */}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 uppercase font-bold">
                      {avatar.stage}
                    </span>
                    <h3 className="text-lg font-black text-white group-hover:text-cyan-200 transition-colors">
                      {avatar.name.replace(' (Adolescente)', '')}
                    </h3>
                  </div>
                  <p
                    className="text-xs font-mono font-bold mt-1 leading-tight"
                    style={{ color: avatar.glowColor }}
                  >
                    {avatar.title}
                  </p>
                </div>

                {/* Cyberpunk Teen Appearance Note */}
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] font-mono text-slate-300">
                  <span className="text-slate-500 font-bold block mb-0.5">ESTÉTICA & EQUIPAMIENTO:</span>
                  {avatar.appearance}
                </div>

                {/* Tactical Perk Card */}
                <div
                  className="p-3 rounded-2xl border space-y-1.5"
                  style={{
                    backgroundColor: `${avatar.glowColor}10`,
                    borderColor: `${avatar.glowColor}30`,
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" style={{ color: avatar.glowColor }} />
                    <span
                      className="text-xs font-mono font-extrabold uppercase"
                      style={{ color: avatar.glowColor }}
                    >
                      {avatar.perkTitle}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    {avatar.perkDescription}
                  </p>
                </div>
              </div>

              {/* Selection Bottom Status */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">
                  {isSelected ? 'OPERADOR ACTIVO' : 'CLIC PARA SELECCIONAR'}
                </span>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-emerald-400 text-slate-950 scale-110'
                      : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Avatar Detail Preview & Action Bar */}
      {selectedAvatar && (
        <div
          className="rounded-3xl p-5 border backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300"
          style={{
            backgroundColor: `${selectedAvatar.glowColor}10`,
            borderColor: selectedAvatar.glowColor,
          }}
        >
          <div className="flex items-center gap-3 text-left">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-lg"
              style={{
                backgroundColor: `${selectedAvatar.glowColor}30`,
                border: `2px solid ${selectedAvatar.glowColor}`,
              }}
            >
              {selectedAvatar.avatarIcon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white uppercase">{selectedAvatar.name}</span>
                <span
                  className="text-xs font-mono font-bold uppercase"
                  style={{ color: selectedAvatar.glowColor }}
                >
                  • {selectedAvatar.badge}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-200 mt-0.5">
                Ventaja activa: <strong>{selectedAvatar.perkTitle}</strong> — {selectedAvatar.bonusEffect}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playLevelUp();
              onProceed();
            }}
            id="proceed-with-avatar-btn"
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-mono text-xs font-black uppercase tracking-wider bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 text-slate-950 shadow-xl shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>INGRESAR A LOS MÓDULOS DE SIMULACIÓN</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
