import React, { useState } from 'react';
import {
  Target,
  PiggyBank,
  Plus,
  TrendingUp,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Edit2,
  Trash2,
  ArrowUpRight,
  ShieldAlert,
  Laptop,
  Home,
  Car,
  GraduationCap,
  Plane,
  Coins,
  DollarSign,
  Percent,
} from 'lucide-react';
import { SavingsGoal, AccountType } from '../types';
import { formatMoney, formatDateSomali } from '../utils/formatters';

interface SavingsGoalsSectionProps {
  goals: SavingsGoal[];
  currency: string;
  accountType: AccountType;
  onAddGoal: () => void;
  onEditGoal: (goal: SavingsGoal) => void;
  onDeleteGoal: (goalId: string) => void;
  onOpenDepositModal: (goal: SavingsGoal) => void;
}

export const SavingsGoalsSection: React.FC<SavingsGoalsSectionProps> = ({
  goals,
  currency,
  accountType,
  onAddGoal,
  onEditGoal,
  onDeleteGoal,
  onOpenDepositModal,
}) => {
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallPercentage =
    totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;
  const completedGoalsCount = goals.filter((g) => g.currentAmount >= g.targetAmount).length;

  const filteredGoals = goals.filter((goal) => {
    const isCompleted = goal.currentAmount >= goal.targetAmount;
    if (filter === 'completed') return isCompleted;
    if (filter === 'in_progress') return !isCompleted;
    return true;
  });

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Laptop':
        return Laptop;
      case 'ShieldAlert':
        return ShieldAlert;
      case 'Home':
        return Home;
      case 'Car':
        return Car;
      case 'GraduationCap':
        return GraduationCap;
      case 'Plane':
        return Plane;
      case 'Coins':
        return Coins;
      case 'PiggyBank':
        return PiggyBank;
      default:
        return Target;
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bgBadge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
          bar: 'bg-blue-600',
          text: 'text-blue-600 dark:text-blue-400',
          glow: 'from-blue-500/10 to-transparent',
        };
      case 'purple':
        return {
          bgBadge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
          bar: 'bg-purple-600',
          text: 'text-purple-600 dark:text-purple-400',
          glow: 'from-purple-500/10 to-transparent',
        };
      case 'amber':
        return {
          bgBadge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
          bar: 'bg-amber-500',
          text: 'text-amber-600 dark:text-amber-400',
          glow: 'from-amber-500/10 to-transparent',
        };
      case 'rose':
        return {
          bgBadge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800',
          bar: 'bg-rose-500',
          text: 'text-rose-600 dark:text-rose-400',
          glow: 'from-rose-500/10 to-transparent',
        };
      case 'cyan':
        return {
          bgBadge: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800',
          bar: 'bg-cyan-500',
          text: 'text-cyan-600 dark:text-cyan-400',
          glow: 'from-cyan-500/10 to-transparent',
        };
      case 'indigo':
        return {
          bgBadge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
          bar: 'bg-indigo-600',
          text: 'text-indigo-600 dark:text-indigo-400',
          glow: 'from-indigo-500/10 to-transparent',
        };
      default:
        return {
          bgBadge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
          bar: 'bg-emerald-600',
          text: 'text-emerald-600 dark:text-emerald-400',
          glow: 'from-emerald-500/10 to-transparent',
        };
    }
  };

  const getDaysLeft = (deadline?: string) => {
    if (!deadline) return null;
    const targetDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border-2 border-slate-200/90 dark:border-slate-800 shadow-md shadow-slate-950/5 dark:shadow-none">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400/20">
            <Target className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Savings Goals
              </h3>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {goals.length} Goal{goals.length === 1 ? '' : 's'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track progress toward dedicated reserves, emergency funds, or equipment
            </p>
          </div>
        </div>

        {/* Action Button & Filters */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold border border-slate-200/60 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All ({goals.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('in_progress')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                filter === 'in_progress'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              In Progress ({goals.length - completedGoalsCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('completed')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                filter === 'completed'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-2xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Completed ({completedGoalsCount})
            </button>
          </div>

          <button
            onClick={onAddGoal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-md shadow-emerald-600/25 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Goal</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Banner */}
      {goals.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 p-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-indigo-500/10 dark:from-emerald-950/40 dark:via-slate-800/40 dark:to-indigo-950/30 rounded-2xl border-2 border-emerald-500/20 dark:border-emerald-800/40">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Total Amount Saved
            </div>
            <div className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
              {formatMoney(totalSaved, currency)}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Total Target Goal
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5 font-mono">
              {formatMoney(totalTarget, currency)}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <span>Overall Progress:</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400">{overallPercentage}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-1.5 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${overallPercentage}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Goals Grid */}
      {filteredGoals.length === 0 ? (
        <div className="text-center py-10 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl mt-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
            <PiggyBank className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {filter === 'completed'
              ? 'No savings goals completed yet'
              : 'No savings goals created yet'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            Allocate your funds to dedicated goals like "Emergency Fund" or "New Equipment" to track your milestones.
          </p>
          <button
            onClick={onAddGoal}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Goal</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {filteredGoals.map((goal) => {
            const IconComponent = getIconComponent(goal.icon);
            const colorConfig = getColorClasses(goal.color);
            const percentage =
              goal.targetAmount > 0
                ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
                : 0;
            const isCompleted = goal.currentAmount >= goal.targetAmount;
            const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
            const daysLeft = getDaysLeft(goal.deadline);

            return (
              <div
                key={goal.id}
                className={`relative rounded-2xl p-4.5 border transition-all duration-200 flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 shadow-2xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
                }`}
              >
                {/* Top Row: Icon, Title & Menu */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${colorConfig.bgBadge}`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {goal.title}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Completed 🎉</span>
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                              {percentage}% Achieved
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Options / Action Menu */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onEditGoal(goal)}
                        title="Edit Goal"
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete goal "${goal.title}"?`)) {
                            onDeleteGoal(goal.id);
                          }
                        }}
                        title="Delete Goal"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Notes / Subtitle */}
                  {goal.notes && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                      {goal.notes}
                    </p>
                  )}

                  {/* Financial Amounts & Target */}
                  <div className="space-y-1 mb-2.5">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Current Saved:</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                        {formatMoney(goal.currentAmount, currency)}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Target Goal:</span>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 font-mono">
                        {formatMoney(goal.targetAmount, currency)}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3 border border-slate-200/50 dark:border-slate-700/50">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${colorConfig.bar}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  {/* Deadline & Remaining Badge */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-4 flex-wrap gap-1">
                    {goal.deadline ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>
                          {daysLeft !== null && daysLeft >= 0
                            ? `${daysLeft} days remaining`
                            : `Deadline passed`}
                        </span>
                      </div>
                    ) : (
                      <span>Open Goal (No deadline)</span>
                    )}

                    {!isCompleted && (
                      <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">
                        {formatMoney(remaining, currency)} remaining
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Quick Action: Deposit / Withdraw */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => onOpenDepositModal(goal)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-xl transition-all cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Deposit / Withdraw</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
