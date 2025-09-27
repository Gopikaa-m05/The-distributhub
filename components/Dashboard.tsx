
import React from 'react';
import { View } from '../types';
import { EnvelopeIcon, BellAlertIcon, MagnifyingGlassCircleIcon } from './icons/Icons';

interface DashboardProps {
    setView: (view: View) => void;
}

const DashboardCard: React.FC<{
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
}> = ({ title, description, icon, onClick }) => (
    <div 
        onClick={onClick}
        className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
    >
        <div className="flex-shrink-0 text-blue-600">{icon}</div>
        <div className="mt-4 flex-grow">
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
            <p className="mt-2 text-sm text-slate-600">{description}</p>
        </div>
        <div className="mt-4 text-right">
             <span className="text-sm font-medium text-blue-600 hover:text-blue-800">Go to Tool &rarr;</span>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
    return (
        <div>
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-slate-800">Welcome to your AI Dashboard</h2>
                <p className="text-slate-600 mt-1">Select a tool to streamline your workflow.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard 
                    title="Email Summarizer"
                    description="Upload emails to get quick summaries and automatic categorization for orders, payments, and more."
                    icon={<EnvelopeIcon className="w-10 h-10"/>}
                    onClick={() => setView(View.EMAIL_SUMMARIZER)}
                />
                <DashboardCard 
                    title="Renewal Reminder Bot"
                    description="Track contract and product renewal dates. Get timely alerts for upcoming deadlines."
                    icon={<BellAlertIcon className="w-10 h-10"/>}
                    onClick={() => setView(View.RENEWAL_REMINDER)}
                />
                <DashboardCard 
                    title="AI Document Analysis"
                    description="Upload a document, ask a specific question, and get an AI-powered analysis instantly."
                    icon={<MagnifyingGlassCircleIcon className="w-10 h-10"/>}
                    onClick={() => setView(View.DOCUMENT_ANALYSIS)}
                />
            </div>
        </div>
    );
};

export default Dashboard;