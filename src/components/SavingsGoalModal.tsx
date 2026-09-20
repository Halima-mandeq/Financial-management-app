import React, { useState, useEffect } from 'react';
import {
  X,
  Target,
  PiggyBank,
  Laptop,
  ShieldAlert,
  Home,
  Car,
  GraduationCap,
  Plane,
  Coins,
  Sparkles,
  CheckCircle2,
  Calendar,
  DollarSign,
  Info,
} from 'lucide-react';
import { SavingsGoal, AccountType } from '../types';

interface SavingsGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: Omit<SavingsGoal, 'id' | 'createdAt'> | SavingsGoal) => void;
  editingGoal: SavingsGoal | null;
  currency?: string;
  accountType?: AccountType;
}

const AVAILABLE_ICONS = [
  { name: 'ShieldAlert', label: 'Emergency Fund', icon: ShieldAlert },
  { name: 'Laptop', label: 'Laptop / Tech', icon: Laptop },
  { name: 'Coins', label: 'Capital / Investments', icon: Coins },
  { name: 'Home', label: 'Real Estate / Housing', icon: Home },
  { name: 'GraduationCap', label: 'Education', icon: GraduationCap },
  { name: 'Car', label: 'Vehicle / Transport', icon: Car },
  { name: 'Plane', label: 'Travel / Vacation', icon: Plane },
  { name: 'PiggyBank', label: 'General Savings', icon: PiggyBank },
  { name: 'Target', label: 'Custom Target', icon: Target },
];

const AVAILABLE_COLORS = [
  { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-500', ring: 'ring-emerald-500' },
  { id: 'blue', label: 'Blue', bg: 'bg-blue-500', ring: 'ring-blue-500' },
  { id: 'purple', label: 'Purple', bg: 'bg-purple-500', ring: 'ring-purple-500' },
  { id: 'amber', label: 'Amber', bg: 'bg-amber-500', ring: 'ring-amber-500' },
  { id: 'rose', label: 'Rose', bg: 'bg-rose-500', ring: 'ring-rose-500' },
  { id: 'cyan', label: 'Cyan', bg: 'bg-cyan-500', ring: 'ring-cyan-500' },
  { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-500', ring: 'ring-indigo-500' },
] as const;

export const SavingsGoalModal: React.FC<SavingsGoalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingGoal,
  currency = 'USD ($)',
  accountType = 'family',
}) => {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState<SavingsGoal['category']>('emergency');
  const [icon, setIcon] = useState('Target');
  const [color, setColor] = useState<SavingsGoal['color']>('emerald');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title);
      setTargetAmount(editingGoal.targetAmount.toString());
      setCurrentAmount(editingGoal.currentAmount.toString());
      setDeadline(editingGoal.deadline || '');
      setCategory(editingGoal.category);
      setIcon(editingGoal.icon || 'Target');
      setColor(editingGoal.color || 'emerald');
      setNotes(editingGoal.notes || '');
    } else {
      // Default reset
      setTitle('');
      setTargetAmount('');
      setCurrentAmount('0');
      setDeadline('');
      setCategory(accountType === 'business' ? 'business' : accountType === 'personal' ? 'tech' : 'emergency');
      setIcon(accountType === 'business' ? 'Laptop' : accountType === 'personal' ? 'Laptop' : 'ShieldAlert');
      setColor(accountType === 'business' ? 'blue' : accountType === 'personal' ? 'purple' : 'emerald');
      setNotes('');
    }
    setErrors({});
  }, [editingGoal, isOpen, accountType]);

  if (!isOpen) return null;

  // Preset templates
  const presets =
    accountType === 'business'
      ? [
          { title: 'New Business Hardware', target: 1200, category: 'tech' as const, icon: 'Laptop', color: 'blue' as const },
          { title: 'Working Capital Reserve', target: 3000, category: 'business' as const, icon: 'Coins', color: 'emerald' as const },
          { title: 'Operational Emergency Fund', target: 2000, category: 'emergency' as const, icon: 'ShieldAlert', color: 'amber' as const },
        ]
      : accountType === 'personal'
      ? [
          { title: 'Emergency Cushion Fund', target: 1000, category: 'emergency' as const, icon: 'ShieldAlert', color: 'emerald' as const },
          { title: 'Laptop / Tech Upgrade', target: 850, category: 'tech' as const, icon: 'Laptop', color: 'purple' as const },
          { title: 'Courses & Professional Skills', target: 400, category: 'education' as const, icon: 'GraduationCap', color: 'cyan' as const },
        ]
      : [
          { title: 'Family Emergency Fund', target: 2500, category: 'emergency' as const, icon: 'ShieldAlert', color: 'emerald' as const },
          { title: 'Children Education Fund', target: 1800, category: 'education' as const, icon: 'GraduationCap', color: 'blue' as const },
          { title: 'Home Improvement & Maintenance', target: 1200, category: 'home' as const, icon: 'Home', color: 'amber' as const },
        ];

  const handleApplyPreset = (preset: typeof presets[0]) => {
    setTitle(preset.title);
    setTargetAmount(preset.target.toString());
    setCategory(preset.category);
    setIcon(preset.icon);
    setColor(preset.color);
    if (errors.title || errors.targetAmount) {
      setErrors({});
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Please enter a goal name.';
    }
    const target = parseFloat(targetAmount);
    if (isNaN(target) || target <= 0) {
      newErrors.targetAmount = 'Please enter a target amount greater than 0.';
    }
    const current = parseFloat(currentAmount);
    if (isNaN(current) || current < 0) {
      newErrors.currentAmount = 'Starting amount cannot be negative.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const goalData = {
      title: title.trim(),
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount) || 0,
      deadline: deadline || undefined,
      category,
      icon,
      color,
      notes: notes.trim() || undefined,
    };

    if (editingGoal) {
      onSave({
        ...editingGoal,
        ...goalData,
      });
    } else {
      onSave(goalData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white animate-in zoom-in-95 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-2xs ${
                color === 'blue'
                  ? 'bg-blue-600'
                  : color === 'purple'
                  ? 'bg-purple-600'
                  : color === 'amber'
                  ? 'bg-amber-600'
                  : color === 'rose'
                  ? 'bg-rose-600'
                  : color === 'cyan'
                  ? 'bg-cyan-600'
                  : color === 'indigo'
                  ? 'bg-indigo-600'
                  : 'bg-emerald-600'
              }`}
            >
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                {editingGoal ? 'Edit Savings Goal' : 'Create New Savings Goal'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Allocate funds towards a specific objective and monitor your milestone progress
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pt-4 pr-1 flex-1">
          {/* Quick Presets (Only when creating new) */}
          {!editingGoal && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Quick Presets</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="p-2 text-left rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all cursor-pointer group"
                  >
                    <div className="font-semibold text-xs text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 truncate">
                      {preset.title}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      ${preset.target.toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Goal Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Goal Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
              }}
              placeholder="e.g., Emergency Fund or New Business Hardware"
              className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-sm focus:outline-hidden focus:ring-2 transition-all ${
                errors.title
                  ? 'border-rose-500 ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20'
              }`}
            />
            {errors.title && <p className="text-[11px] text-rose-500 mt-1">{errors.title}</p>}
          </div>

          {/* Target Amount & Initial Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Amount ({currency}) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-semibold">
                  {currency.includes('SOS') ? 'Sh' : '$'}
                </span>
                <input
                  type="number"
                  step="any"
                  value={targetAmount}
                  onChange={(e) => {
                    setTargetAmount(e.target.value);
                    if (errors.targetAmount) setErrors((prev) => ({ ...prev, targetAmount: '' }));
                  }}
                  placeholder="0.00"
                  className={`w-full pl-8 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-sm font-semibold focus:outline-hidden focus:ring-2 transition-all ${
                    errors.targetAmount
                      ? 'border-rose-500 ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20'
                  }`}
                />
              </div>
              {errors.targetAmount && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.targetAmount}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Starting Amount Saved ({currency})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-semibold">
                  {currency.includes('SOS') ? 'Sh' : '$'}
                </span>
                <input
                  type="number"
                  step="any"
                  value={currentAmount}
                  onChange={(e) => {
                    setCurrentAmount(e.target.value);
                    if (errors.currentAmount) setErrors((prev) => ({ ...prev, currentAmount: '' }));
                  }}
                  placeholder="0.00"
                  className={`w-full pl-8 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-sm font-semibold focus:outline-hidden focus:ring-2 transition-all ${
                    errors.currentAmount
                      ? 'border-rose-500 ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20'
                  }`}
                />
              </div>
              {errors.currentAmount && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.currentAmount}</p>
              )}
            </div>
          </div>

          {/* Deadline Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
              <span>Target Deadline (Optional)</span>
              {deadline && (
                <button
                  type="button"
                  onClick={() => setDeadline('')}
                  className="text-[10px] text-slate-400 hover:text-rose-500 cursor-pointer"
                >
                  Clear Date
                </button>
              )}
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Icon
            </label>
            <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5">
              {AVAILABLE_ICONS.map((item) => {
                const IconComp = item.icon;
                const isSelected = icon === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setIcon(item.name)}
                    title={item.label}
                    className={`p-2 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs scale-105'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Color Accent
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {AVAILABLE_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  title={c.label}
                  className={`w-7 h-7 rounded-full ${c.bg} transition-all cursor-pointer flex items-center justify-center ${
                    color === c.id ? `ring-3 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ${c.ring} scale-110` : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  {color === c.id && <CheckCircle2 className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Notes / Details */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notes & Strategy (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add details, milestones, or monthly contribution plans..."
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Live Progress Preview */}
          {targetAmount && parseFloat(targetAmount) > 0 && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Estimated Milestone:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {Math.min(100, Math.round(((parseFloat(currentAmount) || 0) / parseFloat(targetAmount)) * 100))}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    color === 'blue'
                      ? 'bg-blue-600'
                      : color === 'purple'
                      ? 'bg-purple-600'
                      : color === 'amber'
                      ? 'bg-amber-500'
                      : color === 'rose'
                      ? 'bg-rose-500'
                      : color === 'cyan'
                      ? 'bg-cyan-500'
                      : color === 'indigo'
                      ? 'bg-indigo-600'
                      : 'bg-emerald-600'
                  }`}
                  style={{
                    width: `${Math.min(100, Math.max(0, ((parseFloat(currentAmount) || 0) / parseFloat(targetAmount)) * 100))}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{editingGoal ? 'Save Changes' : 'Create Goal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
