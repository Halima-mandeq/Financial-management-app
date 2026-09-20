import React, { useState } from 'react';
import { X, Settings, Plus, Trash2, RotateCcw, Home, Building2, User, UserCheck, Moon, Sun, Tag, Sparkles, Shield, Lock } from 'lucide-react';
import { BudgetConfig } from '../types';

interface BudgetSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BudgetConfig;
  onSaveConfig: (newConfig: BudgetConfig) => void;
  onResetData: () => void;
  onClearAll: () => void;
  accountType?: 'family' | 'business' | 'personal';
  onUpdateAccountType?: (type: 'family' | 'business' | 'personal') => void;
  userRole?: string;
  onUpdateUserRole?: (role: string) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: (theme: 'light' | 'dark') => void;
  appName?: string;
  onUpdateAppName?: (name: string) => void;
  autoLockMinutes?: number;
  onUpdateAutoLockMinutes?: (minutes: number) => void;
}

export const BudgetSettingsModal: React.FC<BudgetSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onResetData,
  onClearAll,
  accountType = 'family',
  userRole = 'Maamulaha Guriga',
  onUpdateUserRole,
  theme = 'light',
  onToggleTheme,
  appName = 'DakhliApp',
  onUpdateAppName,
  autoLockMinutes = 3,
  onUpdateAutoLockMinutes,
}) => {
  const [roleInput, setRoleInput] = useState(userRole);
  const [currentAppName, setCurrentAppName] = useState(appName);
  const [selectedAutoLock, setSelectedAutoLock] = useState<number>(autoLockMinutes);
  const [monthlyLimit, setMonthlyLimit] = useState(config.monthlyLimit.toString());
  const [currency, setCurrency] = useState(config.currency);
  const [familyMembers, setFamilyMembers] = useState<string[]>(config.familyMembers);
  const [newMemberName, setNewMemberName] = useState('');
  const [memberError, setMemberError] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  if (!isOpen) return null;

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    setMemberError('');
    if (!newMemberName.trim()) return;
    if (!familyMembers.includes(newMemberName.trim())) {
      setFamilyMembers([...familyMembers, newMemberName.trim()]);
    }
    setNewMemberName('');
  };

  const handleRemoveMember = (name: string) => {
    setMemberError('');
    if (familyMembers.length <= 1) {
      setMemberError('At least one member must remain in the list!');
      return;
    }
    setFamilyMembers(familyMembers.filter((m) => m !== name));
  };

  const handleSave = () => {
    const limit = parseFloat(monthlyLimit);
    onSaveConfig({
      monthlyLimit: isNaN(limit) || limit < 0 ? 0 : limit,
      currency,
      familyMembers,
    });
    if (onUpdateUserRole && roleInput.trim()) {
      onUpdateUserRole(roleInput.trim());
    }
    if (onUpdateAppName && currentAppName.trim()) {
      onUpdateAppName(currentAppName.trim());
    }
    if (onUpdateAutoLockMinutes) {
      onUpdateAutoLockMinutes(selectedAutoLock);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="budget-settings-modal"
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200/80 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Budget & Account Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Appearance (Theme: Light / Dark) */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 uppercase">
              Appearance (Light / Dark Theme)
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => onToggleTheme && onToggleTheme('light')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleTheme && onToggleTheme('dark')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-700 text-white shadow-xs border border-slate-600'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Application Name / Magaca Nidaamka */}
          <div className="bg-slate-50/80 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Application Name (Magaca App-ka)
              </label>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Active Title</span>
            </div>
            <div className="relative">
              <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={currentAppName}
                onChange={(e) => setCurrentAppName(e.target.value)}
                placeholder="e.g. Maareynta Dakhliga"
                className="w-full pl-9 pr-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            {/* Curated Somali & English Name Choices */}
            <div className="mt-2.5">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block mb-1.5">
                Dooro mid ku habboon (Pick a recommended name):
              </span>
              <div className="flex flex-col gap-1.5">
                {[
                  { name: 'Maareynta Dakhliga', desc: 'Kooban, toos ah oo cad (Selected)' },
                  { name: 'Maareynta Dakhliga ku soo Gala', desc: 'Dakhliga & Daqliga soo gala' },
                  { name: 'Xaliimo | Maareynta Dakhliga', desc: 'Astaantaada & Dakhliga' },
                  { name: 'Isha Dakhliga & Kharashka', desc: 'Dhammaan ilaha daqliga' },
                  { name: 'Kaafiye Dhaqaale', desc: 'Koboca & Kaydka lacagta' },
                  { name: 'Bileysan Finance', desc: 'Maamul dhaqaale oo casri ah' },
                  { name: 'Dakhli-Kore', desc: 'Koritaanka Dakhliga & Miisaaniyadda' },
                ].map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setCurrentAppName(item.name)}
                    className={`flex items-center justify-between text-left px-2.5 py-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                      currentAppName === item.name
                        ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700 font-bold shadow-2xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    <span className="font-semibold">{item.name}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Role Field */}
          <div className="bg-slate-50/80 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Assigned Role
              </label>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Shown on your profile</span>
            </div>
            <div className="relative">
              <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                placeholder="e.g., Household Manager, Business Owner..."
                className="w-full pl-9 pr-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            {/* Quick role suggestions */}
            <div className="flex items-center gap-1.5 flex-wrap mt-2">
              <span className="text-[10px] text-slate-400">Quick presets:</span>
              {['Personal', 'Household Manager', 'Business Owner', 'Family Member'].map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => setRoleInput(sug)}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                    roleInput === sug
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 font-bold'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Dedicated Account Mode Information */}
          <div className="bg-slate-50/80 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Account Type
              </label>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  accountType === 'business'
                    ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                    : accountType === 'personal'
                    ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                    : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                }`}
              >
                {accountType === 'business' ? (
                  <Building2 className="w-3 h-3" />
                ) : accountType === 'personal' ? (
                  <User className="w-3 h-3" />
                ) : (
                  <Home className="w-3 h-3" />
                )}
                <span>
                  {accountType === 'business'
                    ? 'Business Account'
                    : accountType === 'personal'
                    ? 'Personal Account'
                    : 'Family Account'}
                </span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {accountType === 'family'
                ? '🏠 Configured for household & family budgeting (rent, groceries, utilities, childcare).'
                : accountType === 'business'
                ? '💼 Configured for business management (inventory, payroll, operational costs, revenue).'
                : '👤 Configured for individual personal budgeting (personal expenses, dining, transit, courses).'}
            </p>
          </div>

          {/* Monthly Budget Limit */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                Monthly Budget Limit
              </label>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                Current: {currency.includes('USD') ? '$' : ''}{monthlyLimit} {currency.includes('SOS') ? 'SOS' : ''}
              </span>
            </div>
            <input
              type="number"
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {/* Quick budget presets */}
            <div className="flex items-center gap-1.5 flex-wrap mt-2">
              <span className="text-[10px] text-slate-400">Quick presets:</span>
              {[200, 350, 500, 750, 1000, 1800].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setMonthlyLimit(amt.toString())}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                    monthlyLimit === amt.toString()
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              If monthly spending reaches 80% or exceeds this limit, an automated alert banner is triggered.
            </p>
          </div>

          {/* Currency Toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 uppercase">
              Currency
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCurrency('USD ($)')}
                className={`py-2 px-3 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                  currency === 'USD ($)'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                USD ($ Dollar)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('SOS (Sh.So)')}
                className={`py-2 px-3 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                  currency === 'SOS (Sh.So)'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Somali Shilling (Sh.So)
              </button>
            </div>
          </div>

          {/* Family Members Manager */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">
              Members / Assignees
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {familyMembers.map((member) => (
                <span
                  key={member}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                >
                  {member}
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member)}
                    className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {memberError && (
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mb-1.5">{memberError}</p>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add member name..."
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddMember}
                className="px-3 py-1.5 bg-slate-800 dark:bg-slate-700 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>

          {/* Auto-Lock / Inactivity Security Settings */}
          <div className="bg-slate-50/80 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Qufulka Tooska ah (Auto-Lock)
                </label>
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                {selectedAutoLock === 0 ? 'Damiyeysan' : `${selectedAutoLock} Daqiiqo`}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
              Haddii aad nidaamka wax yar ka maqnaato ama aad ka mashquusho, wuxuu isku xidhayaa quful amni si cid kale aysan u arkin xogtaada.
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { min: 1, label: '1 Daqiiqo' },
                { min: 3, label: '3 Daqiiqo' },
                { min: 5, label: '5 Daqiiqo' },
                { min: 10, label: '10 Daqiiqo' },
              ].map((opt) => (
                <button
                  key={opt.min}
                  type="button"
                  onClick={() => setSelectedAutoLock(opt.min)}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer text-center ${
                    selectedAutoLock === opt.min
                      ? 'border-emerald-500 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 shadow-2xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Data Management */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase">
              Data Management
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {confirmReset ? (
                <div className="flex-1 flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/60 p-2 rounded-xl border border-amber-200 dark:border-amber-900">
                  <span className="text-[11px] font-bold text-amber-900 dark:text-amber-200">Reset to sample?</span>
                  <button
                    type="button"
                    onClick={() => {
                      onResetData();
                      onClose();
                    }}
                    className="px-2.5 py-1 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg cursor-pointer"
                  >
                    Yes, Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Load Sample Data
                </button>
              )}

              {confirmClear ? (
                <div className="flex-1 flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/60 p-2 rounded-xl border border-rose-200 dark:border-rose-900">
                  <span className="text-[11px] font-bold text-rose-900 dark:text-rose-200">Clear all records?</span>
                  <button
                    type="button"
                    onClick={() => {
                      onClearAll();
                      onClose();
                    }}
                    className="px-2.5 py-1 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer"
                  >
                    Yes, Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-xl transition-colors border border-rose-100 dark:border-rose-900 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear All Data
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-xl cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
