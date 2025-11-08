
import { Handshake, Briefcase, Users, Store, ShoppingCart, Bus, Home, Smartphone } from 'lucide-react';
import { IncomeSource, IncomeSourceType, ExpenseCategory } from './types';

export const INCOME_SOURCES: IncomeSource[] = [
  { id: IncomeSourceType.SOCIAL_GRANT, name: "Social Grant", icon: Handshake },
  { id: IncomeSourceType.SIDE_HUSTLE, name: "Side Hustle", icon: Store },
  { id: IncomeSourceType.FAMILY_SUPPORT, name: "Family Support", icon: Users },
  { id: IncomeSourceType.FORMAL_JOB, name: "Formal Job", icon: Briefcase },
];

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
    { id: 'groceries', name: 'Groceries', icon: ShoppingCart },
    { id: 'transport', name: 'Transport', icon: Bus },
    { id: 'rent', name: 'Rent/Housing', icon: Home },
    { id: 'airtime', name: 'Airtime/Data', icon: Smartphone },
];