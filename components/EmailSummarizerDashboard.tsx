import React, { useState, useCallback } from 'react';
import type { EmailSummary } from '../types';
import { summarizeEmail } from '../services/geminiService';
import { EnvelopeIcon, SparklesIcon, TagIcon } from './icons/Icons';

// New types for mock data
type Priority = 'High' | 'Medium' | 'Low';
interface MockEmail {
  id: number;
  sender: string;
  subject: string;
  priority: Priority;
  category: 'Orders' | 'Payments' | 'Offers' | 'Follow-ups' | 'Contracts';
  content: string;
}

// Mock Dataset
const mockEmails: MockEmail[] = [
  {
    id: 6,
    sender: 'Legal Team',
    subject: 'Review Required: MSA for Quantum Dynamics',
    priority: 'High',
    category: 'Contracts',
    content: "Hi, Please review the attached Master Service Agreement for our new partnership with Quantum Dynamics. We need your feedback by EOD Friday. Key areas to focus on are liability and payment terms. Thanks, Sarah from Legal.",
  },
  {
    id: 7,
    sender: 'Pioneer Corp',
    subject: 'Signed Agreement Attached',
    priority: 'Medium',
    category: 'Contracts',
    content: "Hello, We have signed the updated service agreement. Please find the executed copy attached. We look forward to continuing our work together. Best, Tom @ Pioneer Corp."
  },
  {
    id: 1,
    sender: 'Global Tech Inc.',
    subject: 'Urgent: PO-2024-789 Attached',
    priority: 'High',
    category: 'Orders',
    content: "Hi Team,\nPlease find attached the purchase order #PO-2024-789 for 500 units of 'Model X' processors. Please confirm receipt and provide an estimated shipping date. We need these expedited. \n\nBest, John Doe, Global Tech Inc.",
  },
  {
    id: 2,
    sender: 'Innovate LLC',
    subject: 'Payment Confirmation for Invoice #INV-1234',
    priority: 'Medium',
    category: 'Payments',
    content: "Hello, This email is to confirm that we have processed the payment for invoice #INV-1234. The funds should reflect in your account within 2-3 business days. Regards, Jane Smith, Accounts Payable.",
  },
  {
    id: 3,
    sender: 'Marketing Solutions',
    subject: 'Exclusive Offer: 20% Off All Services',
    priority: 'Low',
    category: 'Offers',
    content: "Don't miss out on our limited-time offer! Get 20% off all marketing packages when you sign up before the end of the month. Click here to learn more. Cheers, The Marketing Solutions Team.",
  },
  {
    id: 4,
    sender: 'Quantum Dynamics',
    subject: 'Follow-up on our meeting last week',
    priority: 'Medium',
    category: 'Follow-ups',
    content: "Hi, Just wanted to follow up on our discussion regarding the partnership proposal. Do you have any updates from your side? Let me know if you need any more information. Thanks, Alex Ray.",
  },
  {
      id: 5,
      sender: 'Stellar Solutions',
      subject: 'Invoice #INV-5678 is 15 days overdue',
      priority: 'High',
      category: 'Payments',
      content: "This is a reminder that invoice #INV-5678 for $5,400 is now 15 days past its due date. Please process this payment at your earliest convenience to avoid service interruptions. Thank you, Billing Dept."
  }
];

const priorityStyles: { [key in Priority]: { dot: string; text: string } } = {
  High: { dot: 'bg-red-500', text: 'text-red-800' },
  Medium: { dot: 'bg-yellow-500', text: 'text-yellow-800' },
  Low: { dot: 'bg-green-500', text: 'text-green-800' },
};

const categoryStyles = {
    Orders: 'bg-blue-100 text-blue-800',
    Payments: 'bg-green-100 text-green-800',
    Offers: 'bg-purple-100 text-purple-800',
    'Follow-ups': 'bg-yellow-100 text-yellow-800',
    Contracts: 'bg-indigo-100 text-indigo-800',
};


const EmailSummarizerDashboard: React.FC = () => {
    const [emails] = useState<MockEmail[]>(mockEmails);
    const [selectedEmailId, setSelectedEmailId] = useState<number | null>(null);
    const [summary, setSummary] = useState<EmailSummary | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleSummarize = useCallback(async () => {
        const selectedEmail = emails.find(e => e.id === selectedEmailId);
        if (!selectedEmail) {
            setError('Please select an email to summarize.');
            return;
        }
        setIsLoading(true);
        setError('');
        setSummary(null);
        try {
            const result = await summarizeEmail(selectedEmail.content);
            setSummary(result);
        } catch (err) {
            setError('Failed to summarize the email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedEmailId, emails]);

    return (
        <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-1">Email Summarizer</h2>
            <p className="text-slate-600 mb-6">Select an email from your inbox to get an AI-generated summary and category.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Inbox Card */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <EnvelopeIcon className="w-6 h-6 mr-2 text-blue-600" />
                        Inbox
                    </h3>
                    <div className="space-y-2 h-80 overflow-y-auto pr-2">
                        {emails.map((email) => (
                            <div 
                                key={email.id}
                                onClick={() => setSelectedEmailId(email.id)}
                                className={`p-3 rounded-lg cursor-pointer border-2 transition-colors ${selectedEmailId === email.id ? 'bg-blue-50 border-blue-400' : 'border-transparent hover:bg-green-50'}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <span className={`w-3 h-3 rounded-full mr-3 ${priorityStyles[email.priority].dot}`}></span>
                                        <p className="font-semibold text-slate-700">{email.sender}</p>
                                    </div>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryStyles[email.category]}`}>{email.category}</span>
                                </div>
                                <p className="text-sm text-slate-600 mt-1 ml-6">{email.subject}</p>
                            </div>
                        ))}
                    </div>
                    
                    {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                    <button 
                        onClick={handleSummarize} 
                        disabled={!selectedEmailId || isLoading}
                        className="w-full mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition-colors"
                    >
                        {isLoading ? 'Summarizing...' : 'Summarize Selected Email'}
                    </button>
                </div>

                {/* Output Card */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                     <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <SparklesIcon className="w-6 h-6 mr-2 text-blue-600" />
                        AI Summary
                    </h3>
                    {isLoading && (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                        </div>
                    )}
                    {summary && !isLoading && (
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-slate-700 flex items-center mb-2">
                                    <TagIcon className="w-5 h-5 mr-2 text-slate-500" />
                                    Category
                                </h4>
                                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">
                                    {summary.category}
                                </span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-700 mb-2">Summary Points</h4>
                                <ul className="list-disc list-inside space-y-2 text-slate-600">
                                    {summary.summary.map((point, index) => (
                                        <li key={index}>{point}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                    {!summary && !isLoading && (
                        <div className="text-center text-slate-500 py-10">
                            <p>Select an email and click 'Summarize' to see the result here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailSummarizerDashboard;