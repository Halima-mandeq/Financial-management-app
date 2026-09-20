import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Transaction, BudgetConfig, UserProfile, SavingsGoal } from '../types';

// Collections
const USERS_COLLECTION = 'users';
const TRANSACTIONS_COLLECTION = 'transactions';
const GOALS_COLLECTION = 'savingsGoals';
const CONFIGS_COLLECTION = 'budgetConfigs';

/**
 * Save / Update User Profile in Firestore
 */
export async function syncUserToFirestore(user: UserProfile): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, user.id);
    await setDoc(
      userRef,
      {
        ...user,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firestore sync user warning:', err);
  }
}

/**
 * Subscribe to User's Transactions in Real-Time
 */
export function subscribeUserTransactions(
  userId: string,
  onData: (txs: Transaction[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const q = query(collection(db, TRANSACTIONS_COLLECTION), where('userId', '==', userId));
    return onSnapshot(
      q,
      (snapshot) => {
        const txs: Transaction[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          txs.push({
            id: data.id || docSnap.id,
            type: data.type,
            amount: Number(data.amount) || 0,
            category: data.category || 'Kuwo Kale',
            description: data.description || '',
            date: data.date || new Date().toISOString().slice(0, 10),
            familyMember: data.familyMember || 'Guud',
            paymentMethod: data.paymentMethod || 'EVC Plus / Zaad',
          });
        });
        // Sort newest first
        txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        onData(txs);
      },
      (err) => {
        console.warn('Firestore transactions subscription error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn('Firestore transactions query failed:', err);
    return () => {};
  }
}

/**
 * Save Single Transaction to Firestore
 */
export async function saveTransactionToFirestore(
  userId: string,
  accountType: string,
  tx: Transaction
): Promise<void> {
  try {
    const txRef = doc(db, TRANSACTIONS_COLLECTION, tx.id);
    await setDoc(txRef, {
      ...tx,
      userId,
      accountType,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Firestore save transaction warning:', err);
  }
}

/**
 * Batch upload multiple initial transactions to Firestore
 */
export async function batchSaveTransactionsToFirestore(
  userId: string,
  accountType: string,
  txs: Transaction[]
): Promise<void> {
  try {
    for (const tx of txs) {
      await saveTransactionToFirestore(userId, accountType, tx);
    }
  } catch (err) {
    console.warn('Firestore batch save warning:', err);
  }
}

/**
 * Delete Transaction from Firestore
 */
export async function deleteTransactionFromFirestore(txId: string): Promise<void> {
  try {
    const txRef = doc(db, TRANSACTIONS_COLLECTION, txId);
    await deleteDoc(txRef);
  } catch (err) {
    console.warn('Firestore delete transaction warning:', err);
  }
}

/**
 * Subscribe to User's Savings Goals in Real-Time
 */
export function subscribeUserGoals(
  userId: string,
  onData: (goals: SavingsGoal[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const q = query(collection(db, GOALS_COLLECTION), where('userId', '==', userId));
    return onSnapshot(
      q,
      (snapshot) => {
        const goalsList: SavingsGoal[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          goalsList.push({
            id: data.id || docSnap.id,
            title: data.title,
            targetAmount: Number(data.targetAmount) || 0,
            currentAmount: Number(data.currentAmount) || 0,
            deadline: data.deadline,
            category: data.category || 'emergency',
            icon: data.icon || 'Target',
            color: data.color || 'emerald',
            notes: data.notes,
            createdAt: data.createdAt || new Date().toISOString().slice(0, 10),
          });
        });
        onData(goalsList);
      },
      (err) => {
        console.warn('Firestore goals subscription error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn('Firestore goals query failed:', err);
    return () => {};
  }
}

/**
 * Save Single Savings Goal to Firestore
 */
export async function saveGoalToFirestore(userId: string, goal: SavingsGoal): Promise<void> {
  try {
    const goalRef = doc(db, GOALS_COLLECTION, goal.id);
    await setDoc(goalRef, {
      ...goal,
      userId,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Firestore save goal warning:', err);
  }
}

/**
 * Delete Savings Goal from Firestore
 */
export async function deleteGoalFromFirestore(goalId: string): Promise<void> {
  try {
    const goalRef = doc(db, GOALS_COLLECTION, goalId);
    await deleteDoc(goalRef);
  } catch (err) {
    console.warn('Firestore delete goal warning:', err);
  }
}

/**
 * Save / Update Budget Configuration in Firestore
 */
export async function saveConfigToFirestore(userId: string, config: BudgetConfig): Promise<void> {
  try {
    const cfgRef = doc(db, CONFIGS_COLLECTION, userId);
    await setDoc(
      cfgRef,
      {
        ...config,
        userId,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firestore save config warning:', err);
  }
}

/**
 * Get Budget Configuration from Firestore
 */
export async function fetchConfigFromFirestore(userId: string): Promise<BudgetConfig | null> {
  try {
    const cfgRef = doc(db, CONFIGS_COLLECTION, userId);
    const snap = await getDoc(cfgRef);
    if (snap.exists()) {
      return snap.data() as BudgetConfig;
    }
  } catch (err) {
    console.warn('Firestore fetch config warning:', err);
  }
  return null;
}
