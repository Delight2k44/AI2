
import React, { useState, useCallback, useMemo } from 'react';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { ScamScanner } from './components/ScamScanner';
import { IncomeSource, Transaction, FinancialData, View } from './types';
import { User, ShieldCheck, Banknote } from 'lucide-react';

export default function App() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [view, setView] = useState<View>('dashboard');
  const [financialData, setFinancialData] = useState<FinancialData>({
    incomeSources: [],
    transactions: [],
    monthlyDebt: 0,
    savings: 0,
  });

  const handleOnboardingComplete = (sources: IncomeSource[]) => {
    setFinancialData(prev => ({ ...prev, incomeSources: sources }));
    setIsOnboarded(true);
  };

  const updateFinancialData = useCallback((data: Partial<FinancialData>) => {
    setFinancialData(prev => ({ ...prev, ...data }));
  }, []);

  const totalIncome = useMemo(() => {
    return financialData.transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [financialData.transactions]);

  const totalExpenses = useMemo(() => {
    return financialData.transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [financialData.transactions]);

  if (!isOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const NavItem = ({ icon, label, currentView, targetView }: { icon: React.ReactNode, label: string, currentView: View, targetView: View }) => (
    <button
      onClick={() => setView(targetView)}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs transition-colors duration-200 ${
        currentView === targetView ? 'text-emerald-600' : 'text-gray-500 hover:text-emerald-500'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      <header className="bg-emerald-600 text-white shadow-md w-full sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <h1 className="text-2xl font-bold tracking-tight">SteadyScore</h1>
          <p className="text-sm text-emerald-100">Your path to financial resilience.</p>
        </div>
      </header>

      <main className="flex-grow p-4 md:p-6 max-w-4xl mx-auto w-full mb-16">
        {view === 'dashboard' && (
          <Dashboard
            financialData={financialData}
            updateFinancialData={updateFinancialData}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
          />
        )}
        {view === 'scanner' && <ScamScanner />}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-t-lg z-10">
        <div className="max-w-4xl mx-auto flex justify-around">
          <NavItem icon={<Banknote size={24} />} label="Dashboard" currentView={view} targetView='dashboard' />
          <NavItem icon={<ShieldCheck size={24} />} label="Scam Scan" currentView={view} targetView='scanner' />
        </div>
      </nav>
    </div>
  );
}
