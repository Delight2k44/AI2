
import React, { useMemo } from 'react';
import { FinancialData, ResilienceScore } from '../types';
import { DollarSign, BarChart2, Shield, ShoppingBag } from 'lucide-react';

interface ScoreDisplayProps {
  financialData: FinancialData;
  totalIncome: number;
  totalExpenses: number;
}

const PillarCard = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: number }) => {
    const color = value > 75 ? 'text-emerald-500' : value > 40 ? 'text-yellow-500' : 'text-red-500';
    return (
        <div className="bg-white p-3 rounded-lg flex items-center space-x-3 shadow-sm">
            <div className={`p-2 rounded-full bg-gray-100 ${color}`}>{icon}</div>
            <div>
                <p className="text-sm text-gray-600">{title}</p>
                <p className={`text-lg font-bold ${color}`}>{value.toFixed(0)}<span className="text-sm font-normal text-gray-500">/100</span></p>
            </div>
        </div>
    );
};

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ financialData, totalIncome, totalExpenses }) => {
  
  const score = useMemo<ResilienceScore>(() => {
    const { incomeSources, monthlyDebt, savings } = financialData;

    // 1. Income Stability (based on number of sources)
    const incomeStability = Math.min(100, incomeSources.length * 25 + (totalIncome > 0 ? 20 : 0));

    // 2. Debt Exposure (debt-to-income ratio)
    const debtToIncomeRatio = totalIncome > 0 ? (monthlyDebt / totalIncome) * 100 : monthlyDebt > 0 ? 100 : 0;
    const debtExposure = Math.max(0, 100 - debtToIncomeRatio * 1.5);

    // 3. Emergency Buffer (savings vs expenses)
    const monthlyNet = totalIncome - totalExpenses;
    const estimatedMonthlyExpenses = totalExpenses > 0 ? totalExpenses : (totalIncome * 0.7) || 2000;
    const daysOfBuffer = estimatedMonthlyExpenses > 0 ? (savings / (estimatedMonthlyExpenses / 30)) : 0;
    const emergencyBuffer = Math.min(100, (daysOfBuffer / 30) * 100); // 100 score = 30 days buffer

    // 4. Spending Behaviour (savings rate)
    const savingsRate = totalIncome > 0 ? (monthlyNet / totalIncome) * 100 : 0;
    const spendingBehaviour = savingsRate < 0 ? Math.max(0, 50 + savingsRate) : Math.min(100, 50 + savingsRate);

    const overall = (incomeStability + debtExposure + emergencyBuffer + spendingBehaviour) / 4;
    
    return { overall, incomeStability, debtExposure, emergencyBuffer, spendingBehaviour };
  }, [financialData, totalIncome, totalExpenses]);

  const scoreColor = score.overall > 75 ? 'text-emerald-500' : score.overall > 40 ? 'text-yellow-500' : 'text-red-500';
  const scoreBgColor = score.overall > 75 ? 'bg-emerald-100' : score.overall > 40 ? 'bg-yellow-100' : 'bg-red-100';
  const strokeColor = score.overall > 75 ? '#10B981' : score.overall > 40 ? '#F59E0B' : '#EF4444';
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score.overall / 100) * circumference;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Your Financial Resilience Score</h2>
        <div className="flex justify-center items-center mb-6">
            <div className="relative w-48 h-48">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="10"
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                    />
                </svg>
                <div className={`absolute inset-0 flex flex-col items-center justify-center ${scoreColor}`}>
                    <span className="text-5xl font-bold">{score.overall.toFixed(0)}</span>
                    <span className="text-sm font-medium">out of 100</span>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <PillarCard icon={<BarChart2 size={20} />} title="Income Stability" value={score.incomeStability} />
            <PillarCard icon={<DollarSign size={20} />} title="Debt Exposure" value={score.debtExposure} />
            <PillarCard icon={<Shield size={20} />} title="Emergency Buffer" value={score.emergencyBuffer} />
            <PillarCard icon={<ShoppingBag size={20} />} title="Spending Habits" value={score.spendingBehaviour} />
        </div>
    </div>
  );
};
