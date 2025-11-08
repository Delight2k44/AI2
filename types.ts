// FIX: Import ComponentType from 'react' to resolve 'Cannot find namespace React' error.
import type { ComponentType } from 'react';

export enum IncomeSourceType {
  SOCIAL_GRANT = "Social Grant",
  SIDE_HUSTLE = "Side Hustle",
  FAMILY_SUPPORT = "Family Support",
  FORMAL_JOB = "Formal Job",
}

export interface IncomeSource {
  id: IncomeSourceType;
  name: string;
  icon: ComponentType<{ className?: string }>;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  icon: ComponentType<{ className?: string }>;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
  isRecurring?: boolean;
}

export interface FinancialData {
  incomeSources: IncomeSource[];
  transactions: Transaction[];
  monthlyDebt: number;
  savings: number;
}

export interface ResilienceScore {
  overall: number;
  incomeStability: number;
  debtExposure: number;
  emergencyBuffer: number;
  spendingBehaviour: number;
}

export interface ScamAnalysisResult {
  is_scam: boolean;
  confidence: number;
  explanation: string;
}

export type View = 'dashboard' | 'scanner';