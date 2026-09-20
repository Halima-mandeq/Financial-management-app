# Income Management System (Maareynta Dakhliga)

A modern, comprehensive personal and business financial management application designed to track incoming revenue, control everyday expenses, maintain smart budgets, and build long-term savings goals.

---

## 🌟 Key Features

### 1. 💰 Income & Expense Tracking
- **Quick Logging**: Fast and intuitive transaction entry for both income and expenses.
- **Categorization**: Pre-configured categories including Salary, Business, Groceries & Food, Housing Rent, Education, Transport, Healthcare, Utilities, and custom categories.
- **Modern Payment Methods**: Built-in support for regional mobile money (**EVC Plus, Zaad Service, Sahal**), traditional **Cash**, and **Bank Transfers**.
- **Member Assignment**: Tag transactions to specific family members, team members, or business units.

### 2. 📊 Real-Time Financial Dashboard
- **Total Net Balance**: Instant live calculation of total liquidity (Total Income minus Total Expenses).
- **Monthly Income vs. Expenses**: Clear overview of the current month's inflows and outflows.
- **Budget Limit Monitoring**: Proactive notifications and visual progress indicators when approaching or exceeding monthly spending thresholds.

### 3. 🎯 Savings Goals & Deposit Allocation
- **Targeted Goals**: Create dedicated savings targets (e.g., Emergency Fund, Business Equipment, Education, Dream Home).
- **Interactive Deposits**: Allocate funds directly from your income into specific savings accounts.
- **Progress Tracking**: Real-time progress bars with percentage completion, amount remaining, and deadline countdowns.

### 4. 🤖 AI-Powered Financial Advisor (Google Gemini)
- **Smart Financial Insights**: Intelligent financial health checks powered by Google Gemini AI (`@google/genai`).
- **Tailored Recommendations**: Automated advice on reducing unnecessary spending, boosting savings rates, and improving cash flow.

### 5. 📈 6-Month Income & Expense Trends
- **Interactive Visualizations**: Powered by Recharts, offering visual trendlines across the last 6 months to spot seasonal spending habits and revenue growth.

### 6. 👥 Multi-Account Profiles
- **Family / Household**: Manage shared household budgets, chores, and family member expenses.
- **Business**: Track operational costs, sales revenue, and net profit margins.
- **Personal**: Individual expense logging and discretionary budget management.

### 7. 📥 Data Export & Reporting
- **One-Click CSV Export**: Download complete financial ledgers formatted for Microsoft Excel, Google Sheets, or tax preparation.

### 8. 🌓 Dark & Light Mode
- **Theme Support**: Seamlessly toggle between comfortable dark mode and clean light mode, persistent across browser sessions.

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS (v4) & Lucide Icons
- **Motion & Interactions**: Motion (Framer Motion)
- **Data Visualization**: Recharts
- **Backend & APIs**: Node.js & Express
- **Artificial Intelligence**: Google Gemini API (`@google/genai`)
- **Database & Authentication**: Firebase Firestore & Firebase Authentication

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or bun

### 1. Installation
Clone the repository and install dependencies:
```bash
npm instal

## 📁 Directory Structure

```text
├── src/
│   ├── components/            # Reusable UI components (Modals, Charts, Cards)
│   │   ├── SummaryCards.tsx
│   │   ├── MonthlyIncomeExpenseChart.tsx
│   │   ├── SavingsGoalsSection.tsx
│   │   ├── FinancialTipCard.tsx
│   │   ├── TransactionList.tsx
│   │   ├── TransactionModal.tsx
│   │   ├── SavingsGoalModal.tsx
│   │   ├── SavingsDepositModal.tsx
│   │   ├── BudgetSettingsModal.tsx
│   │   └── LoginPage.tsx
│   ├── services/              # Firebase Firestore & Auth integration
│   ├── utils/                 # Currency formatting & date helpers
│   ├── types.ts               # Core TypeScript data contracts
│   ├── App.tsx                # Main application controller
│   └── main.tsx               # Client entry point
├── server.ts                  # Express backend & Gemini AI proxy
├── metadata.json              # App configuration & permissions
├── package.json               # Dependencies and scripts
└── README.md                  # Project documentation
```

---

## 🔒 Security & Best Practices
- **Data Protection**: Real-time cloud persistence backed by Google Cloud Firestore with security rules.

## 📄 License & Attribution
- **Application**: Income Management System (Maareynta Dakhliga)

