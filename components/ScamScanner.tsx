
import React, { useState } from 'react';
import { analyzeScamMessage } from '../services/geminiService';
import { ScamAnalysisResult } from '../types';
import { ShieldAlert, ShieldCheck, Search } from 'lucide-react';

export const ScamScanner: React.FC = () => {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<ScamAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    if (!message.trim()) return;
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const responseJson = await analyzeScamMessage(message);
      const parsedResult: ScamAnalysisResult = JSON.parse(responseJson);
      setResult(parsedResult);
    } catch (err) {
      setError('Failed to analyze the message. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const ResultCard = () => {
    if (!result) return null;

    if (result.is_scam) {
      return (
        <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
          <div className="flex items-center space-x-3">
            <ShieldAlert className="text-red-600 h-8 w-8" />
            <div>
              <h3 className="text-lg font-bold text-red-800">Potential Scam Detected!</h3>
              <p className="text-sm font-semibold text-red-700">Confidence: {result.confidence}%</p>
            </div>
          </div>
          <p className="mt-3 text-red-700">{result.explanation}</p>
        </div>
      );
    }

    return (
        <div className="mt-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="text-emerald-600 h-8 w-8" />
            <div>
              <h3 className="text-lg font-bold text-emerald-800">Looks Safe</h3>
               <p className="text-sm font-semibold text-emerald-700">Confidence: {result.confidence}%</p>
            </div>
          </div>
          <p className="mt-3 text-emerald-700">{result.explanation}</p>
        </div>
    );
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Digital Safety Shield</h2>
      <p className="text-gray-600 mb-4">Received a suspicious message? Paste it here to check if it's a scam.</p>
      
      <div className="space-y-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Paste message from SMS, WhatsApp, etc."
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
        />
        <button
          onClick={handleScan}
          disabled={isLoading || !message.trim()}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 hover:bg-emerald-700 disabled:bg-gray-300"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Scanning...</span>
            </>
          ) : (
            <>
                <Search size={20} />
                <span>Scan Message</span>
            </>
          )}
        </button>
      </div>
      
      {error && <p className="mt-4 text-center text-red-600">{error}</p>}

      <ResultCard />
    </div>
  );
};
