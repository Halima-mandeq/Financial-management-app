import { useState, useRef, useEffect } from 'react';
import { Bell, AlertTriangle, AlertOctagon, CheckCircle2, X, ChevronRight, Info } from 'lucide-react';
import { Transaction, BudgetConfig } from '../types';
import { formatMoney } from '../utils/formatters';

export interface BudgetNotification {
  id: string;
  type: 'danger_100' | 'warning_80' | 'info_healthy';
  title: string;
  message: string;
  spentPercentage: number;
  spentAmount: number;
  limitAmount: number;
  date: string;
  read: boolean;
}

interface NotificationCenterProps {
  transactions: Transaction[];
  config: BudgetConfig;
  onOpenSettings: () => void;
}

export function NotificationCenter({
  transactions,
  config,
  onOpenSettings,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('xaliimo_dismissed_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Calculate current month's expenses
  const now = new Date();
  const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const currentMonthExpenses = transactions
    .filter((t) => t.type === 'kharash' && t.date.startsWith(currentMonthPrefix))
    .reduce((acc, t) => acc + t.amount, 0);

  const monthlyLimit = config.monthlyLimit || 0;
  const spentPercentage = monthlyLimit > 0 ? (currentMonthExpenses / monthlyLimit) * 100 : 0;

  // Build active notifications list
  const notifications: BudgetNotification[] = [];

  if (monthlyLimit > 0) {
    if (spentPercentage >= 100) {
      notifications.push({
        id: `notif-100-${currentMonthPrefix}`,
        type: 'danger_100',
        title: 'Critical Alert: 100% of Monthly Budget Reached',
        message: `Your monthly expenses (${formatMoney(currentMonthExpenses, config.currency)}) have exceeded your budget limit of ${formatMoney(monthlyLimit, config.currency)}.`,
        spentPercentage: Math.round(spentPercentage),
        spentAmount: currentMonthExpenses,
        limitAmount: monthlyLimit,
        date: 'This Month',
        read: dismissedIds.includes(`notif-100-${currentMonthPrefix}`),
      });
    } else if (spentPercentage >= 80) {
      notifications.push({
        id: `notif-80-${currentMonthPrefix}`,
        type: 'warning_80',
        title: 'Warning: 80% of Monthly Budget Reached',
        message: `You have used ${Math.round(spentPercentage)}% of your monthly budget. Only ${formatMoney(monthlyLimit - currentMonthExpenses, config.currency)} remaining.`,
        spentPercentage: Math.round(spentPercentage),
        spentAmount: currentMonthExpenses,
        limitAmount: monthlyLimit,
        date: 'This Month',
        read: dismissedIds.includes(`notif-80-${currentMonthPrefix}`),
      });
    } else {
      // Normal / Healthy
      notifications.push({
        id: `notif-healthy-${currentMonthPrefix}`,
        type: 'info_healthy',
        title: 'Budget Status: Healthy',
        message: `You have used ${Math.round(spentPercentage)}% of your budget this month. ${formatMoney(Math.max(0, monthlyLimit - currentMonthExpenses), config.currency)} remaining.`,
        spentPercentage: Math.round(spentPercentage),
        spentAmount: currentMonthExpenses,
        limitAmount: monthlyLimit,
        date: 'This Month',
        read: true,
      });
    }
  }

  const unreadCount = notifications.filter((n) => !n.read && (n.type === 'danger_100' || n.type === 'warning_80')).length;

  const handleDismiss = (id: string) => {
    const updated = [...dismissedIds, id];
    setDismissedIds(updated);
    localStorage.setItem('xaliimo_dismissed_notifications', JSON.stringify(updated));
  };

  const getNotificationTheme = (type: BudgetNotification['type']) => {
    switch (type) {
      case 'danger_100':
        return {
          cardBg: 'bg-rose-500/10 border-rose-500/30 text-rose-100',
          icon: <AlertOctagon className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />,
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          progressColor: 'bg-rose-500',
        };
      case 'warning_80':
        return {
          cardBg: 'bg-amber-500/10 border-amber-500/30 text-amber-100',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          progressColor: 'bg-amber-500',
        };
      default:
        return {
          cardBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          progressColor: 'bg-emerald-500',
        };
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        id="notification-bell-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="Budget Alerts"
        className={`relative flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl transition-all cursor-pointer border ${
          unreadCount > 0
            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/40 animate-pulse'
            : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-transparent dark:border-slate-700'
        }`}
      >
        <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center px-1 text-[9px] font-black text-white bg-rose-600 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-sm animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          id="notification-dropdown-panel"
          className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-xl z-50 overflow-hidden text-slate-100 ring-1 ring-white/10"
        >
          {/* Header */}
          <div className="p-3.5 px-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Budget Alerts
              </h3>
            </div>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {unreadCount} New Alert{unreadCount > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Quick Progress Indicator */}
          {monthlyLimit > 0 && (
            <div className="px-4 py-3 bg-slate-950/40 border-b border-slate-800/80">
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="text-slate-300 font-medium">Monthly Budget Usage:</span>
                <span
                  className={`font-black ${
                    spentPercentage >= 100
                      ? 'text-rose-400'
                      : spentPercentage >= 80
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {Math.round(spentPercentage)}%
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    spentPercentage >= 100
                      ? 'bg-rose-500'
                      : spentPercentage >= 80
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, spentPercentage)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                <span>Spent: {formatMoney(currentMonthExpenses, config.currency)}</span>
                <span>Limit: {formatMoney(monthlyLimit, config.currency)}</span>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto p-3 space-y-2.5">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                <Info className="w-6 h-6 mx-auto text-slate-500 mb-1" />
                No active notifications at this time.
              </div>
            ) : (
              notifications.map((n) => {
                const style = getNotificationTheme(n.type);
                return (
                  <div
                    key={n.id}
                    className={`p-3 rounded-xl border transition-all ${style.cardBg} relative overflow-hidden`}
                  >
                    <div className="flex items-start gap-2.5">
                      {style.icon}
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h4 className="text-xs font-bold text-white truncate">{n.title}</h4>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-snug">{n.message}</p>
                      </div>

                      {/* Dismiss Action */}
                      {!n.read && (
                        <button
                          type="button"
                          onClick={() => handleDismiss(n.id)}
                          title="Dismiss notification"
                          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with Settings Shortcut */}
          <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">Alert triggers at 80% & 100% threshold</span>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenSettings();
              }}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              <span>Adjust Limit</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
