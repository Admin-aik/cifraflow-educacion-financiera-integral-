import React, { useState, useEffect, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  ArrowLeft,
  Calculator,
  X,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { AppPhase, StudentProfile, TeenAvatar, BCVRateData } from '../types';
import { sound } from '../utils/audio';

interface TopNavigationBarProps {
  currentPhase: AppPhase;
  phaseHistory: AppPhase[];
  onNavigateBack: () => void;
  onNavigateToPhase: (phase: AppPhase) => void;
  studentProfile: StudentProfile | null;
  selectedAvatar: TeenAvatar | null;
  textScale: number;
  setTextScale: (scale: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  currentPhase,
  phaseHistory,
  onNavigateBack,
  onNavigateToPhase,
  studentProfile,
  selectedAvatar,
  textScale,
  setTextScale,
  isMuted,
  onToggleMute,
}) => {
  // Official BCV Rates (Real-Time Synchronized with bcv.org.ve)
  const [bcvRate, setBcvRate] = useState<number>(842.21);
  const [euroRate, setEuroRate] = useState<number>(977.88);
  const [valueDate, setValueDate] = useState<string>('Martes, 15 Septiembre 2026');
  const [rateSource, setRateSource] = useState<string>('Banco Central de Venezuela (bcv.org.ve)');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(true);

  // Calculator State
  const [isCalcOpen, setIsCalcOpen] = useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR'>('USD');
  const [calcForeignAmount, setCalcForeignAmount] = useState<string>('10');
  const [calcBs, setCalcBs] = useState<string>('8422.10');

  // Fetch real-time rate from backend proxy (/api/bcv)
  const fetchLiveBCV = useCallback(async (force = false) => {
    setIsRefreshing(true);
    try {
      const url = force ? '/api/bcv?refresh=true' : '/api/bcv';
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (res.ok) {
        const data: BCVRateData = await res.json();
        if (data && typeof data.rate === 'number' && data.rate > 0) {
          setBcvRate(Number(data.rate.toFixed(2)));
          if (data.euroRate) {
            setEuroRate(Number(data.euroRate.toFixed(2)));
          }
          if (data.valueDate) {
            setValueDate(data.valueDate);
          }
          if (data.source) {
            setRateSource(data.source);
          }
          setIsLiveConnected(true);

          // Update active conversion
          const activeRate = selectedCurrency === 'USD' ? data.rate : (data.euroRate || 977.88);
          const num = parseFloat(calcForeignAmount);
          if (!isNaN(num)) {
            setCalcBs((num * activeRate).toFixed(2));
          }
        }
      }
    } catch (err) {
      console.warn('No se pudo actualizar la tasa BCV en vivo:', err);
      setIsLiveConnected(false);
    } finally {
      setIsRefreshing(false);
      const now = new Date();
      const timeStr = now.toLocaleTimeString('es-VE', {
        hour: '2-digit',
        minute: '2-digit',
      });
      setLastUpdated(timeStr);
    }
  }, [selectedCurrency, calcForeignAmount]);

  useEffect(() => {
    // Initial fetch on mount
    fetchLiveBCV();

    // Auto-check periodically every 90s
    const interval = setInterval(() => {
      fetchLiveBCV();
    }, 90000);

    return () => clearInterval(interval);
  }, [fetchLiveBCV]);

  const currentActiveRate = selectedCurrency === 'USD' ? bcvRate : euroRate;

  const handleForeignChange = (val: string) => {
    setCalcForeignAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setCalcBs((num * currentActiveRate).toFixed(2));
    } else {
      setCalcBs('');
    }
  };

  const handleBsChange = (val: string) => {
    setCalcBs(val);
    const num = parseFloat(val);
    if (!isNaN(num) && currentActiveRate > 0) {
      setCalcForeignAmount((num / currentActiveRate).toFixed(2));
    } else {
      setCalcForeignAmount('');
    }
  };

  const handleSetPreset = (amount: number) => {
    sound.playClick();
    setCalcForeignAmount(amount.toString());
    setCalcBs((amount * currentActiveRate).toFixed(2));
  };

  const handleCurrencySwitch = (curr: 'USD' | 'EUR') => {
    sound.playClick();
    setSelectedCurrency(curr);
    const newRate = curr === 'USD' ? bcvRate : euroRate;
    const num = parseFloat(calcForeignAmount);
    if (!isNaN(num)) {
      setCalcBs((num * newRate).toFixed(2));
    }
  };

  const canGoBack = phaseHistory.length > 0 && currentPhase !== 'PHASE_0_LOGIN';

  return (
    <>
      <header
        id="cifraflow-top-navbar"
        className="w-full bg-slate-950/85 backdrop-blur-md border-b border-cyan-500/30 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-40 shadow-lg shadow-cyan-950/40"
      >
        {/* Brand Logo & Return Action */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              sound.playClick();
              if (canGoBack) {
                onNavigateBack();
              } else if (currentPhase !== 'PHASE_0_LOGIN') {
                onNavigateToPhase('PHASE_2_MODULE_SELECT');
              }
            }}
            id="brand-logo-btn"
            title={canGoBack ? 'Clic para regresar a la pantalla anterior' : 'CIFRA FLOW FINANCIERO'}
            className="flex items-center gap-2 group text-left transition-transform active:scale-95"
          >
            {/* 3D Infinity Logo */}
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-cyan-400/50 bg-slate-900 shadow-md shadow-cyan-500/30 flex items-center justify-center p-0.5 group-hover:border-cyan-300">
              <img
                src="/src/assets/images/cifraflow_logo_1789305364181.jpg"
                alt="CIFRA FLOW Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-fuchsia-500/20 pointer-events-none" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-black tracking-wider bg-gradient-to-r from-[#00f3ff] via-slate-100 to-[#ff007f] bg-clip-text text-transparent uppercase">
                  CIFRA FLOW
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-amber-400 font-mono tracking-widest">
                  FINANCIERO
                </span>
              </div>
              <p className="text-[9px] font-mono text-slate-400 hidden sm:block">
                {canGoBack ? '← Clic para volver a pantalla previa' : 'Motor Lógico & Telemetría Escolar'}
              </p>
            </div>
          </button>

          {canGoBack && (
            <button
              onClick={() => {
                sound.playClick();
                onNavigateBack();
              }}
              id="header-back-btn"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-cyan-500/40 text-cyan-300 hover:text-white hover:border-cyan-300 text-xs font-mono font-bold transition-all shadow-sm"
              title="Volver a la pantalla anterior"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Volver</span>
            </button>
          )}
        </div>

        {/* Real-Time Official BCV Exchange Rate Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setIsCalcOpen(true);
            }}
            id="bcv-rate-badge"
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-500/40 hover:border-emerald-400 text-emerald-400 shadow-md shadow-emerald-950/40 transition-all cursor-pointer group"
            title={`Tasa Oficial BCV: ${bcvRate.toFixed(2)} Bs./USD (Fecha Valor: ${valueDate}). Clic para calculadora.`}
          >
            <span className="relative flex h-2 w-2">
              {isLiveConnected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isLiveConnected ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              ></span>
            </span>

            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold text-slate-300 tracking-wider">BCV EN VIVO:</span>
                <span className="text-xs sm:text-sm font-black font-mono text-emerald-300 group-hover:text-emerald-200">
                  {bcvRate.toFixed(2)} Bs./USD
                </span>
              </div>
              <span className="text-[9px] font-mono text-slate-400 hidden lg:inline">
                {valueDate} • {lastUpdated || 'Actualizado'}
              </span>
            </div>

            <Calculator className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform ml-0.5 hidden sm:block" />
          </button>

          {/* Quick Real-Time Refresh Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick();
              fetchLiveBCV(true);
            }}
            id="bcv-refresh-btn"
            disabled={isRefreshing}
            className="p-1.5 rounded-lg bg-slate-900 border border-emerald-500/30 text-emerald-400 hover:text-white hover:border-emerald-400 transition-all cursor-pointer disabled:opacity-50"
            title="Sincronizar tasa con el Banco Central de Venezuela en este momento"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>

        {/* Right Tools: Accessibility, Narration, Active Student */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Accessibility Text Size Controller */}
          <div
            id="text-scale-controller"
            className="flex items-center rounded-lg bg-slate-900 border border-slate-700/80 p-0.5 text-[11px] font-mono font-bold text-slate-300"
            title="Controlador de tamaño de texto de lectura"
          >
            <button
              onClick={() => {
                sound.playClick();
                setTextScale(0.85);
              }}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                textScale === 0.85 ? 'bg-cyan-500/30 text-cyan-300' : 'hover:text-white'
              }`}
            >
              A-
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setTextScale(1.0);
              }}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                textScale === 1.0 ? 'bg-cyan-500/30 text-cyan-300' : 'hover:text-white'
              }`}
            >
              A
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setTextScale(1.15);
              }}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                textScale === 1.15 ? 'bg-cyan-500/30 text-cyan-300' : 'hover:text-white'
              }`}
            >
              A+
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setTextScale(1.3);
              }}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                textScale === 1.3 ? 'bg-cyan-500/30 text-cyan-300' : 'hover:text-white'
              }`}
            >
              A++
            </button>
          </div>

          {/* Sound / Speech Mute Toggle */}
          <button
            onClick={() => {
              onToggleMute();
              sound.playClick();
            }}
            id="audio-toggle-btn"
            className={`p-2 rounded-xl border transition-all ${
              isMuted
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-400'
                : 'bg-slate-900 border-cyan-500/30 text-cyan-400 hover:text-white'
            }`}
            title={isMuted ? 'Activar narración y sonido' : 'Silenciar sonido'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Active Student & Teen Avatar Preview */}
          {studentProfile && (
            <div
              onClick={() => {
                sound.playClick();
                onNavigateToPhase('PHASE_1_AVATAR_SELECT');
              }}
              id="active-student-pill"
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 transition-colors cursor-pointer"
              title="Perfil del estudiante y avatar seleccionado. Clic para cambiar avatar."
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold shadow-inner"
                style={{
                  backgroundColor: `${selectedAvatar?.glowColor || '#00f3ff'}20`,
                  border: `1px solid ${selectedAvatar?.glowColor || '#00f3ff'}`,
                }}
              >
                {selectedAvatar?.avatarIcon || '🎓'}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-[11px] font-bold text-white leading-tight truncate max-w-[130px]">
                  {studentProfile.fullName}
                </p>
                <p className="text-[9px] font-mono text-slate-400 leading-none">
                  {selectedAvatar ? selectedAvatar.name.split(' ')[0] : 'Sin Avatar'} • {studentProfile.idNumber}
                </p>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* BCV Quick Converter Modal */}
      {isCalcOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-emerald-500/40 p-5 sm:p-6 space-y-5 shadow-2xl shadow-emerald-950/60">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5 text-emerald-400">
                <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30">
                  <Calculator className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-white">
                    Calculadora Tasa BCV
                  </h3>
                  <p className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Conexión en vivo con {rateSource}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => fetchLiveBCV(true)}
                  disabled={isRefreshing}
                  title="Forzar actualización en vivo"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
                </button>
                <button
                  onClick={() => setIsCalcOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Currency Mode Selector Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => handleCurrencySwitch('USD')}
                className={`py-2 px-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  selectedCurrency === 'USD'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>DÓLAR USD ($)</span>
                <span className="text-[11px] font-black">{bcvRate.toFixed(2)} Bs.</span>
              </button>
              <button
                type="button"
                onClick={() => handleCurrencySwitch('EUR')}
                className={`py-2 px-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  selectedCurrency === 'EUR'
                    ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>EURO EUR (€)</span>
                <span className="text-[11px] font-black">{euroRate.toFixed(2)} Bs.</span>
              </button>
            </div>

            {/* Rate Display Panel */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Tipo de Cambio Oficial Ponderado ({selectedCurrency})
              </span>
              <p className="text-2xl sm:text-3xl font-mono font-black text-emerald-300">
                {currentActiveRate.toFixed(2)}{' '}
                <span className="text-sm font-normal text-slate-300">Bs. / 1.00 {selectedCurrency}</span>
              </p>
              <div className="flex items-center justify-center gap-2 pt-1 text-[10px] font-mono text-slate-400">
                <span>Fecha Valor: <strong className="text-slate-200">{valueDate}</strong></span>
              </div>
            </div>

            {/* Quick Amount Presets */}
            <div>
              <span className="text-[10px] font-mono text-slate-400 block mb-1.5 uppercase">
                Montos Rápidos ({selectedCurrency}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[1, 5, 10, 20, 50, 100].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleSetPreset(amt)}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all ${
                      calcForeignAmount === amt.toString()
                        ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {selectedCurrency === 'USD' ? `$${amt}` : `€${amt}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs Section */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono text-slate-300 flex items-center justify-between mb-1">
                  <span>Monto en {selectedCurrency === 'USD' ? 'Dólares (USD $)' : 'Euros (EUR €)'}</span>
                  <span className="text-[10px] font-normal text-slate-400">Editable</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono font-bold">
                    {selectedCurrency === 'USD' ? '$' : '€'}
                  </span>
                  <input
                    type="number"
                    step="any"
                    value={calcForeignAmount}
                    onChange={(e) => handleForeignChange(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:border-emerald-400 outline-none transition-all"
                    placeholder="10.00"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 flex items-center justify-between mb-1">
                  <span>Equivalente en Bolívares (Bs.)</span>
                  <span className="text-[10px] font-normal text-emerald-400">Total calculado</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-emerald-400 font-mono font-bold">Bs.</span>
                  <input
                    type="number"
                    step="any"
                    value={calcBs}
                    onChange={(e) => handleBsChange(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-emerald-300 font-mono text-base focus:border-emerald-400 outline-none font-bold transition-all"
                    placeholder="8422.10"
                  />
                </div>
              </div>
            </div>

            {/* Educational Footnote */}
            <p className="text-[9px] font-mono text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2.5">
              ⚖️ <strong className="text-slate-300">Base Legal & Formativa:</strong> Tipo de cambio de referencia establecido por las mesas de cambio bancarias reguladas por el Banco Central de Venezuela (BCV). De uso formal y obligatorio para transacciones comerciales y contables en Venezuela.
            </p>

            <button
              type="button"
              onClick={() => setIsCalcOpen(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 font-mono text-xs font-bold transition-all"
            >
              LISTO / CONTINUAR
            </button>
          </div>
        </div>
      )}
    </>
  );
};
