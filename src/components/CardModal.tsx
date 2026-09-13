import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Zap,
  Users,
  Heart,
  DollarSign,
  Sparkles,
  Trophy,
  HelpCircle,
  Coins,
  ArrowRight,
  ArrowLeft,
  X,
  XCircle,
  Building,
} from 'lucide-react';
import {
  GameState,
  OpportunityCard,
  DoodadCard,
  MarketCard,
  Asset,
} from '../types';

interface CardModalProps {
  gameState: GameState;
  onSelectDealType: (dealType: 'SMALL' | 'BIG') => void;
  onBuyOpportunity: (card: OpportunityCard, useLoan?: boolean) => void;
  onPassCard: () => void;
  onPayDoodad: (card: DoodadCard) => void;
  onSellAssetInMarket: (assetId: string, sellPrice: number) => void;
  onAcceptCharity: () => void;
  onCollectSideHustle: (amount: number) => void;
  onAcceptLifestyle: (amount: number, title: string) => void;
  onBuyDreamGoal: () => void;
  onPromoteToFastTrack: () => void;
}

export const CardModal: React.FC<CardModalProps> = ({
  gameState,
  onSelectDealType,
  onBuyOpportunity,
  onPassCard,
  onPayDoodad,
  onSellAssetInMarket,
  onAcceptCharity,
  onCollectSideHustle,
  onAcceptLifestyle,
  onBuyDreamGoal,
  onPromoteToFastTrack,
}) => {
  const { activeModal, activeCardData, financials, assets, selectedDream, isOnFastTrack } = gameState;

  if (!activeModal) return null;

  // 1. DEAL CHOICE MODAL (Small vs Big)
  if (activeModal === 'DEAL_CHOICE') {
    const canAffordBig = financials.cash >= 6000;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
        <div className="w-full max-w-lg p-6 rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-2xl shadow-cyan-950/50 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">TIPO DE OPORTUNIDAD</h3>
                <p className="text-xs text-slate-400 font-mono">Selecciona el tamaño del negocio de inversión a evaluar</p>
              </div>
            </div>
            <button
              onClick={onPassCard}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Volver al tablero"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Small Deal */}
            <button
              onClick={() => onSelectDealType('SMALL')}
              id="choose-small-deal-btn"
              className="p-4 rounded-xl bg-slate-950/90 border border-blue-500/30 hover:border-blue-400 text-left space-y-2 group transition-all hover:scale-[1.02] active:scale-95"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-400">NEGOCIO PEQUEÑO</span>
                <span className="text-[11px] font-mono text-slate-400">&lt; $5,000</span>
              </div>
              <h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors text-sm">
                Micro-SaaS, Nodos Cripto, Acciones con Dividendos
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bajo capital requerido. Alto % de ROI para despegar tu flujo mensual.
              </p>
            </button>

            {/* Big Deal */}
            <button
              onClick={() => onSelectDealType('BIG')}
              id="choose-big-deal-btn"
              className="p-4 rounded-xl bg-slate-950/90 border border-purple-500/30 hover:border-purple-400 text-left space-y-2 group transition-all hover:scale-[1.02] active:scale-95"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-400">GRAN NEGOCIO</span>
                <span className="text-[11px] font-mono text-slate-400">$5k - $40k</span>
              </div>
              <h4 className="font-bold text-white group-hover:text-purple-300 transition-colors text-sm">
                Inmuebles Dúplex, Lavanderías, Marcas E-Commerce
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mayor pago inicial con grandes saltos de flujo de caja. ¡Apalancamiento bancario disponible!
              </p>
              {!canAffordBig && (
                <div className="text-[10px] font-mono text-amber-400">
                  ⚠️ Tienes poco efectivo, pero puedes solicitar préstamos si el ROI es sólido.
                </div>
              )}
            </button>
          </div>

          {/* Return button */}
          <button
            onClick={onPassCard}
            className="w-full py-2.5 rounded-xl border border-slate-800 bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>VOLVER AL TABLERO (PASAR OPORTUNIDAD)</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. OPPORTUNITY CARD MODAL
  if (activeModal === 'OPPORTUNITY') {
    const card = activeCardData as OpportunityCard;
    if (!card) return null;

    const canAffordCash = financials.cash >= card.downPayment;
    const loanNeeded = Math.max(0, card.downPayment - financials.cash);
    const loanMonthlyCost = Math.round((Math.ceil(loanNeeded / 1000) * 1000) * 0.1);
    const netCashflowWithLoan = card.monthlyCashFlow - loanMonthlyCost;
    const cashOnCashROI = Math.round(((card.monthlyCashFlow * 12) / Math.max(1, card.downPayment)) * 100);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in zoom-in-95 duration-200">
        <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-2xl shadow-emerald-950/50 overflow-hidden flex flex-col">
          {/* Card Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  OPORTUNIDAD ({card.dealType === 'SMALL' ? 'PEQUEÑA' : 'GRANDE'})
                </span>
                <h3 className="text-base font-bold text-white">{card.title}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-xs font-mono text-cyan-300 border border-cyan-500/30">
                {card.category.replace('_', ' ')}
              </span>
              <button
                onClick={onPassCard}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Volver al tablero"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card Description */}
          <div className="p-4 sm:p-5 space-y-4">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{card.description}</p>

            {/* Financial Metrics Box */}
            <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center font-mono">
              <div className="p-2 rounded-lg bg-slate-900/60">
                <div className="text-[10px] text-slate-400">Coste Total</div>
                <div className="text-xs sm:text-sm font-bold text-white">${card.cost.toLocaleString()}</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60">
                <div className="text-[10px] text-slate-400">Pago Inicial</div>
                <div className="text-xs sm:text-sm font-bold text-emerald-400">
                  ${card.downPayment.toLocaleString()}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60">
                <div className="text-[10px] text-slate-400">Flujo Mensual</div>
                <div className="text-xs sm:text-sm font-bold text-cyan-400">
                  +${card.monthlyCashFlow.toLocaleString()}/mes
                </div>
              </div>
            </div>

            {/* Cash on Cash ROI Badge */}
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-xs font-mono">
              <span className="text-emerald-300 font-bold">Retorno sobre Efectivo (ROI):</span>
              <span className="text-emerald-400 font-extrabold text-sm">{cashOnCashROI}% / año</span>
            </div>

            {/* Rich Dad Educational Tooltip */}
            <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-purple-300">
                <Sparkles className="w-3.5 h-3.5" /> LECCIÓN FINANCIERA
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">{card.richDadInsight}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-end gap-3">
            <button
              onClick={onPassCard}
              id="pass-deal-btn"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-mono text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>PASAR Y VOLVER</span>
            </button>

            {!canAffordCash && card.dealType === 'BIG' && (
              <button
                onClick={() => onBuyOpportunity(card, true)}
                id="buy-deal-loan-btn"
                className="px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-950 transition-all active:scale-95"
              >
                PEDIR PRÉSTAMO Y COMPRAR (+${netCashflowWithLoan}/mes NETO)
              </button>
            )}

            <button
              onClick={() => onBuyOpportunity(card, false)}
              disabled={!canAffordCash}
              id="buy-deal-cash-btn"
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg ${
                canAffordCash
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 shadow-emerald-500/30 active:scale-95'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              {canAffordCash ? `COMPRAR CON EFECTIVO ($${card.downPayment.toLocaleString()})` : 'EFECTIVO INSUFICIENTE'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. DOODAD MODAL
  if (activeModal === 'DOODAD') {
    const card = activeCardData as DoodadCard;
    if (!card) return null;

    const hasEnoughCash = financials.cash >= card.cost;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in zoom-in-95 duration-200">
        <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-rose-500/40 shadow-2xl shadow-rose-950/50 overflow-hidden flex flex-col">
          <div className="p-4 bg-gradient-to-r from-rose-950 to-slate-900 border-b border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold">
                CAPRICHO / DRENAJE DE LIQUIDEZ
              </span>
              <h3 className="text-base font-bold text-white">{card.title}</h3>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{card.description}</p>

            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-center justify-between font-mono">
              <span className="text-xs text-slate-400">Efectivo Deducido:</span>
              <span className="text-lg font-bold text-rose-400">-${card.cost.toLocaleString()}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 font-mono font-bold text-purple-300">
                <Sparkles className="w-3.5 h-3.5" /> POR QUÉ ESTO ES UN CAPRICHO
              </div>
              <p className="text-slate-300 leading-relaxed italic">{card.richDadInsight}</p>
            </div>
          </div>

          <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex justify-end">
            <button
              onClick={() => onPayDoodad(card)}
              id="pay-doodad-btn"
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white shadow-lg shadow-rose-950 active:scale-95 transition-all"
            >
              <span>{hasEnoughCash ? `PAGAR $${card.cost} Y VOLVER` : `PAGAR CON PRÉSTAMO Y VOLVER`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. MARKET EVENT MODAL
  if (activeModal === 'MARKET') {
    const card = activeCardData as MarketCard;
    if (!card) return null;

    // Find eligible assets in player's portfolio
    const matchingAssets = assets.filter((a) => {
      if (card.affectedCategory && a.category === card.affectedCategory) return true;
      if (card.stockSymbol && a.symbol === card.stockSymbol) return true;
      return false;
    });

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in zoom-in-95 duration-200">
        <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-purple-500/40 shadow-2xl shadow-purple-950/50 overflow-hidden flex flex-col">
          <div className="p-4 bg-gradient-to-r from-purple-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold">
                  CAMBIO EN EL MERCADO ECONÓMICO
                </span>
                <h3 className="text-base font-bold text-white">{card.title}</h3>
              </div>
            </div>
            <button
              onClick={onPassCard}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Volver al tablero"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{card.description}</p>

            {/* Educational insight */}
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-slate-300 space-y-1">
              <span className="text-purple-300 font-bold font-mono">💡 Dinámica de Mercado:</span>
              <p className="italic">{card.richDadInsight}</p>
            </div>

            {/* List matching assets for sale */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-slate-400 uppercase">Tus Activos Elegibles para Vender:</div>
              {matchingAssets.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-500">
                  Actualmente no posees activos afectados por este evento de mercado específico.
                </div>
              ) : (
                <div className="space-y-2">
                  {matchingAssets.map((asset) => {
                    let sellPayout = 0;
                    if (card.newPricePerUnit && asset.sharesOrUnits) {
                      sellPayout = asset.sharesOrUnits * card.newPricePerUnit;
                    } else if (card.cashOfferPerAsset) {
                      sellPayout = card.cashOfferPerAsset;
                    } else if (card.multiplier) {
                      sellPayout = asset.monthlyCashFlow * card.multiplier;
                    }

                    return (
                      <div
                        key={asset.id}
                        className="p-3 rounded-xl bg-slate-950 border border-purple-500/30 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="text-xs font-bold text-white">{asset.name}</div>
                          <div className="text-[11px] font-mono text-slate-400">
                            Flujo: +${asset.monthlyCashFlow}/mes
                          </div>
                        </div>
                        <button
                          onClick={() => onSellAssetInMarket(asset.id, sellPayout)}
                          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-mono font-bold text-xs shadow-md active:scale-95 transition-all"
                        >
                          VENDER POR ${sellPayout.toLocaleString()}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex justify-end">
            <button
              onClick={onPassCard}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-mono text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>VOLVER AL TABLERO (LISTO)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. SIDE HUSTLE MODAL
  if (activeModal === 'SIDE_HUSTLE') {
    const amount = 850;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in zoom-in-95 duration-200">
        <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-amber-500/40 shadow-2xl shadow-amber-950/50 p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                PAGO DE TRABAJO EXTRA
              </span>
              <h3 className="text-base font-bold text-white">Sprint Freelance Completado</h3>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            ¡Completaste un sprint rápido de UI y desarrollo para una startup! Capital instantáneo recaudado.
          </p>
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between font-mono">
            <span className="text-xs text-slate-400">Efectivo Extra:</span>
            <span className="text-lg font-bold text-amber-400">+${amount}</span>
          </div>
          <button
            onClick={() => onCollectSideHustle(amount)}
            className="w-full py-2.5 rounded-xl font-mono text-xs font-bold uppercase bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>COBRAR ${amount} Y VOLVER AL TABLERO</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 6. CHARITY MODAL
  if (activeModal === 'CHARITY') {
    const charityAmount = Math.round(financials.cash * 0.1);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in zoom-in-95 duration-200">
        <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-pink-500/40 shadow-2xl shadow-pink-950/50 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-pink-400 font-bold">
                  RETRIBUIR A LA COMUNIDAD
                </span>
                <h3 className="text-base font-bold text-white">Matriz de Donación</h3>
              </div>
            </div>
            <button
              onClick={onPassCard}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Volver al tablero"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Dona el 10% de tu efectivo actual (${charityAmount.toLocaleString()}) a programas educativos de tecnología para jóvenes.
            ¡A cambio, tira <strong>2 dados durante tus próximos 3 turnos</strong> para avanzar el doble de rápido!
          </p>
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              onClick={onPassCard}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-mono font-bold text-slate-400 hover:text-white bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>PASAR Y VOLVER</span>
            </button>
            <button
              onClick={onAcceptCharity}
              className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-950 active:scale-95"
            >
              DONAR ${charityAmount.toLocaleString()} Y ACTIVAR 2 DADOS
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 7. LIFESTYLE INFLATION MODAL
  if (activeModal === 'LIFESTYLE') {
    const expenseIncrease = 180;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in zoom-in-95 duration-200">
        <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-orange-500/40 shadow-2xl shadow-orange-950/50 p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-orange-400 font-bold">
                INFLACIÓN DE ESTILO DE VIDA
              </span>
              <h3 className="text-base font-bold text-white">Compromiso Adicional</h3>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Adoptaste una mascota robótica cyberpunk y mejoraste tu conexión a fibra óptica premium. Tus gastos fijos mensuales
            aumentan en <strong>+${expenseIncrease}/mes</strong>.
          </p>
          <button
            onClick={() => onAcceptLifestyle(expenseIncrease, 'Mascota Robótica y Fibra Premium')}
            className="w-full py-2.5 rounded-xl font-mono text-xs font-bold uppercase bg-orange-600 hover:bg-orange-500 text-white active:scale-95 flex items-center justify-center gap-2"
          >
            <span>ACEPTAR COMPROMISO Y VOLVER AL TABLERO</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 8. FAST TRACK PROMOTION MODAL
  if (activeModal === 'FAST_TRACK_PROMOTION') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-in zoom-in-90 duration-300">
        <div className="w-full max-w-lg rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-400 shadow-2xl shadow-cyan-500/40 p-6 text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-400 to-emerald-400 flex items-center justify-center text-3xl shadow-xl shadow-cyan-500/40 animate-bounce">
            🚀
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black tracking-wider text-white uppercase font-mono">
              ¡CARRERA DE RATAS SUPERADA!
            </h2>
            <p className="text-xs font-mono text-cyan-300">
              Tu flujo pasivo (${financials.passiveIncome}/mes) ha superado oficialmente todos tus gastos mensuales fijos (${financials.totalExpenses}/mes)!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left space-y-2 text-xs font-mono text-slate-300">
            <div className="text-cyan-400 font-bold uppercase">⚡ Bienvenido a la Vía Rápida:</div>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>¡Tu capital inicial en la Vía Rápida se multiplica por 100 veces tu flujo mensual!</li>
              <li>Cobra dividendos empresariales masivos en cada Día de Flujo de Caja.</li>
              <li>Adquiere infraestructuras tecnológicas multimillonarias y megaempresas.</li>
              <li>
                <strong>Condición de Victoria:</strong> Cae en tu Meta Soñada elegida (
                <span className="text-white font-bold">{selectedDream?.title}</span>) con suficiente capital, o genera
                ¡+$50,000/mes adicionales en flujo pasivo!
              </li>
            </ul>
          </div>

          <button
            onClick={onPromoteToFastTrack}
            id="enter-fast-track-congrats-btn"
            className="w-full py-3.5 rounded-xl font-mono text-sm font-extrabold uppercase tracking-wider bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 text-slate-950 shadow-xl shadow-cyan-500/30 hover:scale-[1.02] active:scale-95 transition-all"
          >
            ENTRAR A LA VÍA RÁPIDA 🌟
          </button>
        </div>
      </div>
    );
  }

  return null;
};
