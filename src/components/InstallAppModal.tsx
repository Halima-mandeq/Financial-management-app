import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  CheckCircle2,
  ExternalLink,
  X,
  Share,
  Sparkles,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const liveUrl = window.location.origin;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeInstall = async () => {
    await install();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl text-slate-100 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between mb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-950/40 border border-emerald-400/30">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Ku Dejso Taleefanka (App / APK)</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Android & iOS
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Ku shub shaashadda taleefankaaga sidii App caadi ah
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Tabs / Methods */}
        <div className="space-y-4 relative z-10 text-xs">
          {/* Method 1: Instant PWA Install (Direct on Android Phone) */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/40 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Habka 1: Toos ugu shubo Taleefanka (PWA)
              </span>
              <span className="text-[10px] text-emerald-300 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Laguma daalayo ⚡
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed mb-3">
              Kani waa habka ugu sahlan oo Google Chrome kuu oggolaanayo inaad App-ka ku darto shaashadda (Home Screen) adoon APK u baahnayn, wuxuuna ku shaqeynayaa xawaare buuxa iyo Offline.
            </p>

            {isInstallable ? (
              <button
                type="button"
                onClick={handleNativeInstall}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
              >
                <Download className="w-4 h-4" />
                <span>Hadda Ku Shub Taleefanka (Install App)</span>
              </button>
            ) : isInstalled ? (
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>App-kan mar hore ayaa lagu shubay qalabkaaga!</span>
              </div>
            ) : (
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5 text-slate-300">
                <p className="font-semibold text-white">Sida Chrome looga shubo:</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-1">
                  <li>Guji saddexda dhibcood (<strong className="text-white">&vellip;</strong>) ee Chrome-ka sare/hoose.</li>
                  <li>Dooro <strong className="text-emerald-400">&ldquo;Add to Home screen&rdquo;</strong> ama <strong className="text-emerald-400">&ldquo;Install app&rdquo;</strong>.</li>
                  <li>Isla markiiba Icon-ka wuxuu u soo degayaa sidii App caadi ah!</li>
                </ol>
              </div>
            )}
          </div>

          {/* Method 2: Convert to Standalone Android APK (.apk file) */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-400" />
                Habka 2: Soo saar Faylka APK-ga dhabta ah (.apk)
              </span>
              <span className="text-[10px] text-blue-300 font-semibold bg-blue-500/10 px-2 py-0.5 rounded-full">
                PWABuilder / Play Store
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed mb-3">
              Haddii aad rabto inaad hesho faylka <strong>.apk</strong> ee toos loogu diro dadka kale ama lagu shubo Google Play Store:
            </p>

            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 truncate flex-1 font-mono">
                  {liveUrl}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            <a
              href={`https://www.pwabuilder.com/?site=${encodeURIComponent(liveUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>U Fur PWABuilder (Generate Android APK)</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

          {/* iOS Safari instruction if on iPhone */}
          {isIOS && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-xs">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <Share className="w-3.5 h-3.5" />
                <span>Tilmaamaha iPhone / iPad (Safari):</span>
              </div>
              <p className="text-[11px] leading-normal text-amber-300/90">
                Guji badhanka <strong>Share</strong> ee hoose, kadibna dooro <strong>&ldquo;Add to Home Screen&rdquo;</strong> si aad ugu shubto iPhone-kaaga.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl cursor-pointer"
          >
            Waayahay, Waan Fahmay
          </button>
        </div>
      </div>
    </div>
  );
};
