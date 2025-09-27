import { GoogleGenAI, Type } from "@google/genai";
import type { EmailSummary } from '../types';

// This is for structural correctness. In a real app, the API key would be in an environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeEmail = async (emailContent: string): Promise<EmailSummary> => {
    console.log("Calling Gemini API for email summarization...", { emailContent });
    // In a real implementation, you would call:
    // FIX: Switched to gemini-2.5-flash model and correct API usage.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Summarize the following email into short bullet points and categorize it into one of the following: 'Orders', 'Payments', 'Follow-ups', 'Inquiries', 'General'. Return a JSON object with 'summary' (an array of strings) and 'category' keys. Email: ${emailContent}`,
        config: { 
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    summary: { type: Type.ARRAY, items: { type: Type.STRING } },
                    category: { type: Type.STRING }
                }
            }
        }
    });
    // FIX: Correctly parse JSON from the response text.
    const result = JSON.parse(response.text);
    return result;
};

export const searchContract = async (contractContent: string, query: string): Promise<string> => {
    console.log("Calling Gemini API for contract search...", { contractContent, query });
    // In a real implementation, you would call:
    // FIX: Switched to gemini-2.5-flash model and correct API usage.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are a helpful AI assistant that answers questions based *only* on the provided contract text. If the answer cannot be found in the contract, clearly state that. Do not make up information. Contract: """${contractContent}""" \n\n User Question: "${query}"`
    });
    // FIX: Use .text property to get response.
    return response.text;
};

export const compareContracts = async (contractA: string, contractB: string): Promise<string> => {
    console.log("Calling Gemini API for contract comparison...", { contractA, contractB });
    // In a real implementation, you would call:
    // FIX: Switched to gemini-2.5-flash model and correct API usage.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are a helpful AI assistant specializing in legal document analysis. Compare the following two contracts. Highlight the key differences in clauses like payment terms, delivery, confidentiality, liability, and termination. Present the comparison in a clear, easy-to-read format using markdown for headings and bullet points.

        Contract A: """${contractA}"""

        Contract B: """${contractB}"""`
    });
    // FIX: Use .text property to get response.
    return response.text;
};
