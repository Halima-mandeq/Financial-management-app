import { CategoryItem, Transaction, BudgetConfig, UserProfile, SavingsGoal } from '../types';

export const FAMILY_CATEGORIES: CategoryItem[] = [
  // Kharashaadka Qoyska (Family Expenses)
  { id: 'cunto', name: 'Cuntada & Suuqa', type: 'kharash', iconName: 'ShoppingBag', color: 'emerald' },
  { id: 'kire', name: 'Kirada Guriga', type: 'kharash', iconName: 'Home', color: 'blue' },
  { id: 'koronto_biyo', name: 'Korontada & Biyaha', type: 'kharash', iconName: 'Zap', color: 'amber' },
  { id: 'waxbarasho', name: 'Waxbarashada Carruurta', type: 'kharash', iconName: 'GraduationCap', color: 'indigo' },
  { id: 'caafimaad', name: 'Caafimaadka & Daawada', type: 'kharash', iconName: 'HeartPulse', color: 'rose' },
  { id: 'gaadiid', name: 'Gaadiidka & Shidaalka', type: 'kharash', iconName: 'Car', color: 'orange' },
  { id: 'internet', name: 'Internetka & Taleefanka', type: 'kharash', iconName: 'Wifi', color: 'cyan' },
  { id: 'ehel', name: 'Caawinta Ehelka / Sadaqo', type: 'kharash', iconName: 'Gift', color: 'purple' },
  { id: 'dhar', name: 'Dharka & Qoyska', type: 'kharash', iconName: 'Sparkles', color: 'fuchsia' },
  { id: 'kale_kharash', name: 'Kharashyo Kale oo Qoys', type: 'kharash', iconName: 'MoreHorizontal', color: 'slate' },

  // Dakhliga Qoyska (Family Income)
  { id: 'mushahar', name: 'Mushaharka Bisha', type: 'dakhli', iconName: 'Briefcase', color: 'emerald' },
  { id: 'ganacsi_dakhli', name: 'Ganacsiga & Faaiidada', type: 'dakhli', iconName: 'TrendingUp', color: 'teal' },
  { id: 'xawaalad', name: 'Xawaalad / Kaalmo Ehel', type: 'dakhli', iconName: 'Send', color: 'blue' },
  { id: 'shaqo_dheeraad', name: 'Shaqo Dheeraad ah (Side Job)', type: 'dakhli', iconName: 'Layers', color: 'violet' },
  { id: 'kale_dakhli', name: 'Dakhli Kale oo Qoys', type: 'dakhli', iconName: 'PlusCircle', color: 'emerald' },
];

export const BUSINESS_CATEGORIES: CategoryItem[] = [
  // Kharashaadka Ganacsiga (Business Expenses)
  { id: 'biz_stock', name: 'Soo Iibsashada Alaabta (Stock)', type: 'kharash', iconName: 'Package', color: 'emerald' },
  { id: 'biz_salary', name: 'Mushaharka Shaqaalaha', type: 'kharash', iconName: 'Users', color: 'blue' },
  { id: 'biz_rent', name: 'Kirada Dukaanka / Goobta', type: 'kharash', iconName: 'Building2', color: 'indigo' },
  { id: 'biz_logistics', name: 'Gaadiidka & Raraanka (Logistics)', type: 'kharash', iconName: 'Truck', color: 'orange' },
  { id: 'biz_utilities', name: 'Biilasha & Korontada Ganacsiga', type: 'kharash', iconName: 'Zap', color: 'amber' },
  { id: 'biz_marketing', name: 'Xayeysiiska & Suuqgeynta', type: 'kharash', iconName: 'Megaphone', color: 'rose' },
  { id: 'biz_taxes', name: 'Canshuuraha & Ruqsadda Dowladda', type: 'kharash', iconName: 'FileCheck', color: 'violet' },
  { id: 'biz_repairs', name: 'Dayactirka Qalabka & Dukaanka', type: 'kharash', iconName: 'Wrench', color: 'cyan' },
  { id: 'biz_other_expense', name: 'Kharashyo Kale oo Ganacsi', type: 'kharash', iconName: 'MoreHorizontal', color: 'slate' },

  // Dakhliga Ganacsiga (Business Income)
  { id: 'biz_daily_sales', name: 'Iibka Maalinlaha ah (Daily Sales)', type: 'dakhli', iconName: 'TrendingUp', color: 'emerald' },
  { id: 'biz_services', name: 'Qandaraas / Adeeg Bixin', type: 'dakhli', iconName: 'Briefcase', color: 'teal' },
  { id: 'biz_wholesale', name: 'Iibka Jumladleyda (Wholesale)', type: 'dakhli', iconName: 'Layers', color: 'blue' },
  { id: 'biz_investment', name: 'Maalgashi / Lacag Dib loo Helay', type: 'dakhli', iconName: 'Coins', color: 'violet' },
  { id: 'biz_other_income', name: 'Dakhli Kale oo Ganacsi', type: 'dakhli', iconName: 'PlusCircle', color: 'emerald' },
];

export const PERSONAL_CATEGORIES: CategoryItem[] = [
  // Kharashaadka Shakhsiga (Personal Expenses)
  { id: 'pers_food', name: 'Cuntada & Qadada Dibadda', type: 'kharash', iconName: 'Coffee', color: 'emerald' },
  { id: 'pers_tea', name: 'Shaaha & Fadhiyada Asxaabta', type: 'kharash', iconName: 'Utensils', color: 'amber' },
  { id: 'pers_transport', name: 'Gaadiidka & Bajaajta / Shidaalka', type: 'kharash', iconName: 'Car', color: 'blue' },
  { id: 'pers_clothes', name: 'Dharka & Labiska Gaarka ah', type: 'kharash', iconName: 'Sparkles', color: 'fuchsia' },
  { id: 'pers_phone', name: 'Kaarka Taleefanka & Internet Data', type: 'kharash', iconName: 'Smartphone', color: 'cyan' },
  { id: 'pers_learning', name: 'Koorsooyin & Waxbarasho Gaar ah', type: 'kharash', iconName: 'BookOpen', color: 'indigo' },
  { id: 'pers_gym', name: 'Jimicsiga (Gym) & Madadaalada', type: 'kharash', iconName: 'Dumbbell', color: 'rose' },
  { id: 'pers_health', name: 'Daryeelka Shakhsiga & Daawada', type: 'kharash', iconName: 'HeartPulse', color: 'teal' },
  { id: 'pers_other_expense', name: 'Kharashyo Kale oo Gaar ah', type: 'kharash', iconName: 'MoreHorizontal', color: 'slate' },

  // Dakhliga Shakhsiga (Personal Income)
  { id: 'pers_salary', name: 'Mushaharka Shaqada', type: 'dakhli', iconName: 'Briefcase', color: 'emerald' },
  { id: 'pers_freelance', name: 'Shaqo Madaxbannaan (Freelance/Gigs)', type: 'dakhli', iconName: 'Laptop', color: 'teal' },
  { id: 'pers_gift', name: 'Hadiyad / Kaalmo Gaar ah', type: 'dakhli', iconName: 'Gift', color: 'blue' },
  { id: 'pers_investment', name: 'Faa\'iido / Dakhli Maalgashi', type: 'dakhli', iconName: 'TrendingUp', color: 'violet' },
  { id: 'pers_other_income', name: 'Dakhli Kale oo Shakhsi ah', type: 'dakhli', iconName: 'PlusCircle', color: 'emerald' },
];

export const GET_CATEGORIES_FOR_ACCOUNT_TYPE = (
  accountType?: string
): CategoryItem[] => {
  if (accountType === 'business') return BUSINESS_CATEGORIES;
  if (accountType === 'personal') return PERSONAL_CATEGORIES;
  return FAMILY_CATEGORIES;
};

export const DEFAULT_CATEGORIES: CategoryItem[] = FAMILY_CATEGORIES;

export const DEFAULT_BUDGET_CONFIG: BudgetConfig = {
  monthlyLimit: 750,
  currency: 'USD ($)',
  familyMembers: ['Xaliimo', 'Odayga Guriga', 'Qoyska Guud', 'Carruurta'],
};

const getPastDate = (monthsAgo: number, day: number = 5) => {
  const d = new Date();
  d.setMonth(d.getMonth() - monthsAgo);
  d.setDate(day);
  return d.toISOString().slice(0, 10);
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  // Bishan (Current month)
  {
    id: 'tx-1',
    type: 'dakhli',
    amount: 850,
    category: 'Mushaharka Bisha',
    description: 'Mushaharka bisha laga shaqeeyay',
    date: new Date().toISOString().slice(0, 10),
    familyMember: 'Xaliimo',
    paymentMethod: 'Bangiga (Bank)',
  },
  {
    id: 'tx-2',
    type: 'dakhli',
    amount: 150,
    category: 'Xawaalad / Kaalmo',
    description: 'Xawaalad ehelka dibadda ka timid',
    date: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10),
    familyMember: 'Qoyska Guud',
    paymentMethod: 'EVC Plus / Zaad',
  },
  {
    id: 'tx-3',
    type: 'kharash',
    amount: 220,
    category: 'Kirada Guriga',
    description: 'Kirada guriga ee bishan',
    date: new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10),
    familyMember: 'Qoyska Guud',
    paymentMethod: 'EVC Plus / Zaad',
  },
  {
    id: 'tx-4',
    type: 'kharash',
    amount: 125,
    category: 'Cuntada & Suuqa',
    description: 'Suuqa qudaarta, hilibka iyo raashinka bisha',
    date: new Date(Date.now() - 1 * 86400000).toISOString().slice(0, 10),
    familyMember: 'Xaliimo',
    paymentMethod: 'EVC Plus / Zaad',
  },
  {
    id: 'tx-5',
    type: 'kharash',
    amount: 45,
    category: 'Korontada & Biyaha',
    description: 'Biilka korontada iyo biyaha guriga',
    date: new Date().toISOString().slice(0, 10),
    familyMember: 'Qoyska Guud',
    paymentMethod: 'EVC Plus / Zaad',
  },
  {
    id: 'tx-6',
    type: 'kharash',
    amount: 25,
    category: 'Internetka & Taleefanka',
    description: 'Wifi-ga guriga bisha',
    date: new Date(Date.now() - 4 * 86400000).toISOString().slice(0, 10),
    familyMember: 'Xaliimo',
    paymentMethod: 'EVC Plus / Zaad',
  },

  // 1 Bil ka hor (1 month ago)
  {
    id: 'tx-hist-1',
    type: 'dakhli',
    amount: 850,
    category: 'Mushaharka Bisha',
    description: 'Mushaharka bishii hore',
    date: getPastDate(1, 2),
    familyMember: 'Xaliimo',
    paymentMethod: 'Bangiga (Bank)',
  },
  {
    id: 'tx-hist-2',
    type: 'kharash',
    amount: 220,
    category: 'Kirada Guriga',
    description: 'Kirada guriga',
    date: getPastDate(1, 5),
    familyMember: 'Qoyska Guud',
    paymentMethod: 'EVC Plus / Zaad',
  },
  {
    id: 'tx-hist-3',
    type: 'kharash',
    amount: 280,
    category: 'Cuntada & Suuqa',
    description: 'Raashinka qoyska bishii hore',
    date: getPastDate(1, 12),
    familyMember: 'Xaliimo',
    paymentMethod: 'EVC Plus / Zaad',
  },

  // 2 Bilood ka hor (2 months ago)
  {
    id: 'tx-hist-4',
    type: 'dakhli',
    amount: 1000,
    category: 'Mushaharka Bisha',
    description: 'Mushahar & gunno shaqo',
    date: getPastDate(2, 2),
    familyMember: 'Xaliimo',
    paymentMethod: 'Bangiga (Bank)',
  },
  {
    id: 'tx-hist-5',
    type: 'kharash',
    amount: 220,
    category: 'Kirada Guriga',
    description: 'Kirada guriga',
    date: getPastDate(2, 4),
    familyMember: 'Qoyska Guud',
    paymentMethod: 'EVC Plus / Zaad',
  },
  {
    id: 'tx-hist-6',
    type: 'kharash',
    amount: 340,
    category: 'Cuntada & Suuqa',
    description: 'Suuqa iyo iibsasho qoyska',
    date: getPastDate(2, 15),
    familyMember: 'Xaliimo',
    paymentMethod: 'EVC Plus / Zaad',
  },

  // 3 Bilood ka hor (3 months ago)
  {
    id: 'tx-hist-7',
    type: 'dakhli',
    amount: 850,
    category: 'Mushaharka Bisha',
    description: 'Mushaharka bisha',
    date: getPastDate(3, 1),
    familyMember: 'Xaliimo',
    paymentMethod: 'Bangiga (Bank)',
  },
  {
    id: 'tx-hist-8',
    type: 'kharash',
    amount: 220,
    category: 'Kirada Guriga',
    description: 'Kirada guriga',
    date: getPastDate(3, 5),
    familyMember: 'Qoyska Guud',
    paymentMethod: 'EVC Plus / Zaad',
  },
  {
    id: 'tx-hist-9',
    type: 'kharash',
    amount: 260,
    category: 'Cuntada & Suuqa',
    description: 'Raashinka qoyska',
    date: getPastDate(3, 16),
    familyMember: 'Xaliimo',
    paymentMethod: 'EVC Plus / Zaad',
  },

  // 4 Bilood ka hor (4 months ago)
  {
    id: 'tx-hist-10',
    type: 'dakhli',
    amount: 950,
    category: 'Mushaharka Bisha',
    description: 'Mushahar & dakhli ganacsi',
    date: getPastDate(4, 2),
    familyMember: 'Xaliimo',
    paymentMethod: 'Bangiga (Bank)',
  },
  {
    id: 'tx-hist-11',
    type: 'kharash',
    amount: 220,
    category: 'Kirada Guriga',
    description: 'Kirada guriga',
    date: getPastDate(4, 5),
    familyMember: 'Qoyska Guud',
    paymentMethod: 'EVC Plus / Zaad',
  },
  {
    id: 'tx-hist-12',
    type: 'kharash',
    amount: 310,
    category: 'Cuntada & Suuqa',
    description: 'Raashinka & waxbarashada carruurta',
    date: getPastDate(4, 18),
    familyMember: 'Xaliimo',
    paymentMethod: 'EVC Plus / Zaad',
  },

  // 5 Bilood ka hor (5 months ago)
  {
    id: 'tx-hist-13',
    type: 'dakhli',
    amount: 800,
    category: 'Mushaharka Bisha',
    description: 'Mushaharka bilowga xisaabta',
    date: getPastDate(5, 1),
    familyMember: 'Xaliimo',
    paymentMethod: 'Bangiga (Bank)',
  },
  {
    id: 'tx-hist-14',
    type: 'kharash',
    amount: 220,
    category: 'Kirada Guriga',
    description: 'Kirada guriga',
    date: getPastDate(5, 5),
    familyMember: 'Qoyska Guud',
    paymentMethod: 'EVC Plus / Zaad',
  },
  {
    id: 'tx-hist-15',
    type: 'kharash',
    amount: 250,
    category: 'Cuntada & Suuqa',
    description: 'Suuqa iyo adeegyada guriga',
    date: getPastDate(5, 14),
    familyMember: 'Xaliimo',
    paymentMethod: 'EVC Plus / Zaad',
  },
];

export const INITIAL_BUSINESS_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-biz-1',
    type: 'dakhli',
    amount: 1450,
    category: 'Iibka Maalinlaha ah (Daily Sales)',
    description: 'Iibka dukaanka ee usbuucii lasoo dhaafay',
    date: new Date().toISOString().slice(0, 10),
    familyMember: 'Axmed Nuur',
    paymentMethod: 'EVC Plus / Zaad',
  },
  {
    id: 'tx-biz-2',
    type: 'kharash',
    amount: 520,
    category: 'Soo Iibsashada Alaabta (Stock)',
    description: 'Konteynarka alaab cusub oo dukaanka timid',
    date: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10),
    familyMember: 'Khasnada Ganacsiga',
    paymentMethod: 'Bangiga (Bank)',
  },
  {
    id: 'tx-biz-3',
    type: 'kharash',
    amount: 250,
    category: 'Mushaharka Shaqaalaha',
    description: 'Mushaharka kaaliyaha dukaanka',
    date: new Date(Date.now() - 4 * 86400000).toISOString().slice(0, 10),
    familyMember: 'Khasnada Ganacsiga',
    paymentMethod: 'EVC Plus / Zaad',
  },
  {
    id: 'tx-biz-4',
    type: 'kharash',
    amount: 180,
    category: 'Kirada Dukaanka / Goobta',
    description: 'Kirada booska dukaanka ee bishan',
    date: new Date(Date.now() - 5 * 86400000).toISOString().slice(0, 10),
    familyMember: 'Khasnada Ganacsiga',
    paymentMethod: 'Bangiga (Bank)',
  },
];

export const INITIAL_PERSONAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-pers-1',
    type: 'dakhli',
    amount: 450,
    category: 'Mushaharka Shaqada',
    description: 'Dakhliga bishan ee qeyb ahaan lasoo shubay',
    date: new Date().toISOString().slice(0, 10),
    familyMember: 'Deeqo Cali',
    paymentMethod: 'Bangiga (Bank)',
  },
  {
    id: 'tx-pers-2',
    type: 'kharash',
    amount: 35,
    category: 'Shaaha & Fadhiyada Asxaabta',
    description: 'Shaah iyo makhaayad asxaabta',
    date: new Date(Date.now() - 1 * 86400000).toISOString().slice(0, 10),
    familyMember: 'Deeqo Cali',
    paymentMethod: 'EVC Plus / Zaad',
  },
  {
    id: 'tx-pers-3',
    type: 'kharash',
    amount: 25,
    category: 'Gaadiidka & Bajaajta / Shidaalka',
    description: 'Bajaajta iyo rakaabka shaqada',
    date: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10),
    familyMember: 'Deeqo Cali',
    paymentMethod: 'EVC Plus / Zaad',
  },
  {
    id: 'tx-pers-4',
    type: 'kharash',
    amount: 15,
    category: 'Kaarka Taleefanka & Internet Data',
    description: 'Kaarka xirmo internet bishan',
    date: new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10),
    familyMember: 'Deeqo Cali',
    paymentMethod: 'EVC Plus / Zaad',
  },
];

/**
 * Returns initial transactions for a user:
 * - Brand new registered user: Starts with an empty (clean) dashboard `[]`!
 * - Pre-existing demo accounts: Preloaded with realistic starter samples.
 */
export const GET_INITIAL_TRANSACTIONS_FOR_USER = (user: UserProfile): Transaction[] => {
  if (user.isNewUser) {
    // A brand new user starts with a completely FRESH / EMPTY dashboard
    return [];
  }
  if (user.id === 'acc-axmed' || (user.accountType === 'business' && !user.isNewUser)) {
    return INITIAL_BUSINESS_TRANSACTIONS;
  }
  if (user.id === 'acc-deeqo' || (user.accountType === 'personal' && !user.isNewUser)) {
    return INITIAL_PERSONAL_TRANSACTIONS;
  }
  return INITIAL_TRANSACTIONS;
};

/**
 * Returns initial budget and member configuration for a user based on their account type.
 */
export const GET_INITIAL_CONFIG_FOR_USER = (user: UserProfile): BudgetConfig => {
  const currency = user.initialCurrency || 'USD ($)';
  if (user.accountType === 'business') {
    return {
      monthlyLimit: user.initialBudgetLimit || 1800,
      currency,
      familyMembers: [user.name, 'Khasnada Ganacsiga', 'Shaqaalaha'],
    };
  }
  if (user.accountType === 'personal') {
    return {
      monthlyLimit: user.initialBudgetLimit || 350,
      currency,
      familyMembers: [user.name, 'Jeebka Gaarka ah'],
    };
  }
  return {
    monthlyLimit: user.initialBudgetLimit || 750,
    currency,
    familyMembers: [user.name, 'Qoyska Guud', 'Carruurta'],
  };
};

/**
 * Returns sample starter transactions tailored for an account type (for quick preview/demo)
 */
export const GET_CATEGORY_SAMPLE_TRANSACTIONS = (
  accountType: 'family' | 'business' | 'personal',
  userName: string
): Transaction[] => {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (accountType === 'business') {
    return [
      {
        id: 'tx-sample-b1',
        type: 'dakhli',
        amount: 850,
        category: 'Iibka Maalinlaha ah (Daily Sales)',
        description: 'Dakhliga guud ee iibka dukaanka',
        date: today,
        familyMember: userName,
        paymentMethod: 'EVC Plus / Zaad',
      },
      {
        id: 'tx-sample-b2',
        type: 'kharash',
        amount: 320,
        category: 'Soo Iibsashada Alaabta (Stock & Inventory)',
        description: 'Kartoomo baasto & saliid cusub',
        date: today,
        familyMember: userName,
        paymentMethod: 'Bangiga (Bank)',
      },
      {
        id: 'tx-sample-b3',
        type: 'kharash',
        amount: 150,
        category: 'Mushaharka Shaqaalaha',
        description: 'Mushaharka caawiyaha dukaanka',
        date: yesterday,
        familyMember: userName,
        paymentMethod: 'EVC Plus / Zaad',
      },
    ];
  }

  if (accountType === 'personal') {
    return [
      {
        id: 'tx-sample-p1',
        type: 'dakhli',
        amount: 300,
        category: 'Mushaharka Shaqada',
        description: 'Dakhliga shaqada freelance',
        date: today,
        familyMember: userName,
        paymentMethod: 'Bangiga (Bank)',
      },
      {
        id: 'tx-sample-p2',
        type: 'kharash',
        amount: 12,
        category: 'Shaaha & Makhaayadda',
        description: 'Qado & shaax asxaabta',
        date: today,
        familyMember: userName,
        paymentMethod: 'EVC Plus / Zaad',
      },
      {
        id: 'tx-sample-p3',
        type: 'kharash',
        amount: 25,
        category: 'Gaadiidka, Bajaajta & Shidaalka',
        description: 'Rakaabka iyo tagista xarunta',
        date: yesterday,
        familyMember: userName,
        paymentMethod: 'EVC Plus / Zaad',
      },
    ];
  }

  return [
    {
      id: 'tx-sample-f1',
      type: 'dakhli',
      amount: 600,
      category: 'Mushaharka Bisha',
      description: 'Dakhliga bishan ee qoyska',
      date: today,
      familyMember: userName,
      paymentMethod: 'Bangiga (Bank)',
    },
    {
      id: 'tx-sample-f2',
      type: 'kharash',
      amount: 120,
      category: 'Cuntada & Suuqa',
      description: 'Raashinka & qudaarta toddobaadka',
      date: today,
      familyMember: userName,
      paymentMethod: 'EVC Plus / Zaad',
    },
    {
      id: 'tx-sample-f3',
      type: 'kharash',
      amount: 45,
      category: 'Korontada & Biyaha',
      description: 'Biilka korontada & biyaha guriga',
      date: yesterday,
      familyMember: userName,
      paymentMethod: 'EVC Plus / Zaad',
    },
  ];
};

export const GET_INITIAL_GOALS_FOR_USER = (user: UserProfile): SavingsGoal[] => {
  const accountType = user.accountType || 'family';
  const today = new Date().toISOString().slice(0, 10);

  if (accountType === 'business') {
    return [
      {
        id: 'goal-biz-1',
        title: 'New Business Laptop & IT Setup',
        targetAmount: 1200,
        currentAmount: 780,
        category: 'tech',
        icon: 'Laptop',
        color: 'blue',
        deadline: '2026-11-30',
        notes: 'Laptop cusub oo awood badan leh oo loogu talagalay xisaabaadka & shaqada ganacsiga.',
        createdAt: today,
      },
      {
        id: 'goal-biz-2',
        title: 'Balaadhinta Raasamaalka & Stock Cusub',
        targetAmount: 3000,
        currentAmount: 1450,
        category: 'business',
        icon: 'Coins',
        color: 'emerald',
        deadline: '2027-01-15',
        notes: 'Kayd loo dhigayo iibsashada alaabta jumladleyda xilliga ciidda.',
        createdAt: today,
      },
      {
        id: 'goal-biz-3',
        title: 'Kaydka Canshuuraha & Ruqsadda',
        targetAmount: 500,
        currentAmount: 350,
        category: 'emergency',
        icon: 'ShieldAlert',
        color: 'amber',
        deadline: '2026-12-31',
        notes: 'Liisanka dowladda iyo xisaab-xidhka canshuuraha sanadka.',
        createdAt: today,
      },
    ];
  }

  if (accountType === 'personal') {
    return [
      {
        id: 'goal-pers-1',
        title: 'Emergency Fund (Kaydka Degdegga)',
        targetAmount: 1000,
        currentAmount: 620,
        category: 'emergency',
        icon: 'ShieldAlert',
        color: 'emerald',
        deadline: '2026-12-31',
        notes: 'Kayd loogu talagalay arrimaha degdegga ah ama caafimaadka lama filaanka ah.',
        createdAt: today,
      },
      {
        id: 'goal-pers-2',
        title: 'New Personal Laptop & Tech Gadgets',
        targetAmount: 850,
        currentAmount: 510,
        category: 'tech',
        icon: 'Laptop',
        color: 'purple',
        deadline: '2026-10-30',
        notes: 'Laptop casri ah oo loogu talagalay koorsooyinka iyo waxbarashada online-ka.',
        createdAt: today,
      },
      {
        id: 'goal-pers-3',
        title: 'Koorsooyin & Xirfad Kororsi (Certifications)',
        targetAmount: 400,
        currentAmount: 280,
        category: 'education',
        icon: 'GraduationCap',
        color: 'cyan',
        deadline: '2026-11-15',
        notes: 'Kharashka imtixaannada iyo tababarrada xirfadeed.',
        createdAt: today,
      },
    ];
  }

  // Default: Family Goals
  return [
    {
      id: 'goal-fam-1',
      title: 'Emergency Fund (Kaydka Degdegga Qoyska)',
      targetAmount: 2500,
      currentAmount: 1650,
      category: 'emergency',
      icon: 'ShieldAlert',
      color: 'emerald',
      deadline: '2026-12-31',
      notes: 'Lacag kayd ah oo lagu daboolo xaaladaha caafimaadka ama waxyaabaha lama filaanka ah.',
      createdAt: today,
    },
    {
      id: 'goal-fam-2',
      title: 'Waxbarashada & Jaamacadda Carruurta',
      targetAmount: 1800,
      currentAmount: 950,
      category: 'education',
      icon: 'GraduationCap',
      color: 'blue',
      deadline: '2026-10-15',
      notes: 'Fiiga semester-ka soo socda iyo agabka dugsiga carruurta.',
      createdAt: today,
    },
    {
      id: 'goal-fam-3',
      title: 'Dayactirka & Qalabka Guriga Cusub',
      targetAmount: 1200,
      currentAmount: 400,
      category: 'home',
      icon: 'Home',
      color: 'amber',
      deadline: '2027-02-28',
      notes: 'Iibsashada qalab cusub oo koronto ah iyo dayactirka jikada.',
      createdAt: today,
    },
  ];
};

