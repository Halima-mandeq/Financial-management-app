import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Lightbulb, TrendingDown, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Transaction, BudgetConfig, FinancialTip, AccountType } from '../types';

interface FinancialTipCardProps {
  transactions: Transaction[];
  config: BudgetConfig;
  accountType: AccountType;
  userName: string;
}

export function FinancialTipCard({
  transactions,
  config,
  accountType,
  userName,
}: FinancialTipCardProps) {
  const [tip, setTip] = useState<FinancialTip | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fallback tips tailored to Somali daily life if offline or first load
  const getDefaultTip = (): FinancialTip => {
    const expenses = transactions.filter((t) => t.type === 'kharash');
    const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);

    if (totalExpense > config.monthlyLimit && config.monthlyLimit > 0) {
      return {
        title: 'Budget Alert: Reduce Non-Essential Spending',
        tip: 'Your spending is near or exceeds this month’s target limit. Review non-essential purchases like takeout dining and discretionary subscriptions.',
        action: 'Pause non-urgent purchases for the next 7 days to restore your net balance.',
        estimatedSavings: '15% - 20% savings',
        category: 'Budget Management',
        urgency: 'high',
      };
    }

    if (accountType === 'business') {
      return {
        title: 'Separate Business & Personal Cash Flow',
        tip: 'High-performing operations keep distinct balances to accurately measure operational profit margins and prevent cash crunches.',
        action: 'Log daily receipts immediately at end of business day.',
        estimatedSavings: '$100 - $250 / mo',
        category: 'Cash Flow',
        urgency: 'positive',
      };
    }

    return {
      title: 'The 50/30/20 Household Savings Rule',
      tip: 'Allocate 50% of your incoming revenue to essentials (housing & groceries), 30% to lifestyle needs, and 20% directly into your savings goals.',
      action: 'Transfer at least $20 to your emergency savings goal today.',
      estimatedSavings: '20% Monthly Savings',
      category: 'Savings Strategy',
      urgency: 'positive',
    };
  };

  const fetchAiTip = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/financial-tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactions,
          accountType,
          monthlyLimit: config.monthlyLimit,
          currency: config.currency,
          userName,
        }),
      });

      if (!res.ok) {
        throw new Error('Server returned an error');
      }

      const data = await res.json();
      if (data.success && data.tipData) {
        setTip(data.tipData);
        // Cache in sessionStorage
        sessionStorage.setItem(
          `financial_tip_${accountType}_${userName}`,
          JSON.stringify({ ...data.tipData, generatedAt: new Date().toISOString() })
        );
      } else {
        throw new Error(data.error || 'Failed to fetch tip');
      }
    } catch (err: any) {
      console.warn('Gemini API fetch note:', err);
      // Use intelligent local fallback
      const fallback = getDefaultTip();
      setTip(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check cached tip first
    const cached = sessionStorage.getItem(`financial_tip_${accountType}_${userName}`);
    if (cached) {
      try {
        setTip(JSON.parse(cached));
        return;
      } catch (e) {
        // ignore
      }
    }

    fetchAiTip();
  }, [accountType, userName]);

  const currentTip = tip || getDefaultTip();

  const getUrgencyStyles = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return {
          badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800',
          accent: 'border-l-rose-500',
          iconColor: 'text-rose-600 dark:text-rose-400',
        };
      case 'medium':
        return {
          badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          accent: 'border-l-amber-500',
          iconColor: 'text-amber-600 dark:text-amber-400',
        };
      default:
        return {
          badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          accent: 'border-l-emerald-500',
          iconColor: 'text-emerald-600 dark:text-emerald-400',
        };
    }
  };

  const urgencyStyle = getUrgencyStyles(currentTip.urgency);

  return (
    <div
      id="financial-tip-section"
      className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 text-slate-900 dark:text-slate-100 p-5 sm:p-6 shadow-md shadow-slate-950/5 dark:shadow-none border border-slate-200/90 dark:border-slate-800 transition-all hover:border-emerald-300 dark:hover:border-emerald-700"
    >
      {/* Ambient Accent Highlights */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex items-center justify-between gap-3 pb-3.5 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                AI Financial Advisor (Gemini AI)
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 shadow-xs">
                <Zap className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                Tip of the Day
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Smart expense analysis and personalized savings recommendations
            </p>
          </div>
        </div>

        {/* Refresh AI Tip Button */}
        <button
          id="refresh-ai-tip-btn"
          onClick={fetchAiTip}
          disabled={isLoading}
          title="Generate new financial tip"
          className="relative z-10 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-95 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh Tip</span>
        </button>
      </div>

      {/* Tip Content Area */}
      <div className="relative z-10 mt-4 grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Left Column: Main Tip */}
        <div className="md:col-span-8 space-y-3.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span className="p-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-300 shrink-0" />
              </span>
              {currentTip.title}
            </h3>
            {currentTip.category && (
              <span className="text-[11px] font-bold px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 shadow-xs">
                {currentTip.category}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            {currentTip.tip}
          </p>

          {/* Action Callout Box */}
          <div className="mt-3 p-3.5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800/60 flex items-start gap-3 shadow-xs">
            <div className="p-1.5 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5 shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Action of the Day:
              </div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 mt-0.5 leading-snug">
                {currentTip.action}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Estimated Savings & Summary */}
        <div className="md:col-span-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Estimated Savings:
            </span>
            <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shadow-xs">
              {currentTip.estimatedSavings}
            </span>
          </div>

          <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
            Based on <strong className="text-emerald-700 dark:text-emerald-300 font-bold">{transactions.length} transactions</strong> analyzed this month.
          </div>

          <div className="pt-2.5 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Account: <strong className="text-slate-800 dark:text-white capitalize font-bold">{accountType}</strong></span>
            <span className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
              Gemini 3.8 Flash
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
