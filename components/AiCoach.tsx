
import React, { useState, useEffect, useCallback } from 'react';
import { FinancialData } from '../types';
import { getFinancialAdvice } from '../services/geminiService';
import { Sparkles, Bot } from 'lucide-react';

interface AiCoachProps {
  financialData: FinancialData;
}

export const AiCoach: React.FC<AiCoachProps> = ({ financialData }) => {
  const [advice, setAdvice] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvice = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
        const { incomeSources, monthlyDebt, savings, transactions } = financialData;
        const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
        
        const incomeStability = Math.min(100, incomeSources.length * 25 + (totalIncome > 0 ? 20 : 0));
        const debtToIncomeRatio = totalIncome > 0 ? (monthlyDebt / totalIncome) * 100 : monthlyDebt > 0 ? 100 : 0;
        const debtExposure = Math.max(0, 100 - debtToIncomeRatio * 1.5);
        const estimatedMonthlyExpenses = totalExpenses > 0 ? totalExpenses : (totalIncome * 0.7) || 2000;
        const daysOfBuffer = estimatedMonthlyExpenses > 0 ? (savings / (estimatedMonthlyExpenses / 30)) : 0;
        const emergencyBuffer = Math.min(100, (daysOfBuffer / 30) * 100);
        const monthlyNet = totalIncome - totalExpenses;
        const savingsRate = totalIncome > 0 ? (monthlyNet / totalIncome) * 100 : 0;
        const spendingBehaviour = savingsRate < 0 ? Math.max(0, 50 + savingsRate) : Math.min(100, 50 + savingsRate);
        const overall = (incomeStability + debtExposure + emergencyBuffer + spendingBehaviour) / 4;
        
        const score = { overall, incomeStability, debtExposure, emergencyBuffer, spendingBehaviour };

        const response = await getFinancialAdvice(financialData, score);
        setAdvice(response);
    } catch (err) {
      setError('Could not fetch advice. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [financialData]);
  
  // Fetch advice on initial load
  useEffect(() => {
    fetchAdvice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formattedAdvice = advice
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map((line, index) => {
        if (line.startsWith('* ') || line.startsWith('- ')) {
            return <li key={index} className="flex items-start space-x-2"><span className="text-emerald-500 mt-1">&#10003;</span><span>{line.substring(2)}</span></li>;
        }
        return <p key={index}>{line}</p>;
    });

  return (
    <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4 rounded-r-lg">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
                <Bot className="text-emerald-600" size={24} />
                <h3 className="text-lg font-bold text-emerald-800">AI Financial Coach</h3>
            </div>
            <button onClick={fetchAdvice} disabled={isLoading} className="p-1 text-emerald-600 hover:text-emerald-800 disabled:text-gray-400 transition-colors">
                <Sparkles size={20} className={isLoading ? 'animate-spin' : ''} />
            </button>
        </div>

        {isLoading && <p className="text-gray-600">Generating personalized tips...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!isLoading && !error && advice && (
            <ul className="space-y-2 text-gray-700">
                {formattedAdvice}
            </ul>
        )}
    </div>
  );
};
