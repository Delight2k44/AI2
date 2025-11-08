
import React, { useState } from 'react';
import { INCOME_SOURCES } from '../constants';
import { IncomeSource, IncomeSourceType } from '../types';

interface OnboardingProps {
  onComplete: (sources: IncomeSource[]) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [selectedSources, setSelectedSources] = useState<Set<IncomeSourceType>>(new Set());

  const toggleSource = (sourceId: IncomeSourceType) => {
    setSelectedSources(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sourceId)) {
        newSet.delete(sourceId);
      } else {
        newSet.add(sourceId);
      }
      return newSet;
    });
  };

  const handleContinue = () => {
    const selected = INCOME_SOURCES.filter(s => selectedSources.has(s.id));
    onComplete(selected);
  };

  return (
    <div className="min-h-screen bg-emerald-600 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Welcome to SteadyScore</h1>
        <p className="text-gray-600 mb-6">First, tell us how you earn money. Select all that apply.</p>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          {INCOME_SOURCES.map((source) => {
            const isSelected = selectedSources.has(source.id);
            return (
              <button
                key={source.id}
                onClick={() => toggleSource(source.id)}
                className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center space-y-2 transition-all duration-200 transform hover:scale-105 ${
                  isSelected ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-gray-200 bg-white text-gray-700 hover:border-emerald-300'
                }`}
              >
                <source.icon className="w-8 h-8" />
                <span className="font-semibold text-sm">{source.name}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleContinue}
          disabled={selectedSources.size === 0}
          className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
