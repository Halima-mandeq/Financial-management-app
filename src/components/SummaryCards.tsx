import React from 'react';
import { TrendingUp, TrendingDown, Wallet, AlertTriangle, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { formatMoney } from '../utils/formatters';

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  monthlyLimit: number;
  currency: string;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalIncome,
  totalExpenses,
  netBalance,
  monthlyLimit,
  currency,
}) => {
  const budgetPercentage = monthlyLimit > 0 ? Math.round((totalExpenses / monthlyLimit) * 100) : 0;
  const isOverBudget = budgetPercentage > 100;
  // Digniin casaan ah marka kharashku ku dhowaado (>= 75%) ama dhaafo xadka
  const isApproachingLimit = budgetPercentage >= 75 && !isOverBudget;
  const showRedAlert = isApproachingLimit || isOverBudget;
  const remainingBudget = Math.max(0, monthlyLimit - totalExpenses);
  const overageAmount = Math.max(0, totalExpenses - monthlyLimit);

  return (
    <div id="summary-section" className="space-y-4">
      {/* 1. MUUQAALKA DIGNIINTA CAS DEGDEDA AH (RED BUDGET ALERT BANNER) */}
      {showRedAlert && (
        <div
          id="budget-warning-alert"
          className="relative overflow-hidden rounded-2xl border-2 border-red-500/80 bg-gradient-to-r from-red-50 via-rose-50 to-red-100/70 dark:from-red-950/70 dark:via-rose-950/50 dark:to-red-900/40 p-4 sm:p-5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              {/* Pulsing red badge */}
              <div className="relative shrink-0 mt-0.5">
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600"></span>
                </span>
                <div className="w-11 h-11 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/30">
                  {isOverBudget ? (
                    <ShieldAlert className="w-6 h-6 animate-bounce" />
                  ) : (
                    <AlertTriangle className="w-6 h-6" />
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide uppercase bg-red-600 text-white shadow-xs">
                    {isOverBudget ? 'Over Budget' : 'Budget Warning'}
                  </span>
                  <span className="text-xs font-bold text-red-700 dark:text-red-300 bg-red-100/90 dark:bg-red-900/60 px-2 py-0.5 rounded-md border border-red-200 dark:border-red-800">
                    {budgetPercentage}% of limit reached
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-red-950 dark:text-red-100 mt-1">
                  {isOverBudget
                    ? 'Monthly spending has completely exceeded the budget limit!'
                    : 'Spending is rapidly approaching the monthly budget limit!'}
                </h3>

                <p className="text-xs sm:text-sm text-red-800 dark:text-red-200 mt-1 leading-relaxed">
                  {isOverBudget ? (
                    <>
                      You have spent <strong>{formatMoney(totalExpenses, currency)}</strong> of your <strong>{formatMoney(monthlyLimit, currency)}</strong> budget. Exceeded by <strong>{formatMoney(overageAmount, currency)}</strong>. Consider pausing non-essential expenses.
                    </>
                  ) : (
                    <>
                      You have already spent <strong>{formatMoney(totalExpenses, currency)}</strong> of your <strong>{formatMoney(monthlyLimit, currency)}</strong> limit. Only <strong>{formatMoney(remainingBudget, currency)}</strong> remains before reaching the cap.
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Quick stats box in red */}
            <div className="shrink-0 bg-white/90 dark:bg-slate-900/90 border border-red-200 dark:border-red-800/80 rounded-xl p-3 text-center sm:text-right min-w-[150px] shadow-2xs">
              <div className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                {isOverBudget ? 'Budget Exceeded' : 'Remaining Budget'}
              </div>
              <div className="text-xl font-extrabold text-red-700 dark:text-red-300 tracking-tight mt-0.5">
                {isOverBudget
                  ? `+${formatMoney(overageAmount, currency)}`
                  : formatMoney(remainingBudget, currency)}
              </div>
              <div className="text-[10px] text-red-500 dark:text-red-400 font-medium mt-0.5">
                {isOverBudget ? 'Over budget this month' : 'Left to spend'}
              </div>
            </div>
          </div>

          {/* Red Progress Bar inside Alert */}
          <div className="mt-3.5 pt-3 border-t border-red-200/80 dark:border-red-800/60">
            <div className="flex items-center justify-between text-xs font-bold text-red-800 dark:text-red-200 mb-1.5">
              <span>Budget Utilization Rate:</span>
              <span>{budgetPercentage}% / 100%</span>
            </div>
            <div className="w-full bg-red-200/80 dark:bg-red-950/80 rounded-full h-3 overflow-hidden p-0.5">
              <div
                className="bg-red-600 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. 3 Main Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Income */}
        <div id="card-income" className="relative overflow-hidden bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-white dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-slate-900 rounded-3xl border-2 border-emerald-500/30 hover:border-emerald-500 p-6 shadow-lg shadow-emerald-500/5 transition-all hover:shadow-xl hover:shadow-emerald-500/10 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/20">
              Total Income
            </span>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-600/35 ring-4 ring-emerald-500/20 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5 drop-shadow-xs stroke-[2.5]" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            +{formatMoney(totalIncome, currency)}
          </div>
          <p className="mt-2 text-xs text-emerald-700/90 dark:text-emerald-400/90 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            All incoming revenue recorded
          </p>
        </div>

        {/* Total Expenses */}
        <div
          id="card-expense"
          className={`relative overflow-hidden rounded-3xl p-6 transition-all shadow-lg group ${
            showRedAlert
              ? 'border-2 border-red-500 bg-gradient-to-br from-red-500/20 via-rose-500/15 to-white dark:from-red-950/70 dark:via-rose-950/50 dark:to-slate-900 shadow-red-500/15 hover:shadow-xl hover:border-red-600'
              : 'border-2 border-rose-500/30 hover:border-rose-500 bg-gradient-to-br from-rose-500/15 via-orange-500/10 to-white dark:from-rose-950/40 dark:via-orange-950/20 dark:to-slate-900 shadow-rose-500/5 hover:shadow-xl hover:shadow-rose-500/10'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-rose-800 dark:text-rose-300 uppercase tracking-wider px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/20">
                Total Expenses
              </span>
              {showRedAlert && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white shadow-xs">
                  Alert
                </span>
              )}
            </div>
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform ${
                showRedAlert
                  ? 'bg-gradient-to-tr from-red-600 via-rose-600 to-orange-600 shadow-red-600/40 ring-4 ring-red-500/30'
                  : 'bg-gradient-to-tr from-rose-600 via-pink-600 to-orange-500 shadow-rose-600/35 ring-4 ring-rose-500/20'
              }`}
            >
              <TrendingDown className="w-5 h-5 drop-shadow-xs stroke-[2.5]" />
            </div>
          </div>
          <div
            className={`text-3xl sm:text-4xl font-black tracking-tight ${
              showRedAlert ? 'text-red-600 dark:text-red-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            -{formatMoney(totalExpenses, currency)}
          </div>
          <p className="mt-2 text-xs text-rose-700/90 dark:text-rose-400/90 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
            Total outgoing expenses
          </p>
        </div>

        {/* Net Balance */}
        <div
          id="card-balance"
          className="relative overflow-hidden bg-gradient-to-br from-indigo-500/15 via-sky-500/10 to-white dark:from-indigo-950/40 dark:via-sky-950/20 dark:to-slate-900 rounded-3xl border-2 border-indigo-500/30 hover:border-indigo-500 p-6 shadow-lg shadow-indigo-500/5 transition-all hover:shadow-xl hover:shadow-indigo-500/10 group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black text-indigo-800 dark:text-indigo-300 uppercase tracking-wider px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/20">
              Net Balance
            </span>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform ${
              netBalance >= 0
                ? 'bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 shadow-indigo-600/35 ring-4 ring-indigo-500/20'
                : 'bg-gradient-to-tr from-red-600 to-rose-600 shadow-red-600/30 ring-4 ring-red-400/30'
            }`}>
              <Wallet className="w-5 h-5 drop-shadow-xs stroke-[2.5]" />
            </div>
          </div>
          <div className={`text-3xl sm:text-4xl font-black tracking-tight ${
            netBalance >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {netBalance < 0 ? '-' : ''}{formatMoney(netBalance, currency)}
          </div>
          <p className="mt-2 text-xs text-indigo-700/90 dark:text-indigo-400/90 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
            {netBalance >= 0 ? 'Net savings / Available funds' : 'Alert: Spending exceeds income'}
          </p>
        </div>
      </div>

      {/* 3. Monthly Budget Progress Tracker Card */}
      <div
        id="budget-progress-banner"
        className={`rounded-3xl p-5 sm:p-6 shadow-md transition-all ${
          showRedAlert
            ? 'bg-gradient-to-r from-red-50/90 via-rose-50/70 to-white dark:from-red-950/40 dark:via-rose-950/30 dark:to-slate-900 border-2 border-red-400/80 dark:border-red-800'
            : 'bg-gradient-to-r from-white via-slate-50 to-emerald-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 border-2 border-slate-200/90 dark:border-slate-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Monthly Budget Utilization:
            </span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
              Spent {formatMoney(totalExpenses, currency)} of {formatMoney(monthlyLimit, currency)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {isOverBudget ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950 px-3 py-1 rounded-full border border-red-300 dark:border-red-800 shadow-2xs">
                <ShieldAlert className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                Over Budget ({budgetPercentage}%)
              </span>
            ) : isApproachingLimit ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950 px-3 py-1 rounded-full border border-red-300 dark:border-red-800 shadow-2xs animate-pulse">
                <AlertCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                Warning: Near Limit ({budgetPercentage}%)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Healthy Budget ({budgetPercentage}%)
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Colorful Multi-Stop Progress Bar */}
        <div className="w-full bg-slate-200/80 dark:bg-slate-800 rounded-full h-3 overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-700 shadow-sm ${
              showRedAlert
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 shadow-rose-500/30'
                : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 shadow-emerald-500/30'
            }`}
            style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
