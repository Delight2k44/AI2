
import React, { useState } from 'react';
import { Transaction, IncomeSource } from '../types';
import { EXPENSE_CATEGORIES } from '../constants';
import { Plus, ArrowDown, ArrowUp, PiggyBank, Landmark } from 'lucide-react';

interface FinancialInputProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  onUpdateDebts: (amount: number) => void;
  onUpdateSavings: (amount: number) => void;
  currentDebt: number;
  currentSavings: number;
  incomeSources: IncomeSource[];
}

type ActiveForm = 'income' | 'expense' | 'debt' | 'savings' | null;

export const FinancialInput: React.FC<FinancialInputProps> = ({ onAddTransaction, onUpdateDebts, onUpdateSavings, currentDebt, currentSavings, incomeSources }) => {
  const [activeForm, setActiveForm] = useState<ActiveForm>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0 || !activeForm) return;

    if (activeForm === 'income' || activeForm === 'expense') {
        if (!description || !category) return;
        onAddTransaction({ description, amount: numAmount, type: activeForm, category, isRecurring });
    } else if (activeForm === 'debt') {
        onUpdateDebts(numAmount);
    } else if (activeForm === 'savings') {
        onUpdateSavings(numAmount);
    }

    setAmount('');
    setDescription('');
    setCategory('');
    setIsRecurring(false);
    setActiveForm(null);
  };
  
  const toggleForm = (form: ActiveForm) => {
    setActiveForm(prev => (prev === form ? null : form));
    setAmount('');
    setDescription('');
    setCategory('');
    setIsRecurring(false);
  };

  const renderForm = () => {
    if (!activeForm) return null;
    
    let title = '';
    let placeholder = '';
    const showTransactionFields = activeForm === 'income' || activeForm === 'expense';
    
    switch(activeForm) {
        case 'income':
            title = 'Log New Income';
            placeholder = 'e.g., Vetkoek sales';
            break;
        case 'expense':
            title = 'Log New Expense';
            placeholder = 'e.g., Groceries';
            break;
        case 'debt':
            title = 'Update Monthly Debts';
            break;
        case 'savings':
            title = 'Update Total Savings';
            break;
    }

    return (
        <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">{title}</h3>
            <div className="space-y-3">
                {showTransactionFields && (
                    <>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={placeholder}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        >
                            <option value="" disabled>Select a category</option>
                            {activeForm === 'income' && incomeSources.map(source => (
                                <option key={source.id} value={source.name}>{source.name}</option>
                            ))}
                            {activeForm === 'expense' && EXPENSE_CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </>
                )}
                 <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount (ZAR)"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                    min="0"
                    step="0.01"
                />
                {showTransactionFields && (
                    <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isRecurring}
                            onChange={(e) => setIsRecurring(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>Recurring transaction</span>
                    </label>
                )}
                <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700">
                        {showTransactionFields ? 'Add' : 'Update'}
                    </button>
                    <button type="button" onClick={() => setActiveForm(null)} className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300">
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    )
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Manage Your Money</h2>
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => toggleForm('income')} className="flex items-center justify-center gap-2 p-3 bg-emerald-50 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-100 transition-colors">
            <ArrowUp size={18} /> Add Income
        </button>
        <button onClick={() => toggleForm('expense')} className="flex items-center justify-center gap-2 p-3 bg-red-50 text-red-700 font-semibold rounded-lg hover:bg-red-100 transition-colors">
            <ArrowDown size={18} /> Add Expense
        </button>
        <button onClick={() => toggleForm('debt')} className="flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition-colors">
            <Landmark size={18} /> Set Debts
        </button>
        <button onClick={() => toggleForm('savings')} className="flex items-center justify-center gap-2 p-3 bg-yellow-50 text-yellow-700 font-semibold rounded-lg hover:bg-yellow-100 transition-colors">
            <PiggyBank size={18} /> Set Savings
        </button>
      </div>
      {renderForm()}
    </div>
  );
};