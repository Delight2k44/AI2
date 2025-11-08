
import { GoogleGenAI, Type } from "@google/genai";
import { FinancialData, ResilienceScore } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getFinancialAdvice = async (data: FinancialData, score: ResilienceScore): Promise<string> => {
  const { incomeSources, monthlyDebt, savings, transactions } = data;
  
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const monthlyExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

  const prompt = `
    Act as a friendly, encouraging financial coach for a South African living in the informal economy.
    Their financial situation is as follows:
    - Income Sources: ${incomeSources.map(s => s.name).join(', ') || 'None specified'}
    - Total Monthly Income (Logged): ZAR ${totalIncome.toFixed(2)}
    - Total Monthly Expenses (Logged): ZAR ${monthlyExpenses.toFixed(2)}
    - Monthly Debt Repayments: ZAR ${monthlyDebt.toFixed(2)}
    - Total Savings: ZAR ${savings.toFixed(2)}

    Their Financial Resilience Score is ${score.overall}/100, with this breakdown:
    - Income Stability: ${score.incomeStability}/100
    - Debt Exposure: ${score.debtExposure}/100
    - Emergency Buffer: ${score.emergencyBuffer}/100
    - Spending Behaviour: ${score.spendingBehaviour}/100

    Based on this, provide 2-3 short, simple, and actionable tips to improve their financial resilience.
    Focus on their weakest areas. For example, if Income Stability is low, suggest diversifying income. If Emergency Buffer is low, suggest small savings habits.
    Use plain, jargon-free language. Format the response as a simple markdown list.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching financial advice:", error);
    return "Sorry, I couldn't generate advice right now. Please check your connection and try again.";
  }
};


export const analyzeScamMessage = async (message: string): Promise<string> => {
    const prompt = `
      You are a scam detection expert for South Africans. Analyze the following message and determine if it is a scam.
      Message: "${message}"
      Respond ONLY with a valid JSON object with three keys:
      1. "is_scam": a boolean (true if it's a scam, false otherwise).
      2. "confidence": a number between 0 and 100 representing your confidence in the verdict.
      3. "explanation": a short, simple explanation in plain language about why it is or isn't a scam. Mention common red flags like requests for upfront fees, urgent language, or suspicious links.
    `;
  
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        is_scam: { type: Type.BOOLEAN },
                        confidence: { type: Type.NUMBER },
                        explanation: { type: Type.STRING }
                    },
                    required: ["is_scam", "confidence", "explanation"]
                }
            }
        });
        
        return response.text.trim();
    } catch (error) {
        console.error("Error analyzing scam message:", error);
        throw new Error("Could not analyze message. The API might be down or the format is incorrect.");
    }
};
