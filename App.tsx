import React, { useState, useEffect } from 'react';
// FIX: Changed firebase import path to use scoped package for compatibility.
import { onAuthStateChanged, signOut, User } from '@firebase/auth';
import { auth } from './firebaseConfig';
import { View } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import EmailSummarizerDashboard from './components/EmailSummarizerDashboard';
import RenewalReminderBotDashboard from './components/RenewalReminderBotDashboard';
import AIDocumentAnalysisDashboard from './components/AIContractSearchDashboard';
import LoginPage from './components/LoginPage';

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            // user state will be updated by onAuthStateChanged listener
            setCurrentView(View.DASHBOARD);
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };
    
    if (loading) {
         return (
            <div className="flex items-center justify-center h-screen bg-green-50">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return <LoginPage />;
    }

    const renderContent = () => {
        switch (currentView) {
            case View.DASHBOARD:
                return <Dashboard setView={setCurrentView} />;
            case View.EMAIL_SUMMARIZER:
                return <EmailSummarizerDashboard />;
            case View.RENEWAL_REMINDER:
                return <RenewalReminderBotDashboard />;
            case View.DOCUMENT_ANALYSIS:
                return <AIDocumentAnalysisDashboard />;
            default:
                return <Dashboard setView={setCurrentView} />;
        }
    };

    return (
        <div className="flex h-screen font-sans text-slate-800">
            <Sidebar currentView={currentView} setView={setCurrentView} onLogout={handleLogout} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header user={user} onLogout={handleLogout} />
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default App;
