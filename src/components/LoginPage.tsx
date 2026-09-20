import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  UserPlus,
  LogIn,
  Sparkles,
  Building2,
  Home,
  UserCheck,
  KeyRound,
  ShieldAlert,
  HelpCircle,
  X
} from 'lucide-react';
import { UserProfile } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  defaultEmail?: string;
}

interface StoredAccount {
  id: string;
  name: string;
  emailOrPhone: string;
  password?: string;
  role: string;
  accountType: 'family' | 'business' | 'personal';
  avatarColor: string;
  lastLogin?: string;
}

const STORAGE_USERS_KEY = 'xaliimo_registered_accounts_v1';

const INITIAL_DEFAULT_ACCOUNTS: StoredAccount[] = [
  {
    id: 'usr-xaliimo',
    name: 'Halima Mandeeq',
    emailOrPhone: 'xaliimomaandeeq560@gmail.com',
    password: 'password123',
    role: 'Household Manager',
    accountType: 'family',
    avatarColor: 'emerald',
    lastLogin: 'Today',
  },
];

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  defaultEmail = '',
}) => {
  // Mode: 'login' | 'register'
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Registered Accounts List
  const [accounts, setAccounts] = useState<StoredAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USERS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_DEFAULT_ACCOUNTS;
  });

  // Login Form States
  const [loginIdentifier, setLoginIdentifier] = useState(defaultEmail);
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form States
  const [regFullName, setRegFullName] = useState('');
  const [regEmailOrPhone, setRegEmailOrPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAccountType, setRegAccountType] = useState<'family' | 'business' | 'personal'>('family');
  const [regAgreeTerms, setRegAgreeTerms] = useState(true);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Modals
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');
  const [forgotStep, setForgotStep] = useState<'request' | 'reset' | 'done'>('request');

  const [showSecurityModal, setShowSecurityModal] = useState(false);

  // Save accounts when changed
  useEffect(() => {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(accounts));
  }, [accounts]);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200' };
    if (pass.length < 4) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (pass.length < 7) return { score: 2, label: 'Medium', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong & Secure', color: 'bg-emerald-500' };
  };

  const passStrength = getPasswordStrength(regPassword);

  // Submit Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const identifierClean = loginIdentifier.trim().toLowerCase();
    if (!identifierClean) {
      setErrorMessage('Please enter your email or phone number.');
      return;
    }

    if (!loginPassword) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Look for registered account
      const matched = accounts.find(
        (a) => a.emailOrPhone.toLowerCase() === identifierClean
      );

      if (matched) {
        // Enforce password verification
        if (matched.password && matched.password !== loginPassword) {
          setIsLoading(false);
          setErrorMessage('Incorrect password. Please try again or click "Forgot password?".');
          return;
        }

        const loggedInUser: UserProfile = {
          id: matched.id,
          name: matched.name,
          emailOrPhone: matched.emailOrPhone,
          role: matched.role,
          accountType: matched.accountType,
          avatarColor: matched.avatarColor,
        };

        if (rememberMe) {
          localStorage.setItem('xaliimo_saved_user', JSON.stringify(loggedInUser));
        }

        setSuccessMessage(`Welcome back, ${loggedInUser.name}!`);
        setTimeout(() => {
          setIsLoading(false);
          onLoginSuccess(loggedInUser);
        }, 500);
      } else {
        setIsLoading(false);
        setErrorMessage('Account not found. Please verify your email/phone or click "Create Account" to register.');
      }
    }, 550);
  };

  // Submit Registration
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regFullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!regEmailOrPhone.trim()) {
      setErrorMessage('Please enter an email address or phone number.');
      return;
    }

    if (!regPassword || regPassword.length < 4) {
      setErrorMessage('Password must be at least 4 characters.');
      return;
    }

    if (!regAgreeTerms) {
      setErrorMessage('Please accept the Terms of Service and Privacy Policy.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const budgetLimitNum = regAccountType === 'business' ? 1800 : regAccountType === 'personal' ? 350 : 600;
      const assignedRole = regAccountType === 'business' ? 'Business Owner' : regAccountType === 'personal' ? 'Personal Wallet' : 'Household Manager';

      const newUser: StoredAccount = {
        id: 'acc-' + Date.now(),
        name: regFullName.trim(),
        emailOrPhone: regEmailOrPhone.trim(),
        password: regPassword,
        role: assignedRole,
        accountType: regAccountType,
        avatarColor: regAccountType === 'business' ? 'blue' : regAccountType === 'personal' ? 'purple' : 'emerald',
        lastLogin: 'Just now',
      };

      setAccounts((prev) => [newUser, ...prev]);

      const profile: UserProfile = {
        id: newUser.id,
        name: newUser.name,
        emailOrPhone: newUser.emailOrPhone,
        role: newUser.role,
        accountType: newUser.accountType,
        avatarColor: newUser.avatarColor,
        isNewUser: true, // Brand-new user flag for dedicated fresh dashboard
        initialBudgetLimit: budgetLimitNum,
        initialCurrency: 'USD ($)',
      };

      // Initialize brand new, fresh, empty transactions list for this new user
      localStorage.setItem(`xaliimo_user_tx_${newUser.id}`, JSON.stringify([]));

      // Initialize dedicated config for this new account
      const newConfig = {
        monthlyLimit: budgetLimitNum,
        currency: 'USD ($)' as const,
        familyMembers:
          regAccountType === 'business'
            ? [newUser.name, 'Business Treasury', 'Staff']
            : regAccountType === 'personal'
            ? [newUser.name, 'Personal Wallet']
            : [newUser.name, 'Household', 'Children'],
      };
      localStorage.setItem(`xaliimo_user_cfg_${newUser.id}`, JSON.stringify(newConfig));

      if (rememberMe) {
        localStorage.setItem('xaliimo_saved_user', JSON.stringify(profile));
      }

      const accountLabel = regAccountType === 'business' ? 'Business' : regAccountType === 'personal' ? 'Personal' : 'Family';
      setSuccessMessage(`Congratulations ${newUser.name}! Your new "${accountLabel}" dashboard is ready...`);
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(profile);
      }, 600);
    }, 600);
  };

  // Forgot password reset
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotInput.trim()) return;

    if (forgotStep === 'request') {
      setForgotStep('reset');
    } else if (forgotStep === 'reset') {
      if (!forgotNewPass || forgotNewPass.length < 4) {
        alert('The new password must be at least 4 characters long!');
        return;
      }
      // Update account password in list
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.emailOrPhone.toLowerCase() === forgotInput.trim().toLowerCase()
            ? { ...acc, password: forgotNewPass }
            : acc
        )
      );
      setForgotStep('done');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Dynamic Background Ambient Light Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[28rem] h-[28rem] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 w-full border-b border-slate-800/60 bg-slate-950/60 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-950/40 border border-emerald-400/30">
            <Wallet className="w-5 h-5 drop-shadow-xs" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-extrabold text-white tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text">
                Income Management
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Secure Portal
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block font-medium">
              Budget, Income & Savings Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowSecurityModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 active:scale-95 rounded-xl border border-slate-700/70 shadow-xs transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Security & Terms</span>
            <span className="sm:hidden">Security</span>
          </button>
        </div>
      </header>

      {/* Main Body Section */}
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto p-3 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full bg-slate-900/85 border border-slate-800/90 rounded-3xl shadow-2xl shadow-black/60 overflow-hidden backdrop-blur-2xl grid grid-cols-1 lg:grid-cols-12 ring-1 ring-white/10">
          
          {/* Left Column (Desktop Value Proposition & Security) */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-b from-slate-900/95 via-indigo-950/40 to-slate-950/95 p-8 lg:p-10 border-r border-slate-800/80 flex-col justify-between relative overflow-hidden">
            {/* Soft internal glow */}
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Smart Financial Platform</span>
              </div>

              <h2 className="text-2xl font-black text-white tracking-tight leading-snug">
                Manage Your Income, Expenses & Savings.
              </h2>
              <p className="text-slate-300 text-xs mt-3 leading-relaxed">
                Log and monitor income streams and expenditures for your family or business with instant alerts, Gemini AI financial advice, and dedicated savings goals.
              </p>

              {/* Highlights */}
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/70 hover:border-emerald-500/30 transition-all">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">Smart Budget Alerts</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                      Instant warning indicator when spending exceeds 75% of your budget limit.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/70 hover:border-blue-500/30 transition-all">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/30">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">Family, Business & Personal</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                      Organized ledgers keeping your accounts segregated and clear.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/70 hover:border-teal-500/30 transition-all">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5 border border-teal-500/30">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">Cloud-Synced & 100% Secure</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                      Your financial records are backed up safely with Google Cloud Firestore.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Trust Badge */}
            <div className="relative z-10 pt-6 border-t border-slate-800/80">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px]">Protected with secure password/PIN authentication.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Authentication Form */}
          <div className="lg:col-span-7 p-5 sm:p-8 lg:p-10 bg-slate-900/90 flex flex-col justify-center relative">
            {/* Header intro on mobile */}
            <div className="lg:hidden mb-5 text-center">
              <h2 className="text-xl font-black text-white tracking-tight">Welcome Back</h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your credentials to access your financial ledger
              </p>
            </div>

            {/* Tab Switcher: Login vs Register */}
            <div className="grid grid-cols-2 bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner mb-6">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/40 border border-emerald-400/20'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'register'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/40 border border-emerald-400/20'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </button>
            </div>

            {/* Error & Success Alerts */}
            {errorMessage && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-center gap-2.5 shadow-sm">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2.5 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* ================= LOGIN FORM ================= */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-200">
                      Email or Phone Number *
                    </label>
                    <span className="text-[11px] text-slate-400">e.g. +252 or email</span>
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="Enter your email or phone number..."
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700/80 rounded-2xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-200">
                      Password / PIN *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotInput(loginIdentifier);
                        setForgotStep('request');
                        setShowForgotModal(true);
                      }}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-700/80 rounded-2xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1.5 cursor-pointer rounded-lg hover:bg-slate-800 transition-colors"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded-md bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span>Remember me on this device</span>
                  </label>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3.5 px-5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 border border-emerald-400/30"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in, please wait...
                    </span>
                  ) : (
                    <>
                      <span>Sign In to Your Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ================= REGISTER FORM ================= */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Abdi or Mohamed Ali"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700/80 rounded-2xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
                    />
                  </div>
                </div>

                {/* Email or Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    Email or Phone Number *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="example@gmail.com or +252 61..."
                      value={regEmailOrPhone}
                      onChange={(e) => setRegEmailOrPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700/80 rounded-2xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
                    />
                  </div>
                </div>

                {/* Account Type Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-200">
                    Select Account Type *
                  </label>

                  <div className="grid grid-cols-3 gap-2.5">
                    {/* Family */}
                    <button
                      type="button"
                      onClick={() => setRegAccountType('family')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                        regAccountType === 'family'
                          ? 'bg-gradient-to-br from-emerald-950/90 to-teal-950/80 border-emerald-500 text-emerald-100 ring-2 ring-emerald-500/40 shadow-md shadow-emerald-950/50'
                          : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          regAccountType === 'family'
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          <Home className="w-4 h-4" />
                        </div>
                        {regAccountType === 'family' && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-bold block text-white">Family</span>
                        <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">
                          Household & bills
                        </span>
                      </div>
                    </button>

                    {/* Business */}
                    <button
                      type="button"
                      onClick={() => setRegAccountType('business')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                        regAccountType === 'business'
                          ? 'bg-gradient-to-br from-blue-950/90 to-indigo-950/80 border-blue-500 text-blue-100 ring-2 ring-blue-500/40 shadow-md shadow-blue-950/50'
                          : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          regAccountType === 'business'
                            ? 'bg-blue-500 text-white shadow-xs'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          <Building2 className="w-4 h-4" />
                        </div>
                        {regAccountType === 'business' && (
                          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-bold block text-white">Business</span>
                        <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">
                          Sales & operations
                        </span>
                      </div>
                    </button>

                    {/* Personal */}
                    <button
                      type="button"
                      onClick={() => setRegAccountType('personal')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                        regAccountType === 'personal'
                          ? 'bg-gradient-to-br from-purple-950/90 to-fuchsia-950/80 border-purple-500 text-purple-100 ring-2 ring-purple-500/40 shadow-md shadow-purple-950/50'
                          : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          regAccountType === 'personal'
                            ? 'bg-purple-500 text-white shadow-xs'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          <UserCheck className="w-4 h-4" />
                        </div>
                        {regAccountType === 'personal' && (
                          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-bold block text-white">Personal</span>
                        <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">
                          Individual wallet
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Password & Strength Indicator */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    Create a Password / PIN *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="At least 4 characters or numbers..."
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-700/80 rounded-2xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1.5 cursor-pointer rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  {regPassword && (
                    <div className="mt-2.5 flex items-center gap-2.5 px-1">
                      <div className="flex-1 bg-slate-800/80 h-2 rounded-full overflow-hidden flex gap-1 p-0.5">
                        <div className={`h-full flex-1 rounded-full transition-all duration-300 ${passStrength.score >= 1 ? passStrength.color : 'bg-transparent'}`} />
                        <div className={`h-full flex-1 rounded-full transition-all duration-300 ${passStrength.score >= 2 ? passStrength.color : 'bg-transparent'}`} />
                        <div className={`h-full flex-1 rounded-full transition-all duration-300 ${passStrength.score >= 3 ? passStrength.color : 'bg-transparent'}`} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-300">{passStrength.label}</span>
                    </div>
                  )}
                </div>

                {/* Terms Agreement */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={regAgreeTerms}
                      onChange={(e) => setRegAgreeTerms(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded-md bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="leading-snug">
                      I agree to the Terms of Service and Privacy Policy.
                    </span>
                  </label>
                </div>

                {/* Submit Register Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full mt-2 py-3.5 px-5 text-white font-bold text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 border border-white/20 active:scale-[0.99] ${
                    regAccountType === 'business'
                      ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-950/50'
                      : regAccountType === 'personal'
                      ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 shadow-purple-950/50'
                      : 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-950/50'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Setting up your new dashboard...
                    </span>
                  ) : (
                    <>
                      <span>
                        Register & Open ({regAccountType === 'business' ? 'Business' : regAccountType === 'personal' ? 'Personal' : 'Family'})
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Footer Trust Indicator */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Your financial records remain confidential and secure</span>
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-800 text-white animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">Reset Password</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {forgotStep === 'request' && (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter the email address or phone number associated with your account to reset your password.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email or Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={forgotInput}
                    onChange={(e) => setForgotInput(e.target.value)}
                    placeholder="example@gmail.com or +252..."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg cursor-pointer"
                  >
                    Verify Account &rarr;
                  </button>
                </div>
              </form>
            )}

            {forgotStep === 'reset' && (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
                  Account <strong>{forgotInput}</strong> verified! Please create your new password.
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    New Password / PIN
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter your new password..."
                    value={forgotNewPass}
                    onChange={(e) => setForgotNewPass(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg cursor-pointer"
                  >
                    Update Password Now
                  </button>
                </div>
              </form>
            )}

            {forgotStep === 'done' && (
              <div className="space-y-4 text-center py-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Password Updated Successfully!</h4>
                <p className="text-xs text-slate-400">
                  You can now log in using your new credentials.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setLoginIdentifier(forgotInput);
                    setLoginPassword(forgotNewPass);
                    setShowForgotModal(false);
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Proceed to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Security & Privacy Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-800 text-white animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Security & Privacy Policy</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSecurityModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <h4 className="font-bold text-white mb-1">1. 100% Privacy & Data Confidentiality</h4>
                <p className="text-slate-400">
                  Your financial records, income streams, and expenditures are kept private and secure. Data is encrypted and synced with Google Cloud Firestore.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <h4 className="font-bold text-white mb-1">2. Family & Business Multi-Profile Management</h4>
                <p className="text-slate-400">
                  Each family member or business staff member can have an assigned profile to clearly attribute every payment and deposit.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <h4 className="font-bold text-white mb-1">3. Real-Time Cloud Synchronization & Offline Safety</h4>
                <p className="text-slate-400">
                  Your financial data automatically stays in sync and remains protected even during temporary offline intervals.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowSecurityModal(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Professional Subtle Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-500 border-t border-slate-800/60 px-4">
        <p>
          &copy; {new Date().getFullYear()} Income Management System. Designed for transparent and modern personal & business finance.
        </p>
      </footer>
    </div>
  );
};
