import { useState, useEffect } from 'react';
import { Plus, Settings, Wallet, LogOut, Home, Building2, User, UserCheck, Moon, Sun, Target, Cloud, CloudCheck, Smartphone, Lock } from 'lucide-react';
import { Transaction, BudgetConfig, UserProfile, SavingsGoal } from './types';
import {
  DEFAULT_BUDGET_CONFIG,
  INITIAL_TRANSACTIONS,
  GET_INITIAL_TRANSACTIONS_FOR_USER,
  GET_INITIAL_CONFIG_FOR_USER,
  GET_INITIAL_GOALS_FOR_USER,
} from './data/initialData';
import {
  syncUserToFirestore,
  saveTransactionToFirestore,
  deleteTransactionFromFirestore,
  batchSaveTransactionsToFirestore,
  saveGoalToFirestore,
  deleteGoalFromFirestore,
  saveConfigToFirestore,
} from './services/firestoreService';
import { SummaryCards } from './components/SummaryCards';
import { SavingsGoalsSection } from './components/SavingsGoalsSection';
import { SavingsGoalModal } from './components/SavingsGoalModal';
import { SavingsDepositModal } from './components/SavingsDepositModal';
import { CategoryBreakdown } from './components/CategoryBreakdown';
import { TransactionList } from './components/TransactionList';
import { MonthlyIncomeExpenseChart } from './components/MonthlyIncomeExpenseChart';
import { TransactionModal } from './components/TransactionModal';
import { BudgetSettingsModal } from './components/BudgetSettingsModal';
import { LoginPage } from './components/LoginPage';
import { FinancialTipCard } from './components/FinancialTipCard';
import { NotificationCenter } from './components/NotificationCenter';
import { InstallAppModal } from './components/InstallAppModal';
import { InactivityLockModal } from './components/InactivityLockModal';
import { formatMoney } from './utils/formatters';

const STORAGE_KEYS = {
  TRANSACTIONS: 'xaliimo_budget_transactions_v1',
  CONFIG: 'xaliimo_budget_config_v1',
  USER: 'xaliimo_saved_user',
  THEME: 'xaliimo_theme_preference',
  GOALS: 'xaliimo_savings_goals_v1',
  AUTO_LOCK: 'xaliimo_auto_lock_minutes',
};

const DEFAULT_USER: UserProfile = {
  id: 'usr-xaliimo',
  name: 'Xaliimo Maandeeq',
  emailOrPhone: 'xaliimomaandeeq560@gmail.com',
  role: 'Maamulaha Guriga',
  avatarColor: 'emerald',
  accountType: 'family',
};

const getUserTxKey = (user: UserProfile) =>
  user.id === 'usr-xaliimo' ? STORAGE_KEYS.TRANSACTIONS : `xaliimo_user_tx_${user.id}`;

const getUserCfgKey = (user: UserProfile) =>
  user.id === 'usr-xaliimo' ? STORAGE_KEYS.CONFIG : `xaliimo_user_cfg_${user.id}`;

const getUserGoalsKey = (user: UserProfile) =>
  user.id === 'usr-xaliimo' ? STORAGE_KEYS.GOALS : `xaliimo_user_goals_${user.id}`;

export default function App() {
  // Theme state: 'light' | 'dark'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Apply theme class to document root and persist
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    if (localStorage.getItem('xaliimo_user_logged_out') === 'true') {
      return null;
    }
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) return parsed;
      } catch {
        return DEFAULT_USER;
      }
    }
    return DEFAULT_USER;
  });

  // Load state from localStorage or category-specific defaults
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const activeUser = currentUser || DEFAULT_USER;
    const txKey = getUserTxKey(activeUser);
    const saved = localStorage.getItem(txKey);
    if (saved !== null) {
      try {
        return JSON.parse(saved);
      } catch {
        return GET_INITIAL_TRANSACTIONS_FOR_USER(activeUser);
      }
    }
    return GET_INITIAL_TRANSACTIONS_FOR_USER(activeUser);
  });

  const [config, setConfig] = useState<BudgetConfig>(() => {
    const activeUser = currentUser || DEFAULT_USER;
    const cfgKey = getUserCfgKey(activeUser);
    const saved = localStorage.getItem(cfgKey);
    if (saved !== null) {
      try {
        return JSON.parse(saved);
      } catch {
        return GET_INITIAL_CONFIG_FOR_USER(activeUser);
      }
    }
    return GET_INITIAL_CONFIG_FOR_USER(activeUser);
  });

  // Savings Goals State
  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const activeUser = currentUser || DEFAULT_USER;
    const goalsKey = getUserGoalsKey(activeUser);
    const saved = localStorage.getItem(goalsKey);
    if (saved !== null) {
      try {
        return JSON.parse(saved);
      } catch {
        return GET_INITIAL_GOALS_FOR_USER(activeUser);
      }
    }
    return GET_INITIAL_GOALS_FOR_USER(activeUser);
  });

  // Modals state
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [selectedGoalForDeposit, setSelectedGoalForDeposit] = useState<SavingsGoal | null>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Auto-Lock Inactivity Security State (default 3 minutes of inactivity)
  const [autoLockMinutes, setAutoLockMinutes] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTO_LOCK);
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      return isNaN(parsed) ? 3 : parsed;
    }
    return 3;
  });
  const [isLockedByInactivity, setIsLockedByInactivity] = useState(false);

  // Inactivity detection timer
  useEffect(() => {
    if (!currentUser || autoLockMinutes <= 0 || isLockedByInactivity) return;

    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      // autoLockMinutes in milliseconds
      timeoutId = setTimeout(() => {
        setIsLockedByInactivity(true);
      }, autoLockMinutes * 60 * 1000);
    };

    // Events to monitor user activity
    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    // Start initial timer
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [currentUser, autoLockMinutes, isLockedByInactivity]);

  const handleUpdateAutoLockMinutes = (minutes: number) => {
    setAutoLockMinutes(minutes);
    localStorage.setItem(STORAGE_KEYS.AUTO_LOCK, minutes.toString());
  };

  // App Title / Branding State
  const [appName, setAppName] = useState<string>(() => {
    const saved = localStorage.getItem('app_brand_name');
    if (!saved || saved === 'Maareynta Dakhliga ku soo Gala' || saved === 'Xaliimo Finance' || saved === 'Buugga Dhaqaalaha & Xisaab-xidhka Guriga') {
      localStorage.setItem('app_brand_name', 'Maareynta Dakhliga');
      return 'Maareynta Dakhliga';
    }
    return saved;
  });

  const handleUpdateAppName = (newName: string) => {
    setAppName(newName);
    localStorage.setItem('app_brand_name', newName);
    document.title = newName;
  };

  useEffect(() => {
    document.title = appName;
  }, [appName]);

  // When currentUser changes (login, register, switch)
  useEffect(() => {
    if (!currentUser) return;

    // Sync user profile to Firestore
    syncUserToFirestore(currentUser);

    const txKey = getUserTxKey(currentUser);
    const savedTx = localStorage.getItem(txKey);
    let currentTxs: Transaction[];
    if (savedTx !== null) {
      try {
        currentTxs = JSON.parse(savedTx);
        setTransactions(currentTxs);
      } catch {
        currentTxs = GET_INITIAL_TRANSACTIONS_FOR_USER(currentUser);
        setTransactions(currentTxs);
      }
    } else {
      currentTxs = GET_INITIAL_TRANSACTIONS_FOR_USER(currentUser);
      setTransactions(currentTxs);
    }
    // Sync initial batch to firestore if not synced
    batchSaveTransactionsToFirestore(currentUser.id, currentUser.accountType || 'family', currentTxs);

    const cfgKey = getUserCfgKey(currentUser);
    const savedCfg = localStorage.getItem(cfgKey);
    let currentCfg: BudgetConfig;
    if (savedCfg !== null) {
      try {
        currentCfg = JSON.parse(savedCfg);
        setConfig(currentCfg);
      } catch {
        currentCfg = GET_INITIAL_CONFIG_FOR_USER(currentUser);
        setConfig(currentCfg);
      }
    } else {
      currentCfg = GET_INITIAL_CONFIG_FOR_USER(currentUser);
      setConfig(currentCfg);
    }
    saveConfigToFirestore(currentUser.id, currentCfg);

    const goalsKey = getUserGoalsKey(currentUser);
    const savedGoals = localStorage.getItem(goalsKey);
    let currentGoalsList: SavingsGoal[];
    if (savedGoals !== null) {
      try {
        currentGoalsList = JSON.parse(savedGoals);
        setGoals(currentGoalsList);
      } catch {
        currentGoalsList = GET_INITIAL_GOALS_FOR_USER(currentUser);
        setGoals(currentGoalsList);
      }
    } else {
      currentGoalsList = GET_INITIAL_GOALS_FOR_USER(currentUser);
      setGoals(currentGoalsList);
    }
    currentGoalsList.forEach((g) => saveGoalToFirestore(currentUser.id, g));
  }, [currentUser?.id]);

  // Sync transactions to current user's localStorage
  useEffect(() => {
    if (!currentUser) return;
    const txKey = getUserTxKey(currentUser);
    localStorage.setItem(txKey, JSON.stringify(transactions));
  }, [transactions, currentUser?.id]);

  // Sync config to current user's localStorage and Firestore
  useEffect(() => {
    if (!currentUser) return;
    const cfgKey = getUserCfgKey(currentUser);
    localStorage.setItem(cfgKey, JSON.stringify(config));
    saveConfigToFirestore(currentUser.id, config);
  }, [config, currentUser?.id]);

  // Sync goals to current user's localStorage
  useEffect(() => {
    if (!currentUser) return;
    const goalsKey = getUserGoalsKey(currentUser);
    localStorage.setItem(goalsKey, JSON.stringify(goals));
  }, [goals, currentUser?.id]);

  // Calculations
  const totalIncome = transactions
    .filter((t) => t.type === 'dakhli')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'kharash')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  // Handlers
  const handleSaveTransaction = (txData: Omit<Transaction, 'id'> | Transaction) => {
    if (!currentUser) return;
    if ('id' in txData && txData.id) {
      // Edit existing
      const updatedTx = txData as Transaction;
      setTransactions((prev) =>
        prev.map((item) => (item.id === txData.id ? updatedTx : item))
      );
      saveTransactionToFirestore(currentUser.id, currentUser.accountType || 'family', updatedTx);
    } else {
      // Create new
      const newTx: Transaction = {
        ...txData,
        id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      };
      setTransactions((prev) => [newTx, ...prev]);
      saveTransactionToFirestore(currentUser.id, currentUser.accountType || 'family', newTx);
    }
    setEditingTransaction(null);
  };

  const handleEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsTxModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    deleteTransactionFromFirestore(id);
  };

  // Savings Goal Handlers
  const handleSaveGoal = (goalData: Omit<SavingsGoal, 'id' | 'createdAt'> | SavingsGoal) => {
    if (!currentUser) return;
    if ('id' in goalData && goalData.id) {
      // Edit
      const updatedGoal = goalData as SavingsGoal;
      setGoals((prev) =>
        prev.map((g) => (g.id === goalData.id ? updatedGoal : g))
      );
      saveGoalToFirestore(currentUser.id, updatedGoal);
    } else {
      // Create
      const newGoal: SavingsGoal = {
        ...goalData,
        id: 'goal-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setGoals((prev) => [newGoal, ...prev]);
      saveGoalToFirestore(currentUser.id, newGoal);
    }
    setEditingGoal(null);
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
    deleteGoalFromFirestore(goalId);
  };

  const handleUpdateGoalAmount = (
    goalId: string,
    newAmount: number,
    delta: number,
    note?: string
  ) => {
    if (!currentUser) return;
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const updated = { ...g, currentAmount: newAmount };
          saveGoalToFirestore(currentUser.id, updated);
          return updated;
        }
        return g;
      })
    );
  };

  const handleOpenDepositModal = (goal: SavingsGoal) => {
    setSelectedGoalForDeposit(goal);
    setIsDepositModalOpen(true);
  };

  const handleResetData = () => {
    if (!currentUser) return;
    if (currentUser.id === 'usr-xaliimo') {
      setTransactions(INITIAL_TRANSACTIONS);
      setConfig(DEFAULT_BUDGET_CONFIG);
      setGoals(GET_INITIAL_GOALS_FOR_USER(currentUser));
    } else {
      const resetTx = GET_INITIAL_TRANSACTIONS_FOR_USER({ ...currentUser, isNewUser: false });
      const resetCfg = GET_INITIAL_CONFIG_FOR_USER(currentUser);
      const resetGoals = GET_INITIAL_GOALS_FOR_USER(currentUser);
      setTransactions(resetTx);
      setConfig(resetCfg);
      setGoals(resetGoals);
    }
  };

  const handleClearAll = () => {
    setTransactions([]);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.setItem('xaliimo_user_logged_out', 'true');
    setCurrentUser(null);
    setShowLogoutModal(false);
  };

  const handleUpdateUserRole = (newRole: string) => {
    if (!currentUser) return;
    const cleanRole = newRole.trim() || currentUser.role;
    const updatedUser: UserProfile = {
      ...currentUser,
      role: cleanRole,
    };
    setCurrentUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));

    // Also update in registered accounts list
    try {
      const savedAccounts = localStorage.getItem('xaliimo_registered_accounts_v1');
      if (savedAccounts) {
        const accounts = JSON.parse(savedAccounts);
        const updatedAccounts = accounts.map((acc: any) =>
          acc.id === currentUser.id ? { ...acc, role: cleanRole } : acc
        );
        localStorage.setItem('xaliimo_registered_accounts_v1', JSON.stringify(updatedAccounts));
      }
    } catch {
      // ignore
    }
  };

  // If user is not logged in, display the Login Page
  if (!currentUser) {
    return (
      <LoginPage
        onLoginSuccess={(user) => {
          localStorage.removeItem('xaliimo_user_logged_out');
          setCurrentUser(user);
        }}
      />
    );
  }

  const accountTypeName =
    currentUser.accountType === 'business'
      ? 'Business'
      : currentUser.accountType === 'personal'
      ? 'Personal'
      : 'Family';

  return (
    <div className="min-h-screen bg-slate-50/80 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors duration-200 relative selection:bg-emerald-500 selection:text-white">
      {/* Top Colorful Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 via-sky-500 via-indigo-500 to-rose-500" />

      {/* Subtle Background Ambient Color Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-rose-500/10 dark:bg-rose-500/5 rounded-full blur-3xl" />
      </div>

      {/* Professional Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 py-2 sm:py-3">
          {/* Main Bar */}
          <div className="flex items-center justify-between gap-2">
            {/* Left: Logo & Brand Info + Account Badge */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl text-white flex items-center justify-center shadow-md shrink-0 ${
                  currentUser.accountType === 'business'
                    ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-blue-500/25'
                    : currentUser.accountType === 'personal'
                    ? 'bg-gradient-to-tr from-purple-600 to-pink-600 shadow-purple-500/25'
                    : 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-500/25'
                }`}
              >
                {currentUser.accountType === 'business' ? (
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : currentUser.accountType === 'personal' ? (
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-base font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {appName}
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full border whitespace-nowrap ${
                      currentUser.accountType === 'business'
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                        : currentUser.accountType === 'personal'
                        ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                        : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    }`}
                  >
                    {currentUser.accountType === 'business' ? (
                      <Building2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    ) : currentUser.accountType === 'personal' ? (
                      <User className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    ) : (
                      <Home className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    )}
                    <span>{accountTypeName}</span>
                  </span>
                </div>
                <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                  Smart Budget & Expense Manager
                </p>
              </div>
            </div>

            {/* Right: Controls & Actions */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Cloud Database Connected Status Badge */}
              <div
                title="Cloud Firestore database connected. Real-time sync enabled."
                className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 rounded-xl text-[11px] font-semibold"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <Cloud className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Cloud Synced</span>
              </div>

              {/* Notification Center for 80% and 100% budget alerts */}
              <NotificationCenter
                transactions={transactions}
                config={config}
                onOpenSettings={() => setIsSettingsModalOpen(true)}
              />

              {/* App / APK Install Button */}
              <button
                type="button"
                id="open-app-apk-install-btn"
                onClick={() => setIsInstallModalOpen(true)}
                title="Soo dego ama ku shubo Taleefanka / Soo saar APK"
                className="flex items-center justify-center sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 rounded-lg sm:rounded-xl transition-colors cursor-pointer border border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs"
              >
                <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[11px] sm:text-xs">App / APK</span>
              </button>

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg sm:rounded-xl transition-colors cursor-pointer border border-transparent dark:border-slate-700"
              >
                {theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                ) : (
                  <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
                )}
              </button>

              {/* Quick Screen Lock Button */}
              <button
                type="button"
                id="quick-screen-lock-btn"
                onClick={() => setIsLockedByInactivity(true)}
                title="Quful Shaashadda Hadda (Lock Screen Now)"
                className="flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 text-amber-600 dark:text-amber-400 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 rounded-lg sm:rounded-xl transition-colors cursor-pointer border border-amber-200/80 dark:border-amber-800/80 shadow-2xs"
              >
                <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Settings Button */}
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                title="Settings"
                className="flex items-center justify-center sm:gap-1.5 w-7 h-7 sm:w-auto sm:px-3 sm:py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg sm:rounded-xl transition-colors cursor-pointer border border-transparent dark:border-slate-700"
              >
                <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 dark:text-slate-400" />
                <span className="hidden sm:inline">Settings</span>
              </button>

              {/* Add Transaction Button */}
              <button
                onClick={() => {
                  setEditingTransaction(null);
                  setIsTxModalOpen(true);
                }}
                className={`hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-colors cursor-pointer ${
                  currentUser.accountType === 'business'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : currentUser.accountType === 'personal'
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Add Transaction</span>
              </button>

              {/* User Profile & Logout */}
              <div className="flex items-center gap-1 sm:gap-2 pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-800">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold text-[10px] sm:text-xs flex items-center justify-center border shadow-2xs shrink-0 ${
                    currentUser.accountType === 'business'
                      ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                      : currentUser.accountType === 'personal'
                      ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                      : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  }`}
                  title={`${currentUser.name} (${currentUser.role})`}
                >
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {currentUser.role || 'Member'}
                  </div>
                </div>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  title="Sign out"
                  className="p-1 sm:p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg sm:rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Executive Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Colorful Executive Command Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 shadow-xl shadow-slate-950/15 border border-indigo-900/40">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-sky-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-10 w-56 h-56 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {accountTypeName} Active
                </span>
                <span className="text-xs text-slate-300 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-xs">
                  Role: <strong className="text-white">{currentUser.role || 'Member'}</strong>
                </span>
                <span className="text-xs text-slate-400">
                  {transactions.length} Transactions Logged
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {currentUser.accountType === 'business'
                  ? 'Business Financial Command'
                  : currentUser.accountType === 'personal'
                  ? 'Personal Financial Command'
                  : 'Family Financial Command'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Real-time income, expense tracking, and monthly budget intelligence for {currentUser.name}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer hover:border-emerald-400/40"
              >
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span>Monthly Cap: <strong className="text-emerald-300">{formatMoney(config.monthlyLimit, config.currency)}</strong></span>
              </button>

              <button
                onClick={() => {
                  setEditingTransaction(null);
                  setIsTxModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-xs font-bold text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all cursor-pointer scale-100 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Transaction</span>
              </button>
            </div>
          </div>
        </div>

        {/* 1. Summary Cards (Income, Expense, Balance, Budget Tracker) */}
        <SummaryCards
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          netBalance={netBalance}
          monthlyLimit={config.monthlyLimit}
          currency={config.currency}
        />

        {/* 2. Financial Tip of the Day (Powered by Gemini API) */}
        <FinancialTipCard
          transactions={transactions}
          config={config}
          accountType={currentUser.accountType || 'family'}
          userName={currentUser.name}
        />

        {/* 3. Savings Goals Section (Emergency Fund, Tech, Business Setup, etc.) */}
        <SavingsGoalsSection
          goals={goals}
          currency={config.currency}
          accountType={currentUser.accountType || 'family'}
          onAddGoal={() => {
            setEditingGoal(null);
            setIsGoalModalOpen(true);
          }}
          onEditGoal={(goal) => {
            setEditingGoal(goal);
            setIsGoalModalOpen(true);
          }}
          onDeleteGoal={handleDeleteGoal}
          onOpenDepositModal={handleOpenDepositModal}
        />

        {/* 3. Analytical Charts Row (6-Month Trend & Category Distribution) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <MonthlyIncomeExpenseChart
              transactions={transactions}
              currency={config.currency}
            />
          </div>
          <div className="lg:col-span-5">
            <CategoryBreakdown
              transactions={transactions}
              currency={config.currency}
            />
          </div>
        </div>

        {/* 4. Transaction Ledger & Filtering */}
        <TransactionList
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          familyMembers={config.familyMembers}
          currency={config.currency}
          onAddTransaction={() => {
            setEditingTransaction(null);
            setIsTxModalOpen(true);
          }}
          accountType={currentUser.accountType || 'family'}
        />
      </main>

      {/* Mobile Floating Quick Action Button (FAB) */}
      <button
        onClick={() => {
          setEditingTransaction(null);
          setIsTxModalOpen(true);
        }}
        title="Add New Transaction"
        aria-label="Add New Transaction"
        className={`sm:hidden fixed bottom-6 right-5 z-40 w-13 h-13 rounded-full text-white shadow-xl flex items-center justify-center cursor-pointer transition-all active:scale-90 hover:scale-105 ${
          currentUser.accountType === 'business'
            ? 'bg-blue-600 ring-4 ring-blue-600/20 shadow-blue-600/40'
            : currentUser.accountType === 'personal'
            ? 'bg-purple-600 ring-4 ring-purple-600/20 shadow-purple-600/40'
            : 'bg-emerald-600 ring-4 ring-emerald-600/20 shadow-emerald-600/40'
        }`}
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Transaction Modal (Add / Edit) */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => {
          setIsTxModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        editingTransaction={editingTransaction}
        familyMembers={config.familyMembers}
        currency={config.currency}
        accountType={currentUser.accountType || 'family'}
      />

      {/* Savings Goal Modal (Add / Edit) */}
      <SavingsGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => {
          setIsGoalModalOpen(false);
          setEditingGoal(null);
        }}
        onSave={handleSaveGoal}
        editingGoal={editingGoal}
        currency={config.currency}
        accountType={currentUser.accountType || 'family'}
      />

      {/* Savings Deposit / Withdraw Modal */}
      <SavingsDepositModal
        isOpen={isDepositModalOpen}
        onClose={() => {
          setIsDepositModalOpen(false);
          setSelectedGoalForDeposit(null);
        }}
        goal={selectedGoalForDeposit}
        onUpdateAmount={handleUpdateGoalAmount}
        currency={config.currency}
      />

      {/* Budget & Family Settings Modal */}
      <BudgetSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        config={config}
        onSaveConfig={setConfig}
        onResetData={handleResetData}
        onClearAll={handleClearAll}
        accountType={currentUser.accountType || 'family'}
        userRole={currentUser.role}
        onUpdateUserRole={handleUpdateUserRole}
        theme={theme}
        onToggleTheme={setTheme}
        appName={appName}
        onUpdateAppName={handleUpdateAppName}
        autoLockMinutes={autoLockMinutes}
        onUpdateAutoLockMinutes={handleUpdateAutoLockMinutes}
      />

      {/* Inactivity Security Auto-Lock Modal */}
      {isLockedByInactivity && currentUser && (
        <InactivityLockModal
          currentUser={currentUser}
          idleMinutes={autoLockMinutes}
          onUnlock={() => setIsLockedByInactivity(false)}
          onLogout={() => {
            setIsLockedByInactivity(false);
            handleConfirmLogout();
          }}
        />
      )}

      {/* PWA / APK Mobile App Install Modal */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Custom In-App Logout Confirmation Modal (works 100% in iFrame) */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-100 dark:border-rose-900 shadow-2xs">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white text-center mb-1.5">
              Confirm Sign Out?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-6 leading-relaxed">
              You will be signed out of <strong>{currentUser.name}</strong>. You can sign back in at any time with your credentials.
            </p>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="flex-1 py-2.5 px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
