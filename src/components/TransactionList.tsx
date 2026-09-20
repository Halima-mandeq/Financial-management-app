import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Trash2,
  Edit3,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  User,
  X,
  Tag,
  Plus,
  Building2,
  Home,
  Sparkles,
} from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import { formatMoney, formatDateSomali } from '../utils/formatters';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  familyMembers: string[];
  currency: string;
  onAddTransaction?: () => void;
  accountType?: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete,
  familyMembers,
  currency,
  onAddTransaction,
  accountType,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | TransactionType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<string>('all');
  const [deletingTx, setDeletingTx] = useState<Transaction | null>(null);

  // Distinct categories with transaction counts
  const categoriesList = useMemo(() => {
    const counts: Record<string, number> = {};
    transactions.forEach((tx) => {
      if (tx.category) {
        counts[tx.category] = (counts[tx.category] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [transactions]);

  // Filtered transactions by search query, category, type, and member
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Type filter
      if (selectedType !== 'all' && tx.type !== selectedType) {
        return false;
      }
      // Member filter
      if (selectedMember !== 'all' && tx.familyMember !== selectedMember) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && tx.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Search bar filter: matches description, category, member, payment method, or amount
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchDesc = tx.description.toLowerCase().includes(query);
        const matchCat = tx.category.toLowerCase().includes(query);
        const matchMember = tx.familyMember.toLowerCase().includes(query);
        const matchMethod = tx.paymentMethod.toLowerCase().includes(query);
        const matchAmount = String(tx.amount).includes(query);
        return matchDesc || matchCat || matchMember || matchMethod || matchAmount;
      }
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, selectedType, selectedCategory, selectedMember, searchTerm]);

  // Check if any filter is active
  const hasActiveFilters = Boolean(
    searchTerm.trim() ||
    selectedCategory !== 'all' ||
    selectedType !== 'all' ||
    selectedMember !== 'all'
  );

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedMember('all');
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      alert('No transactions available to export.');
      return;
    }

    const headers = ['Date', 'Type', 'Amount', 'Category', 'Description', 'Member', 'Payment Method'];
    const rows = filteredTransactions.map((tx) => [
      tx.date,
      tx.type === 'dakhli' ? 'Income' : 'Expense',
      tx.amount,
      `"${tx.category}"`,
      `"${tx.description}"`,
      `"${tx.familyMember}"`,
      `"${tx.paymentMethod}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `transactions-statement-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="transaction-list-section" className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-md shadow-slate-950/5 dark:shadow-none">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Transaction History
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {filteredTransactions.length} of {transactions.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Complete record of logged income and expenses
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              id="reset-all-filters-header-btn"
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
          <button
            id="export-csv-button"
            onClick={handleExportCSV}
            title="Download CSV Statement"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters & Search Bar Section */}
      <div className="space-y-3 mb-5">
        {/* Main Controls Row: Search Input + Category Filter + Type Tabs + Member Select */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 items-center">
          {/* Search Bar Input */}
          <div className="relative sm:col-span-2 lg:col-span-5">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="transaction-search-input"
              type="text"
              placeholder="Search description, category, member, or amount..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800/90 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
            />
            {searchTerm && (
              <button
                id="clear-search-button"
                type="button"
                onClick={() => setSearchTerm('')}
                title="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dedicated Category Filter Dropdown */}
          <div className="relative lg:col-span-3">
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                id="filter-category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-transparent text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer truncate"
              >
                <option value="all" className="dark:bg-slate-800">
                  All Categories ({transactions.length})
                </option>
                {categoriesList.map((cat) => (
                  <option key={cat.name} value={cat.name} className="dark:bg-slate-800">
                    {cat.name} ({cat.count})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Type Filter Tabs (All / Expenses / Income) */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 lg:col-span-2">
            <button
              id="filter-all-type"
              type="button"
              onClick={() => setSelectedType('all')}
              className={`flex-1 px-2 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                selectedType === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-xs'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button
              id="filter-kharash-type"
              type="button"
              onClick={() => setSelectedType('kharash')}
              className={`flex-1 px-2 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                selectedType === 'kharash'
                  ? 'bg-white dark:bg-slate-700 text-rose-700 dark:text-rose-400 font-semibold shadow-xs'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Expenses
            </button>
            <button
              id="filter-dakhli-type"
              type="button"
              onClick={() => setSelectedType('dakhli')}
              className={`flex-1 px-2 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                selectedType === 'dakhli'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 font-semibold shadow-xs'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Income
            </button>
          </div>

          {/* Family / Team Member Filter */}
          <div className="relative lg:col-span-2">
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                id="filter-member-select"
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="w-full bg-transparent text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer truncate"
              >
                <option value="all" className="dark:bg-slate-800">All Members</option>
                {familyMembers.map((m) => (
                  <option key={m} value={m} className="dark:bg-slate-800">
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quick Category Chips for Fast Filtering */}
        {categoriesList.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none text-[11px]">
            <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1 shrink-0 font-medium mr-1">
              <Tag className="w-3 h-3 text-slate-400 dark:text-slate-500" />
              Category:
            </span>
            <button
              type="button"
              id="category-chip-all"
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-0.5 rounded-lg font-medium transition-all shrink-0 cursor-pointer border ${
                selectedCategory === 'all'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border-slate-200/60 dark:border-slate-700'
              }`}
            >
              All ({transactions.length})
            </button>
            {categoriesList.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.name}
                  type="button"
                  id={`category-chip-${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setSelectedCategory(isSelected ? 'all' : cat.name)}
                  className={`px-2.5 py-0.5 rounded-lg font-medium transition-all shrink-0 cursor-pointer border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border-slate-200/60 dark:border-slate-700'
                  }`}
                >
                  {cat.name} <span className="opacity-70 text-[10px]">({cat.count})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Active Filters Feedback Bar */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-300 bg-emerald-50/50 dark:bg-slate-800/60 border border-emerald-200/60 dark:border-slate-700 px-3 py-2 rounded-xl">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Found <strong className="text-emerald-700 dark:text-emerald-400">{filteredTransactions.length}</strong> {filteredTransactions.length === 1 ? 'record' : 'records'}:
              </span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px]">
                  Search: &ldquo;<strong>{searchTerm}</strong>&rdquo;
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="hover:text-rose-600 cursor-pointer"
                    title="Remove search filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px]">
                  Category: <strong>{selectedCategory}</strong>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className="hover:text-rose-600 cursor-pointer"
                    title="Remove category filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedType !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px]">
                  Type: <strong>{selectedType === 'dakhli' ? 'Income' : 'Expense'}</strong>
                  <button
                    type="button"
                    onClick={() => setSelectedType('all')}
                    className="hover:text-rose-600 cursor-pointer"
                    title="Remove type filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedMember !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px]">
                  Member: <strong>{selectedMember}</strong>
                  <button
                    type="button"
                    onClick={() => setSelectedMember('all')}
                    className="hover:text-rose-600 cursor-pointer"
                    title="Remove member filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
            <button
              id="reset-all-filters-btn"
              type="button"
              onClick={handleResetFilters}
              className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 underline cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Transaction Content: Responsive Mobile Cards & Desktop Table */}
      {transactions.length === 0 ? (
        <div className="text-center py-14 px-4 border-2 border-dashed border-slate-200/90 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-xs">
            {accountType === 'business' ? (
              <Building2 className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            ) : accountType === 'personal' ? (
              <User className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            ) : (
              <Home className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            )}
          </div>
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
            {accountType === 'business'
              ? 'Your Business Dashboard is Ready'
              : accountType === 'personal'
              ? 'Your Personal Dashboard is Ready'
              : 'Your Family Dashboard is Ready'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
            {accountType === 'business'
              ? 'No sales or business expenses recorded yet. Log your first transaction to track profits and operational costs.'
              : accountType === 'personal'
              ? 'No personal income or expenses recorded yet. Log your first transaction to track your spending habits.'
              : 'No family transactions recorded yet. Log your first transaction to start organizing your home finances.'}
          </p>
          {onAddTransaction && (
            <button
              type="button"
              onClick={onAddTransaction}
              className="mt-4 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-emerald-600/20 inline-flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add First Transaction</span>
            </button>
          )}
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div id="no-matching-transactions-state" className="text-center py-12 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/40 dark:bg-slate-800/20">
          <Filter className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {searchTerm && selectedCategory !== 'all'
              ? `No transactions found matching "${searchTerm}" in "${selectedCategory}"`
              : searchTerm
              ? `No transactions found matching "${searchTerm}"`
              : selectedCategory !== 'all'
              ? `No transactions found in category "${selectedCategory}"`
              : 'No transactions match the selected filters'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try searching with a different term, selecting another category, or reset the filters to view all records.
          </p>
          {hasActiveFilters && (
            <button
              id="reset-empty-filter-btn"
              type="button"
              onClick={handleResetFilters}
              className="mt-3.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      ) : (
        <div>
          {/* 1. MOBILE CARD VIEW (Visible on small screens: sm:hidden) */}
          <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {filteredTransactions.map((tx) => {
              const isIncome = tx.type === 'dakhli';

              return (
                <div key={`m-${tx.id}`} className="py-3 px-1 flex items-start justify-between gap-3">
                  {/* Left: Icon & Details */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isIncome
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/60'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug truncate">
                        {tx.description}
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap mt-1">
                        <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                          {tx.category}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          {formatDateSomali(tx.date)}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          • {tx.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount & Actions */}
                  <div className="flex flex-col items-end shrink-0">
                    <span
                      className={`font-extrabold text-sm tracking-tight ${
                        isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {isIncome ? '+' : '-'}{formatMoney(tx.amount, currency)}
                    </span>
                    <div className="flex items-center gap-1 mt-1.5">
                      <button
                        onClick={() => onEdit(tx)}
                        title="Edit Transaction"
                        className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingTx(tx)}
                        title="Delete Transaction"
                        className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 2. DESKTOP TABLE VIEW (Visible on tablet/desktop: hidden sm:block) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Description & Category</th>
                  <th className="py-2.5 px-3">Member</th>
                  <th className="py-2.5 px-3">Payment Method</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTransactions.map((tx) => {
                  const isIncome = tx.type === 'dakhli';

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors group">
                      {/* Date */}
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                        {formatDateSomali(tx.date)}
                      </td>

                      {/* Description & Category */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              isIncome
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {isIncome ? (
                              <ArrowDownLeft className="w-4 h-4" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                              {tx.description}
                            </div>
                            <div className="text-[11px] text-slate-400 dark:text-slate-500">
                              {tx.category}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Family member */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {tx.familyMember}
                        </span>
                      </td>

                      {/* Payment method */}
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {tx.paymentMethod}
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <span
                          className={`font-bold text-sm ${
                            isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          {isIncome ? '+' : '-'}{formatMoney(tx.amount, currency)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onEdit(tx)}
                            title="Edit"
                            className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingTx(tx)}
                            title="Delete"
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* In-App Delete Confirmation Modal */}
      {deletingTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3 border border-rose-100 dark:border-rose-900">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 text-center mb-1">
              Delete Transaction?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-5">
              Are you sure you want to delete <strong>"{deletingTx.description}"</strong> for {formatMoney(deletingTx.amount, currency)}?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeletingTx(null)}
                className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(deletingTx.id);
                  setDeletingTx(null);
                }}
                className="flex-1 py-2 px-3 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
