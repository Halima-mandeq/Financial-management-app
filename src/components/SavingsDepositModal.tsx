import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  PiggyBank,
  Sparkles,
} from 'lucide-react';
import { SavingsGoal } from '../types';
import { formatMoney } from '../utils/formatters';

interface SavingsDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: SavingsGoal | null;
  onUpdateAmount: (goalId: string, newAmount: number, delta: number, note?: string) => void;
  currency?: string;
}

export const SavingsDepositModal: React.FC<SavingsDepositModalProps> = ({
  isOpen,
  onClose,
  goal,
  onUpdateAmount,
  currency = 'USD ($)',
}) => {
  const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit');
  const [amountInput, setAmountInput] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !goal) return null;

  const currentAmount = goal.currentAmount;
  const targetAmount = goal.targetAmount;
  const remaining = Math.max(0, targetAmount - currentAmount);

  const delta = parseFloat(amountInput) || 0;
  const newAmount = mode === 'deposit' ? currentAmount + delta : Math.max(0, currentAmount - delta);
  const newProgress = Math.min(100, Math.round((newAmount / targetAmount) * 100));

  const quickAmounts = [20, 50, 100, 250, 500];

  const handleQuickAdd = (amt: number) => {
    setAmountInput(amt.toString());
    setError('');
  };

  const handleFillRemaining = () => {
    if (remaining > 0) {
      setMode('deposit');
      setAmountInput(remaining.toString());
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(delta) || delta <= 0) {
      setError('Please enter an amount greater than 0.');
      return;
    }

    if (mode === 'withdraw' && delta > currentAmount) {
      setError(`Cannot withdraw more than current savings (${formatMoney(currentAmount, currency)}).`);
      return;
    }

    onUpdateAmount(goal.id, newAmount, mode === 'deposit' ? delta : -delta, note.trim() || undefined);
    setAmountInput('');
    setNote('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <PiggyBank className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold truncate max-w-[240px]">
                {goal.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Deposit or withdraw from goal funds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance Bar */}
        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Current Saved:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {formatMoney(currentAmount, currency)} / {formatMoney(targetAmount, currency)}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, (currentAmount / targetAmount) * 100)}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setMode('deposit');
                setError('');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'deposit'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Deposit</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('withdraw');
                setError('');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'withdraw'
                  ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Minus className="w-3.5 h-3.5" />
              <span>- Withdraw</span>
            </button>
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Amount ({currency})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 text-base font-bold">
                {currency.includes('SOS') ? 'Sh' : '$'}
              </span>
              <input
                type="number"
                step="any"
                autoFocus
                value={amountInput}
                onChange={(e) => {
                  setAmountInput(e.target.value);
                  if (error) setError('');
                }}
                placeholder="0.00"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-bold focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            {error && <p className="text-[11px] text-rose-500 mt-1">{error}</p>}
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
              <span>Quick Amount:</span>
              {remaining > 0 && mode === 'deposit' && (
                <button
                  type="button"
                  onClick={handleFillRemaining}
                  className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Fill remaining (${remaining})</span>
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleQuickAdd(amt)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  +{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Note (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., Monthly savings deposit from salary..."
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Dynamic Result Preview */}
          {delta > 0 && (
            <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                <span>Updated Goal Balance:</span>
                <span>{formatMoney(newAmount, currency)} ({newProgress}%)</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                mode === 'deposit'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{mode === 'deposit' ? 'Confirm Deposit' : 'Confirm Withdrawal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
