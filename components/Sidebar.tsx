import React from 'react';
import { View } from '../types';
import { ChartPieIcon, EnvelopeIcon, BellAlertIcon, MagnifyingGlassCircleIcon, CpuChipIcon, ArrowRightOnRectangleIcon } from './icons/Icons';

interface SidebarProps {
    currentView: View;
    setView: (view: View) => void;
    onLogout: () => void;
}

const NavItem: React.FC<{
    view: View;
    currentView: View;
    setView: (view: View) => void;
    icon: React.ReactNode;
    label: string;
}> = ({ view, currentView, setView, icon, label }) => {
    const isActive = currentView === view;
    return (
        <li
            onClick={() => setView(view)}
            className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-200 ${
                isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-200 hover:bg-slate-700 hover:text-white'
            }`}
        >
            <span className="w-6 h-6 mr-3">{icon}</span>
            <span className="font-medium">{label}</span>
        </li>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout }) => {
    return (
        <aside className="w-64 bg-slate-800 text-white p-4 flex flex-col">
            <div className="flex items-center mb-8">
                <CpuChipIcon className="w-10 h-10 text-blue-400" />
                <h2 className="text-2xl font-bold ml-2">AI Tools</h2>
            </div>
            <nav>
                <ul>
                    <NavItem view={View.DASHBOARD} currentView={currentView} setView={setView} icon={<ChartPieIcon />} label="Dashboard" />
                    <NavItem view={View.EMAIL_SUMMARIZER} currentView={currentView} setView={setView} icon={<EnvelopeIcon />} label="Email Summarizer" />
                    <NavItem view={View.RENEWAL_REMINDER} currentView={currentView} setView={setView} icon={<BellAlertIcon />} label="Renewal Reminders" />
                    <NavItem view={View.DOCUMENT_ANALYSIS} currentView={currentView} setView={setView} icon={<MagnifyingGlassCircleIcon />} label="AI Document Analysis" />
                </ul>
            </nav>
            <div className="mt-auto">
                <ul>
                    <li
                        onClick={onLogout}
                        className="flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-200 text-slate-200 hover:bg-slate-700 hover:text-white"
                        aria-label="Logout"
                    >
                        <span className="w-6 h-6 mr-3"><ArrowRightOnRectangleIcon /></span>
                        <span className="font-medium">Logout</span>
                    </li>
                </ul>
                <div className="text-center text-slate-400 text-sm pt-4 mt-2 border-t border-slate-700">
                    <p>&copy; 2024 Distributor Inc.</p>
                    <p>All rights reserved.</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;