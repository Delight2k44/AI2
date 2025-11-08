
import React, { useState, useMemo } from 'react';
import { FinancialData, Transaction } from '../types';
import { ScoreDisplay } from './ScoreDisplay';
import { FinancialInput } from './FinancialInput';
import { AiCoach } from './AiCoach';
import { ArrowUp, ArrowDown, Repeat } from 'lucide-react';

interface DashboardProps {
  financialData: FinancialData;
  updateFinancialData: (data: Partial<FinancialData>) => void;
  totalIncome: number;
  totalExpenses: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ financialData, updateFinancialData, totalIncome, totalExpenses }) => {
  const [sortKey, setSortKey] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const handleAddTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
        ...transaction,
        id: new Date().toISOString(),
        date: new Date().toISOString(), // Use ISO string for accurate sorting
    }
    updateFinancialData({ transactions: [...financialData.transactions, newTransaction] });
  };

  const handleUpdateDebts = (amount: number) => {
    updateFinancialData({ monthlyDebt: amount });
  };

  const handleUpdateSavings = (amount: number) => {
    updateFinancialData({ savings: amount });
  };

  const sortedTransactions = useMemo(() => {
    return [...financialData.transactions].sort((a, b) => {
      let comparison = 0;
      if (sortKey === 'date') {
        // Compare dates by converting to milliseconds
        comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
      } else { // amount
        comparison = b.amount - a.amount;
      }
      // Invert comparison for ascending order
      return sortOrder === 'asc' ? -comparison : comparison;
    });
  }, [financialData.transactions, sortKey, sortOrder]);
  
  return (
    <div className="space-y-6">
      <ScoreDisplay 
        financialData={financialData} 
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
      />
      <AiCoach financialData={financialData} />
      <FinancialInput 
        onAddTransaction={handleAddTransaction}
        onUpdateDebts={handleUpdateDebts}
        onUpdateSavings={handleUpdateSavings}
        currentDebt={financialData.monthlyDebt}
        currentSavings={financialData.savings}
        incomeSources={financialData.incomeSources}
      />
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Sort by:</span>
            <button 
              onClick={() => setSortKey('date')} 
              className={`px-3 py-1 text-sm rounded-full transition-colors ${sortKey === 'date' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Date
            </button>
            <button 
              onClick={() => setSortKey('amount')} 
              className={`px-3 py-1 text-sm rounded-full transition-colors ${sortKey === 'amount' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Amount
            </button>
            <button 
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')} 
              className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              aria-label={`Sort order: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
            >
              {sortOrder === 'desc' ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
            </button>
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {sortedTransactions.length > 0 ? (
            sortedTransactions.map(t => (
              <div key={t.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800 truncate">{t.description}</p>
                    {t.isRecurring && <Repeat size={12} className="text-gray-500 flex-shrink-0" title="Recurring" />}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                     <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">{t.category}</span>
                     <span>{new Date(t.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className={`font-bold text-lg whitespace-nowrap pl-3 ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'} R {t.amount.toFixed(2)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No transactions logged yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};