import React, { useState, useEffect, useMemo } from 'react';
import { X, PlusCircle, ArrowDownCircle, ArrowUpCircle, Tag } from 'lucide-react';
import { Transaction, TransactionType, PaymentMethod } from '../types';
import { GET_CATEGORIES_FOR_ACCOUNT_TYPE } from '../data/initialData';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Omit<Transaction, 'id'> | Transaction) => void;
  editingTransaction?: Transaction | null;
  familyMembers: string[];
  currency: string;
  accountType?: 'family' | 'business' | 'personal';
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTransaction,
  familyMembers,
  currency,
  accountType = 'family',
}) => {
  const [type, setType] = useState<TransactionType>('kharash');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [familyMember, setFamilyMember] = useState<string>(familyMembers[0] || 'Qoyska Guud');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('EVC Plus / Zaad');
  const [customFamilyMember, setCustomFamilyMember] = useState<string>('');
  const [showCustomMember, setShowCustomMember] = useState<boolean>(false);
  const [amountError, setAmountError] = useState<string>('');

  // Retrieve customized categories based on selected account type (Family, Business, or Personal)
  const currentCategories = useMemo(() => {
    return GET_CATEGORIES_FOR_ACCOUNT_TYPE(accountType);
  }, [accountType]);

  const filteredCategories = useMemo(() => {
    return currentCategories.filter((c) => c.type === type);
  }, [currentCategories, type]);

  useEffect(() => {
    setAmountError('');
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setCategory(editingTransaction.category);
      setDescription(editingTransaction.description);
      setDate(editingTransaction.date);
      setPaymentMethod(editingTransaction.paymentMethod);

      if (familyMembers.includes(editingTransaction.familyMember)) {
        setFamilyMember(editingTransaction.familyMember);
        setShowCustomMember(false);
      } else {
        setFamilyMember('other');
        setCustomFamilyMember(editingTransaction.familyMember);
        setShowCustomMember(true);
      }
    } else {
      // Reset form
      setType('kharash');
      setAmount('');
      const defaultCat = currentCategories.find((c) => c.type === 'kharash')?.name || '';
      setCategory(defaultCat);
      setDescription('');
      setDate(new Date().toISOString().slice(0, 10));
      setFamilyMember(familyMembers[0] || (accountType === 'personal' ? 'Naftayda (Aniga)' : accountType === 'business' ? 'Maamulaha' : 'Xaliimo'));
      setShowCustomMember(false);
      setCustomFamilyMember('');
      setPaymentMethod('EVC Plus / Zaad');
    }
  }, [editingTransaction, isOpen, familyMembers, currentCategories, accountType]);

  useEffect(() => {
    if (!editingTransaction) {
      const firstCat = filteredCategories[0]?.name || '';
      setCategory(firstCat);
    }
  }, [type, filteredCategories, editingTransaction]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAmountError('');
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setAmountError('Please enter a valid amount greater than 0!');
      return;
    }

    const finalMember = showCustomMember && customFamilyMember.trim()
      ? customFamilyMember.trim()
      : familyMember;

    const data: Omit<Transaction, 'id'> = {
      type,
      amount: numAmount,
      category: category || (type === 'kharash' ? 'Other Expenses' : 'Other Income'),
      description: description.trim() || category,
      date,
      familyMember: finalMember,
      paymentMethod,
    };

    if (editingTransaction) {
      onSave({ ...data, id: editingTransaction.id });
    } else {
      onSave(data);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="transaction-modal"
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200/80 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {editingTransaction ? 'Edit Transaction' : 'Record New Transaction'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Toggle: Expense vs Income */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setType('kharash')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  type === 'kharash'
                    ? 'bg-white dark:bg-slate-700 text-rose-700 dark:text-rose-400 shadow-xs border border-slate-200/60 dark:border-slate-600'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ArrowDownCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                Expense (Outflow)
              </button>
              <button
                type="button"
                onClick={() => setType('dakhli')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  type === 'dakhli'
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-xs border border-slate-200/60 dark:border-slate-600'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ArrowUpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Income (Inflow)
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">
              Amount ({currency}) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                required
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setAmountError('');
                }}
                className="w-full text-xl font-bold px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>
            {amountError && (
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1">{amountError}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                Category *
              </label>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  accountType === 'business'
                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                    : accountType === 'personal'
                    ? 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                    : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                }`}
              >
                {accountType === 'business'
                  ? '💼 Business'
                  : accountType === 'personal'
                  ? '👤 Personal'
                  : '🏠 Family'}
              </span>
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.name} className="dark:bg-slate-850">
                  {c.name}
                </option>
              ))}
            </select>

            {/* Quick Category Chips for One-Click Selection */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {filteredCategories.slice(0, 5).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.name)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer border ${
                    category === c.name
                      ? 'bg-slate-900 dark:bg-emerald-600 text-white border-slate-900 dark:border-emerald-600 shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200/60 dark:border-slate-700'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Description / Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">
              Description / Notes
            </label>
            <input
              type="text"
              placeholder="e.g., Grocery shopping, Utilities, Transport..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="EVC Plus / Zaad" className="dark:bg-slate-800">EVC Plus / Zaad</option>
                <option value="e-Dahab / Sahal" className="dark:bg-slate-800">e-Dahab / Sahal</option>
                <option value="Kaash (Lacag Cadaan)" className="dark:bg-slate-800">Cash</option>
                <option value="Bangiga (Bank)" className="dark:bg-slate-800">Bank Transfer</option>
              </select>
            </div>
          </div>

          {/* Member / Person */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">
              Member / Assigned Person
            </label>
            <div className="flex gap-2">
              <select
                value={showCustomMember ? 'other' : familyMember}
                onChange={(e) => {
                  if (e.target.value === 'other') {
                    setShowCustomMember(true);
                  } else {
                    setShowCustomMember(false);
                    setFamilyMember(e.target.value);
                  }
                }}
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {familyMembers.map((m) => (
                  <option key={m} value={m} className="dark:bg-slate-800">
                    {m}
                  </option>
                ))}
                <option value="other" className="dark:bg-slate-800">+ Other Name...</option>
              </select>

              {showCustomMember && (
                <input
                  type="text"
                  placeholder="Enter name"
                  value={customFamilyMember}
                  onChange={(e) => setCustomFamilyMember(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              )}
            </div>
          </div>

          {/* Submit buttons */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {editingTransaction ? 'Save Changes' : 'Record Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
