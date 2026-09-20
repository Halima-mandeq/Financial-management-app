import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle, LogOut } from 'lucide-react';
import { UserProfile } from '../types';

interface InactivityLockModalProps {
  currentUser: UserProfile;
  onUnlock: () => void;
  onLogout: () => void;
  idleMinutes: number;
}

export const InactivityLockModal: React.FC<InactivityLockModalProps> = ({
  currentUser,
  onUnlock,
  onLogout,
  idleMinutes,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Auto focus input on mount
  useEffect(() => {
    setError('');
    setPassword('');
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Fadlan geli password-kaaga ama PIN-kaaga si aad u furto.');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      // Find user in registered accounts to verify password
      let isCorrect = false;
      try {
        const accountsRaw = localStorage.getItem('xaliimo_registered_accounts_v1');
        if (accountsRaw) {
          const accounts = JSON.parse(accountsRaw);
          const matched = accounts.find(
            (acc: any) =>
              acc.id === currentUser.id ||
              acc.emailOrPhone?.toLowerCase() === currentUser.emailOrPhone?.toLowerCase()
          );

          if (matched && matched.password) {
            if (matched.password === password) {
              isCorrect = true;
            }
          } else {
            // Default user fallback password
            if (password === 'password123' || password === '1234') {
              isCorrect = true;
            }
          }
        } else {
          if (password === 'password123' || password === '1234') {
            isCorrect = true;
          }
        }
      } catch {
        if (password === 'password123' || password === '1234') {
          isCorrect = true;
        }
      }

      setIsVerifying(false);

      if (isCorrect) {
        onUnlock();
      } else {
        setError('Password-ku waa khalad. Fadlan isku day markale.');
      }
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-slate-100 relative overflow-hidden text-center">
        {/* Ambient Top Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Lock Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-950/50 border border-emerald-400/30">
          <Lock className="w-8 h-8" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white tracking-tight">
          Nidaamku Wuu Qufulmay (Locked)
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Maadaama aad wax yar ka maqnayd ({idleMinutes} daqiiqo), xogtaada maaliyadeed waa la sugay.
        </p>

        {/* User Card */}
        <div className="mt-4 mb-4 p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-sm flex items-center justify-center border border-emerald-500/30 shrink-0">
            {currentUser.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate">
              {currentUser.name}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {currentUser.emailOrPhone}
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {currentUser.role || 'Member'}
          </span>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-3.5 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Unlock Form */}
        <form onSubmit={handleUnlock} className="space-y-3">
          <div className="relative text-left">
            <label className="block text-[11px] font-bold text-slate-300 mb-1">
              Geli Password-kaaga si aad u furto:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full pl-3.5 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-60"
          >
            {isVerifying ? (
              <span>Waa la hubinayaa...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Fur Nidaamka (Unlock)</span>
              </>
            )}
          </button>
        </form>

        {/* Bottom Switch / Logout Link */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500">Miyaadan ahayn {currentUser.name}?</span>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 hover:text-rose-300 cursor-pointer"
          >
            <LogOut className="w-3 h-3" />
            <span>Ka Bax (Sign Out)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
