import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShieldCheck,
  Zap,
  AlertCircle,
  HelpCircle,
  Trophy,
  ArrowRight,
  ArrowLeft,
  PlusCircle,
  Coins,
  Sparkles,
} from 'lucide-react';
import { GameState, Asset, Liability } from '../types';

interface FinancialSheetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  onPayOffLiability: (liabilityId: string) => void;
  onTakeBankLoan: (amount: number) => void;
  onPromoteToFastTrack: () => void;
}

export const FinancialSheetDrawer: React.FC<FinancialSheetDrawerProps> = ({
  isOpen,
  onClose,
  gameState,
  onPayOffLiability,
  onTakeBankLoan,
  onPromoteToFastTrack,
}) => {
  const [activeTab, setActiveTab] = useState<'STATEMENT' | 'ASSETS' | 'LIABILITIES' | 'BANK'>('STATEMENT');
  const [loanAmountInput, setLoanAmountInput] = useState<number>(1000);
  const [showTip, setShowTip] = useState<string | null>(null);

  if (!isOpen) return null;

  const { financials, assets, liabilities, isOnFastTrack, selectedArchetype, selectedDream } = gameState;
  const canEscape = financials.passiveIncome >= financials.totalExpenses && !isOnFastTrack;

  // Calculate Net Worth
  const totalAssetValue = assets.reduce((sum, a) => sum + a.cost, 0);
  const totalLiabilityValue = liabilities.reduce((sum, l) => sum + l.principalBalance, 0);
  const netWorth = financials.cash + totalAssetValue - totalLiabilityValue;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl h-full bg-slate-900 border-l border-cyan-500/30 flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">BALANCE GENERAL Y FINANZAS</h2>
              <p className="text-xs font-mono text-slate-400">
                {selectedArchetype?.title} • PATRIMONIO NETO:{' '}
                <span className="text-cyan-400 font-bold">${netWorth.toLocaleString()}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono font-bold transition-colors"
              title="Volver a la pantalla original del tablero"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Volver</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Cerrar panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Escape The Rat Race Banner */}
        {canEscape && (
          <div className="m-4 p-4 rounded-xl bg-gradient-to-r from-emerald-950 via-cyan-950 to-emerald-950 border-2 border-emerald-400 shadow-xl shadow-emerald-950/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-left">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300">
                <Trophy className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  🔥 ¡CRITERIO DE ESCAPE CUMPLIDO!
                </h3>
                <p className="text-xs text-emerald-300">
                  Tus Ingresos Pasivos (${financials.passiveIncome}/mes) superan tus Gastos Totales (${financials.totalExpenses}/mes)!
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onPromoteToFastTrack();
                onClose();
              }}
              id="enter-fast-track-drawer-btn"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span>ENTRAR A LA VÍA RÁPIDA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="flex items-center border-b border-slate-800 px-4 bg-slate-950/40 text-xs font-mono">
          <button
            onClick={() => setActiveTab('STATEMENT')}
            className={`py-3 px-4 border-b-2 font-bold transition-all ${
              activeTab === 'STATEMENT'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            INGRESOS Y GASTOS
          </button>
          <button
            onClick={() => setActiveTab('ASSETS')}
            className={`py-3 px-4 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'ASSETS'
                ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>ACTIVOS</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-emerald-400">
              {assets.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('LIABILITIES')}
            className={`py-3 px-4 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'LIABILITIES'
                ? 'border-rose-400 text-rose-400 bg-rose-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>PASIVOS (DEUDAS)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-rose-400">
              {liabilities.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('BANK')}
            className={`py-3 px-4 border-b-2 font-bold transition-all ${
              activeTab === 'BANK'
                ? 'border-purple-400 text-purple-400 bg-purple-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            CRÉDITO BANCARIO
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {activeTab === 'STATEMENT' && (
            <div className="space-y-5">
              {/* Income vs Expenses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Income Statement */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/20 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="flex items-center gap-1.5 text-xs font-mono uppercase text-emerald-400 font-bold">
                      <TrendingUp className="w-4 h-4" /> Ingreso Mensual Total
                    </span>
                    <span className="text-base font-extrabold font-mono text-emerald-400">
                      ${financials.totalIncome.toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">Salario Activo:</span>
                      <span className="font-bold">${financials.salary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-emerald-300 bg-emerald-950/30 p-1.5 rounded-lg border border-emerald-500/20">
                      <span className="font-bold">✨ Ingresos Pasivos (Activos):</span>
                      <span className="font-extrabold">+${financials.passiveIncome.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Expenses Statement */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/20 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="flex items-center gap-1.5 text-xs font-mono uppercase text-rose-400 font-bold">
                      <TrendingDown className="w-4 h-4" /> Gastos Mensuales Totales
                    </span>
                    <span className="text-base font-extrabold font-mono text-rose-400">
                      ${financials.totalExpenses.toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs font-mono text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Impuestos:</span>
                      <span>${financials.taxes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Vivienda y Servicios:</span>
                      <span>${financials.housing}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Estilo de Vida y Comida:</span>
                      <span>${financials.lifestyle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Otras Suscripciones:</span>
                      <span>${financials.otherExpenses}</span>
                    </div>
                    {financials.childExpenses > 0 && (
                      <div className="flex justify-between text-amber-300">
                        <span>Compromisos Adicionales:</span>
                        <span>${financials.childExpenses}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-rose-300">
                      <span className="text-slate-400">Pago de Deudas y Préstamos:</span>
                      <span className="font-bold">${financials.loanExpenses}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Cash Flow Calculation Box */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 to-slate-900 border border-cyan-500/40 space-y-2 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">
                    FLUJO DE CAJA MENSUAL NETO (INGRESOS - GASTOS)
                  </span>
                  <span
                    className={`text-xl font-mono font-extrabold ${
                      financials.monthlyCashflow >= 0 ? 'text-cyan-400' : 'text-rose-400'
                    }`}
                  >
                    {financials.monthlyCashflow >= 0 ? '+' : ''}${financials.monthlyCashflow.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  💡 Este es el dinero que ingresa a tu cuenta en cada Estación de Nómina. Ten en cuenta que reducir
                  cuotas de préstamos eleva de inmediato esta cifra.
                </p>
              </div>

              {/* Rich Dad Educational Rule */}
              <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs space-y-2">
                <div className="flex items-center gap-2 text-purple-300 font-bold font-mono">
                  <Sparkles className="w-4 h-4" /> LA REGLA DE ORO DEL FLUJO DE CAJA
                </div>
                <p className="text-slate-300 leading-relaxed">
                  "No escapas de la Carrera de Ratas ganando un sueldo más alto; la inflación del estilo de vida suele devorar
                  los aumentos salariales. Escapas utilizando tu excedente para adquirir <strong>activos</strong> que produzcan{' '}
                  <strong>flujo de caja pasivo</strong> hasta que supere tus gastos fijos de vida."
                </p>
              </div>
            </div>
          )}

          {activeTab === 'ASSETS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                  Tus Activos Generadores de Flujo ({assets.length})
                </h3>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Pasivo Total: +${financials.passiveIncome}/mes
                </span>
              </div>

              {assets.length === 0 ? (
                <div className="p-8 rounded-xl border border-dashed border-slate-800 text-center space-y-2">
                  <Coins className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-sm font-semibold text-slate-400">Sin Activos Adquiridos Aún</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    ¡Cae en los <strong>Nodos de Oportunidad</strong> para robar Negocios Pequeños o Grandes como Micro-SaaS, Nodos Cripto
                    o Dúplex de Alquiler!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {assets.map((asset) => (
                    <div
                      key={asset.id}
                      className="p-3.5 rounded-xl bg-slate-950/90 border border-emerald-500/30 space-y-2 hover:border-emerald-500/60 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{asset.name}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                              {asset.category.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Pago Inicial: ${asset.downPayment.toLocaleString()} • Coste Total: ${asset.cost.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-extrabold font-mono text-emerald-400">
                            +${asset.monthlyCashFlow}/mes
                          </div>
                          <div className="text-[10px] font-mono text-cyan-400">
                            {asset.roiAnnualPercent}% Retorno Anual (ROI)
                          </div>
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900/60 text-[11px] text-slate-400 flex items-start gap-2">
                        <span className="text-emerald-400">💡</span>
                        <span>{asset.educationalTip}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'LIABILITIES' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                  Pasivos y Deudas ({liabilities.length})
                </h3>
                <span className="text-xs font-mono text-rose-400 font-bold">
                  Drenaje: -${financials.loanExpenses}/mes
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                💡 <strong>Estrategia Bola de Nieve:</strong> Liquida deudas de alto interés con tu reserva de efectivo.
                ¡Eliminar un pasivo incrementa inmediatamente tu flujo de caja neto mensual!
              </div>

              {liabilities.length === 0 ? (
                <div className="p-8 rounded-xl border border-dashed border-emerald-500/30 text-center space-y-2 bg-emerald-950/10">
                  <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-sm font-semibold text-emerald-300">¡100% Libre de Deudas!</p>
                  <p className="text-xs text-slate-400">No tienes pasivos activos drenando tu flujo de efectivo mensual.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {liabilities.map((liability) => {
                    const canAffordPayoff = financials.cash >= liability.principalBalance;
                    return (
                      <div
                        key={liability.id}
                        className="p-3.5 rounded-xl bg-slate-950/90 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="font-bold text-sm text-white">{liability.name}</div>
                          <div className="text-xs font-mono text-slate-400">
                            Capital Pendiente:{' '}
                            <span className="text-rose-300 font-bold">${liability.principalBalance.toLocaleString()}</span>{' '}
                            • Cuota Mensual:{' '}
                            <span className="text-rose-400 font-bold">-${liability.monthlyPayment}/mes</span>
                          </div>
                        </div>

                        {liability.canPayOff && (
                          <button
                            onClick={() => onPayOffLiability(liability.id)}
                            disabled={!canAffordPayoff}
                            className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all shadow-md ${
                              canAffordPayoff
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20 active:scale-95'
                                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                            }`}
                          >
                            {canAffordPayoff ? `Liquidar ($${liability.principalBalance.toLocaleString()})` : 'Efectivo Insuficiente'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'BANK' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-purple-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-purple-300 font-bold">
                  <Coins className="w-4 h-4" /> Línea de Crédito Bancaria
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  ¿Necesitas liquidez rápida para aprovechar un Gran Negocio? Puedes solicitar préstamos bancarios en múltiplos de $1,000.
                  <strong> El tipo de interés bancario es del 10% mensual</strong> ($100/mes de cuota por cada $1,000 solicitados).
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step={1000}
                    min={1000}
                    max={50000}
                    value={loanAmountInput}
                    onChange={(e) => setLoanAmountInput(Math.max(1000, Number(e.target.value)))}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={() => {
                      onTakeBankLoan(loanAmountInput);
                      setActiveTab('STATEMENT');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white text-xs font-mono font-bold uppercase shadow-lg shadow-purple-900/40 active:scale-95 transition-all"
                  >
                    Pedir Préstamo: ${loanAmountInput.toLocaleString()}
                  </button>
                </div>
                <div className="text-[11px] font-mono text-purple-300">
                  Coste Mensual: -${Math.round(loanAmountInput * 0.1)}/mes agregado a tus pasivos.
                </div>
              </div>

              {/* Good Debt vs Bad Debt lesson */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" /> Deuda Buena vs Deuda Mala
                </h4>
                <p>
                  <strong>Deuda Buena:</strong> Endeudarse para adquirir un activo cuyo flujo de caja mensual sea MAYOR que
                  el coste del préstamo (ej. pagar $100/mes de cuota para tener una máquina que genera $250/mes de flujo neto).
                </p>
                <p>
                  <strong>Deuda Mala:</strong> Endeudarse con tarjetas de crédito o préstamos de auto para comprar caprichos
                  que drenan tu liquidez sin producir ni un solo dólar de ingreso.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Bottom Footer Return Button */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950/90 backdrop-blur flex items-center justify-between gap-3">
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            Revisa tu estado financiero o regresa al tablero cuando desees.
          </span>
          <button
            onClick={onClose}
            id="close-financial-drawer-btn"
            className="w-full sm:w-auto ml-auto flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-mono font-bold transition-all shadow-md active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>VOLVER AL TABLERO PRINCIPAL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
