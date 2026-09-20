import React from 'react';
import { Transaction } from '../types';
import { formatMoney } from '../utils/formatters';
import {
  PieChart,
  ShoppingBag,
  Home,
  Zap,
  GraduationCap,
  HeartPulse,
  Car,
  Wifi,
  Gift,
  Sparkles,
  MoreHorizontal,
  Package,
  Users,
  Building2,
  Truck,
  Megaphone,
  FileCheck,
  Wrench,
  Coffee,
  Utensils,
  Smartphone,
  BookOpen,
  Dumbbell,
} from 'lucide-react';

interface CategoryBreakdownProps {
  transactions: Transaction[];
  currency: string;
}

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  // Qoyska (Family)
  'Cuntada & Suuqa': <ShoppingBag className="w-4 h-4 text-emerald-600" />,
  'Kirada Guriga': <Home className="w-4 h-4 text-blue-600" />,
  'Korontada & Biyaha': <Zap className="w-4 h-4 text-amber-600" />,
  'Waxbarashada Carruurta': <GraduationCap className="w-4 h-4 text-indigo-600" />,
  'Caafimaadka & Daawada': <HeartPulse className="w-4 h-4 text-rose-600" />,
  'Gaadiidka & Shidaalka': <Car className="w-4 h-4 text-orange-600" />,
  'Internetka & Taleefanka': <Wifi className="w-4 h-4 text-cyan-600" />,
  'Caawinta Ehelka / Sadaqo': <Gift className="w-4 h-4 text-purple-600" />,
  'Dharka & Qoyska': <Sparkles className="w-4 h-4 text-fuchsia-600" />,
  'Dharka & Shakhsi': <Sparkles className="w-4 h-4 text-fuchsia-600" />,
  'Kharashyo Kale oo Qoys': <MoreHorizontal className="w-4 h-4 text-slate-600" />,
  'Kharashyo Kale': <MoreHorizontal className="w-4 h-4 text-slate-600" />,

  // Ganacsi (Business)
  'Soo Iibsashada Alaabta (Stock)': <Package className="w-4 h-4 text-emerald-600" />,
  'Mushaharka Shaqaalaha': <Users className="w-4 h-4 text-blue-600" />,
  'Kirada Dukaanka / Goobta': <Building2 className="w-4 h-4 text-indigo-600" />,
  'Gaadiidka & Raraanka (Logistics)': <Truck className="w-4 h-4 text-orange-600" />,
  'Biilasha & Korontada Ganacsiga': <Zap className="w-4 h-4 text-amber-600" />,
  'Xayeysiiska & Suuqgeynta': <Megaphone className="w-4 h-4 text-rose-600" />,
  'Canshuuraha & Ruqsadda Dowladda': <FileCheck className="w-4 h-4 text-violet-600" />,
  'Dayactirka Qalabka & Dukaanka': <Wrench className="w-4 h-4 text-cyan-600" />,
  'Kharashyo Kale oo Ganacsi': <MoreHorizontal className="w-4 h-4 text-slate-600" />,

  // Shakhsi (Personal)
  'Cuntada & Qadada Dibadda': <Coffee className="w-4 h-4 text-emerald-600" />,
  'Shaaha & Fadhiyada Asxaabta': <Utensils className="w-4 h-4 text-amber-600" />,
  'Gaadiidka & Bajaajta / Shidaalka': <Car className="w-4 h-4 text-blue-600" />,
  'Dharka & Labiska Gaarka ah': <Sparkles className="w-4 h-4 text-fuchsia-600" />,
  'Kaarka Taleefanka & Internet Data': <Smartphone className="w-4 h-4 text-cyan-600" />,
  'Koorsooyin & Waxbarasho Gaar ah': <BookOpen className="w-4 h-4 text-indigo-600" />,
  'Jimicsiga (Gym) & Madadaalada': <Dumbbell className="w-4 h-4 text-rose-600" />,
  'Daryeelka Shakhsiga & Daawada': <HeartPulse className="w-4 h-4 text-teal-600" />,
  'Kharashyo Kale oo Gaar ah': <MoreHorizontal className="w-4 h-4 text-slate-600" />,
};

const CATEGORY_GRADIENTS = [
  'from-emerald-500 to-teal-400',
  'from-blue-500 to-indigo-500',
  'from-amber-500 to-orange-400',
  'from-purple-500 to-pink-500',
  'from-rose-500 to-red-400',
  'from-cyan-500 to-blue-400',
];

const CATEGORY_BADGES = [
  'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
  'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
  'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
  'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
];

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ transactions, currency }) => {
  const expenseTransactions = transactions.filter((t) => t.type === 'kharash');
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Group by category
  const categoryTotals = expenseTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = (Object.entries(categoryTotals) as [string, number][])
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  if (sortedCategories.length === 0) {
    return (
      <div id="category-breakdown-empty" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 text-center shadow-xs">
        <PieChart className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No expenses recorded yet</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Expenses you log will be categorized and analyzed here.</p>
      </div>
    );
  }

  return (
    <div id="category-breakdown-card" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-md shadow-slate-950/5 dark:shadow-none">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <PieChart className="w-4 h-4" />
          </div>
          Expense Breakdown by Category
        </h3>
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/90 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
          Total: {formatMoney(totalExpense, currency)}
        </span>
      </div>

      <div className="space-y-4">
        {sortedCategories.slice(0, 6).map((item, idx) => {
          const icon = CATEGORY_ICON_MAP[item.category] || (
            <MoreHorizontal className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          );
          const gradientClass = CATEGORY_GRADIENTS[idx % CATEGORY_GRADIENTS.length];
          const badgeClass = CATEGORY_BADGES[idx % CATEGORY_BADGES.length];

          return (
            <div key={item.category} className="space-y-2 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 font-bold text-slate-800 dark:text-slate-200">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-xs">
                    {icon}
                  </div>
                  <span>{item.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-950 dark:text-slate-100">{formatMoney(item.amount, currency)}</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${badgeClass}`}>
                    {item.percentage}%
                  </span>
                </div>
              </div>

              {/* Colorful Progress bar with gradient */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5">
                <div
                  className={`bg-gradient-to-r ${gradientClass} h-full rounded-full transition-all duration-500 shadow-xs`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
