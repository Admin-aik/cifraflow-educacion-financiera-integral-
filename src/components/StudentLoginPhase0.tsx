import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Building,
  ArrowRight,
  Sparkles,
  Volume2,
  TrendingUp,
  Award,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { StudentProfile } from '../types';
import { sound } from '../utils/audio';

interface StudentLoginPhase0Props {
  onCompleteLogin: (profile: StudentProfile) => void;
  initialProfile?: StudentProfile | null;
  textScale?: number;
}

export const StudentLoginPhase0: React.FC<StudentLoginPhase0Props> = ({
  onCompleteLogin,
  initialProfile,
  textScale = 1.0,
}) => {
  const [fullName, setFullName] = useState<string>(initialProfile?.fullName || '');
  const [idPrefix, setIdPrefix] = useState<'V-' | 'E-'>('V-');
  const [idNumber, setIdNumber] = useState<string>(
    initialProfile?.idNumber ? initialProfile.idNumber.replace(/^[VE]-/, '') : ''
  );
  const [institution, setInstitution] = useState<string>(initialProfile?.institution || '');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [hasPlayedWelcome, setHasPlayedWelcome] = useState<boolean>(false);

  // Trigger welcome audio on initial mount (respects browser interaction policies)
  useEffect(() => {
    const timer = setTimeout(() => {
      sound.speakWelcome();
      setHasPlayedWelcome(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handlePlayVoice = () => {
    sound.playClick();
    sound.speakWelcome();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Por favor ingresa tu Nombre Completo.');
      sound.playDoodadPenalty();
      return;
    }
    if (!idNumber.trim() || idNumber.length < 5) {
      setErrorMsg('Por favor ingresa un número de Cédula de Identidad válido (formato V- o E-).');
      sound.playDoodadPenalty();
      return;
    }
    if (!institution.trim()) {
      setErrorMsg('Por favor indica tu Institución Educativa (Liceo, Colegio o Universidad).');
      sound.playDoodadPenalty();
      return;
    }

    setErrorMsg('');
    sound.playLevelUp();

    const profile: StudentProfile = {
      fullName: fullName.trim(),
      idNumber: `${idPrefix}${idNumber.trim()}`,
      institution: institution.trim(),
      registeredAt: new Date().toISOString(),
    };

    onCompleteLogin(profile);
  };

  return (
    <div
      id="student-login-phase-0"
      className="min-h-[calc(100vh-65px)] flex flex-col items-center justify-center p-3 sm:p-6 relative overflow-hidden"
      style={{ fontSize: `${textScale * 100}%` }}
    >
      {/* Ambient Cyber Neon Background Elements */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />

      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* COMPOSICIÓN GRÁFICA SUPERIOR: Imagen panorámica unificada de los 4 avatares adolescentes */}
        <div className="relative w-full rounded-3xl overflow-hidden border-2 border-cyan-500/40 shadow-2xl shadow-cyan-950/70 group">
          <div className="aspect-[16/7] sm:aspect-[16/6] w-full relative">
            <img
              src="/src/assets/images/cifraflow_team_1789305351079.jpg"
              alt="Equipo de Avatares Adolescentes CIFRA FLOW: Ircar, Jorge, Iván y Carlos"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
            />
            {/* Holographic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80" />

            {/* Panoramic Badge and Branding Over Image */}
            <div className="absolute bottom-3 sm:bottom-5 left-4 sm:left-6 right-4 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-400 text-cyan-300 text-xs font-mono font-bold backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>CADETES ADOLESCENTES • TELEMETRÍA 2050</span>
                </div>
                <h1 className="text-xl sm:text-3xl lg:text-4xl font-black uppercase tracking-wider text-white drop-shadow-md">
                  CIFRA FLOW <span className="text-cyan-400">FINANCIERO</span>
                </h1>
                <p className="text-xs sm:text-sm font-mono text-cyan-200/90 max-w-2xl">
                  Equipo Operativo: Ircar (Cloud), Jorge (FIDO2), Iván (Forense) y Carlos (Presupuesto)
                </p>
              </div>

              {/* Speech Narration Button */}
              <button
                onClick={handlePlayVoice}
                id="listen-welcome-voice-btn"
                className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-cyan-950 border border-cyan-400/60 text-cyan-300 hover:text-white text-xs font-mono font-bold transition-all shadow-lg backdrop-blur-md"
                title="Escuchar locución de bienvenida en Español Latinoamericano Neutro"
              >
                <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>ESCUCHAR VOZ DE BIENVENIDA</span>
              </button>
            </div>
          </div>
        </div>

        {/* Form Container Glassmorphism Card */}
        <div className="rounded-3xl bg-slate-900/85 border border-slate-700/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-slate-950/80 space-y-6">
          {/* TEXTO DESCRIPTIVO OFICIAL EN COLOR PLATA NEÓN / BLANCO CRISTAL UNIFORME */}
          <div className="text-center space-y-2 pb-2 border-b border-slate-800">
            <h2 className="text-sm sm:text-base font-mono font-bold tracking-wider text-cyan-300 uppercase">
              FASE 0: INICIALIZACIÓN DE TERMINAL ESTUDIANTIL
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-[#e2e8f0] font-medium max-w-3xl mx-auto text-center">
              Plataforma interactiva de simulación que integra Comprensión Lectora, Primera Cuenta Bancaria (BDV/Plaza/Tesoro), <span className="text-[#34d399] font-bold">Emprendimiento</span>, Bolsa de Valores de Caracas (BVC) y Ciberseguridad Real.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/80 text-rose-300 text-xs font-mono flex items-center gap-2 animate-shake">
              <span className="font-bold">ERROR:</span> {errorMsg}
            </div>
          )}

          {/* Identification Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Field 1: Full Name */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>NOMBRE COMPLETO DEL ESTUDIANTE</span>
                </label>
                <input
                  type="text"
                  required
                  id="student-fullname-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej. Valentina Mendoza García"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-white font-mono text-sm placeholder:text-slate-600 outline-none transition-all"
                />
              </div>

              {/* Field 2: Cédula de Identidad (Formato V- / E-) */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span>CÉDULA DE IDENTIDAD</span>
                </label>
                <div className="flex gap-2">
                  <select
                    id="student-id-prefix-select"
                    value={idPrefix}
                    onChange={(e) => setIdPrefix(e.target.value as 'V-' | 'E-')}
                    className="px-3 py-3 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 font-mono font-bold text-sm focus:border-cyan-400 outline-none"
                  >
                    <option value="V-">V-</option>
                    <option value="E-">E-</option>
                  </select>
                  <input
                    type="text"
                    required
                    id="student-idnumber-input"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Ej. 30123456"
                    maxLength={10}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-white font-mono text-sm placeholder:text-slate-600 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Field 3: Educational Institution */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-cyan-400" />
                  <span>INSTITUCIÓN EDUCATIVA (LICEO / COLEGIO / UNIVERSIDAD)</span>
                </label>
                <input
                  type="text"
                  required
                  id="student-institution-input"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="Ej. Liceo Bolivariano Simón Bolívar"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-white font-mono text-sm placeholder:text-slate-600 outline-none transition-all"
                />
              </div>
            </div>

            {/* Info Security Badge */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-400 font-mono">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Datos asegurados para emisión del <strong>Certificado Digital de Competencias Financieras</strong> al finalizar la misión.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="start-simulation-btn"
              className="w-full py-4 rounded-2xl font-mono text-sm sm:text-base font-extrabold uppercase tracking-wider bg-gradient-to-r from-cyan-400 via-emerald-400 to-fuchsia-500 text-slate-950 shadow-xl shadow-cyan-500/30 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>INICIAR SIMULACIÓN & ELEGIR AVATAR ADOLESCENTE</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
