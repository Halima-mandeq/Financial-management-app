export type TransactionType = 'dakhli' | 'kharash';

export type PaymentMethod = 'EVC Plus / Zaad' | 'Kaash (Lacag Cadaan)' | 'Bangiga (Bank)' | 'e-Dahab / Sahal';

export type AccountType = 'family' | 'business' | 'personal';

export interface CategoryItem {
  id: string;
  name: string;
  type: TransactionType;
  iconName: string;
  color: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string; // YYYY-MM-DD
  familyMember: string;
  paymentMethod: PaymentMethod;
}

export interface BudgetConfig {
  monthlyLimit: number;
  currency: 'USD ($)' | 'SOS (Sh.So)';
  familyMembers: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  emailOrPhone: string;
  role?: string;
  avatarColor?: string;
  accountType?: AccountType;
  isNewUser?: boolean;
  initialBudgetLimit?: number;
  initialCurrency?: 'USD ($)' | 'SOS (Sh.So)';
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string; // YYYY-MM-DD
  category: 'emergency' | 'business' | 'tech' | 'home' | 'education' | 'travel' | 'vehicle' | 'other';
  icon: string;
  color: 'emerald' | 'blue' | 'purple' | 'amber' | 'rose' | 'cyan' | 'indigo';
  notes?: string;
  createdAt: string;
}

export interface FinancialTip {
  title: string;
  tip: string;
  action: string;
  estimatedSavings: string;
  category: string;
  urgency: 'high' | 'medium' | 'positive';
  generatedAt?: string;
}

