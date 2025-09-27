

import React, { useState, useMemo } from 'react';
import type { RenewalItem } from '../types';
import { BellAlertIcon } from './icons/Icons';

// Mock Data
const createMockData = (): RenewalItem[] => {
    const today = new Date();
    return [
        { id: 1, name: 'Software License - Alpha', customer: 'Global Tech', renewalDate: new Date(new Date().setDate(today.getDate() + 5)) },
        { id: 2, name: 'Service Contract - Tier 2', customer: 'Innovate LLC', renewalDate: new Date(new Date().setDate(today.getDate() + 12)) },
        { id: 3, name: 'Hardware Warranty - X-100', customer: 'Quantum Dynamics', renewalDate: new Date(new Date().setDate(today.getDate() + 25)) },
        { id: 4, name: 'Cloud Subscription - Pro', customer: 'Stellar Solutions', renewalDate: new Date(new Date().setDate(today.getDate() + 6)) },
        { id: 5, name: 'Support Agreement', customer: 'Pioneer Corp', renewalDate: new Date(new Date().setDate(today.getDate() + 29)) },
        { id: 6, name: 'Domain Registration', customer: 'Innovate LLC', renewalDate: new Date(new Date().setDate(today.getDate() + 14)) },
        { id: 7, name: 'Product Subscription', customer: 'Global Tech', renewalDate: new Date(new Date().setDate(today.getDate() + 45)) },
    ];
};

const RenewalCard: React.FC<{ item: RenewalItem, daysLeft: number }> = ({ item, daysLeft }) => {
    const urgencyColor = daysLeft <= 7 ? 'bg-red-100 border-red-300' : daysLeft <= 15 ? 'bg-yellow-100 border-yellow-300' : 'bg-blue-100 border-blue-300';
    return (
        <div className={`p-3 rounded-lg border ${urgencyColor} mb-2`}>
            <p className="font-semibold text-slate-800">{item.name}</p>
            <p className="text-sm text-slate-600">Customer: {item.customer}</p>
            <p className="text-sm text-slate-600">Date: {item.renewalDate.toLocaleDateString()}</p>
            <p className="text-sm font-bold text-slate-700 mt-1">{daysLeft} days left</p>
        </div>
    )
};

const RenewalReminderBotDashboard: React.FC = () => {
    const [renewals, setRenewals] = useState<RenewalItem[]>(createMockData());
    const [newRenewal, setNewRenewal] = useState({
        customer: '',
        name: '',
        renewalDate: '',
    });
    const [isDateFocused, setIsDateFocused] = useState(false);

    const handleAddRenewal = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRenewal.customer || !newRenewal.name || !newRenewal.renewalDate) {
            // Basic validation
            return;
        }
        
        const [year, month, day] = newRenewal.renewalDate.split('-').map(s => parseInt(s, 10));
        const renewalDate = new Date(year, month - 1, day);

        const newItem: RenewalItem = {
            id: Date.now(),
            name: newRenewal.name,
            customer: newRenewal.customer,
            renewalDate: renewalDate,
        };

        setRenewals(prev => [...prev, newItem].sort((a, b) => a.renewalDate.getTime() - b.renewalDate.getTime()));
        
        // Reset form
        setNewRenewal({ customer: '', name: '', renewalDate: '' });
    };

    const categorizedRenewals = useMemo(() => {
        const today = new Date();

        const dateDiffInDays = (d1: Date, d2: Date) => {
            const MS_PER_DAY = 1000 * 60 * 60 * 24;
            // Discard the time and time-zone information.
            const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
            const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());

            return Math.floor((utc2 - utc1) / MS_PER_DAY);
        };

        const upcoming = renewals
            .map(item => ({ item, days: dateDiffInDays(today, item.renewalDate) }))
            .filter(r => r.days >= 0);

        return {
            sevenDays: upcoming.filter(r => r.days <= 7).sort((a,b) => a.days - b.days),
            fifteenDays: upcoming.filter(r => r.days > 7 && r.days <= 15).sort((a,b) => a.days - b.days),
            thirtyDays: upcoming.filter(r => r.days > 15 && r.days <= 30).sort((a,b) => a.days - b.days),
        };
    }, [renewals]);

    return (
        <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-1">Renewal Reminder Bot</h2>
            <p className="text-slate-600 mb-6">Automatically track and get notified about upcoming renewals.</p>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-red-600">
                    <BellAlertIcon className="w-6 h-6 mr-2" />
                    Urgent Alerts (Next 7 Days)
                </h3>
                {categorizedRenewals.sevenDays.length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categorizedRenewals.sevenDays.map(r => <RenewalCard key={r.item.id} item={r.item} daysLeft={r.days} />)}
                     </div>
                ) : (
                    <p className="text-slate-500">No renewals due in the next 7 days.</p>
                )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 text-yellow-600">Due in 8-15 Days</h3>
                    {categorizedRenewals.fifteenDays.length > 0 ? (
                        categorizedRenewals.fifteenDays.map(r => <RenewalCard key={r.item.id} item={r.item} daysLeft={r.days} />)
                    ) : (
                        <p className="text-slate-500">No renewals in this period.</p>
                    )}
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 text-blue-600">Due in 16-30 Days</h3>
                    {categorizedRenewals.thirtyDays.length > 0 ? (
                        categorizedRenewals.thirtyDays.map(r => <RenewalCard key={r.item.id} item={r.item} daysLeft={r.days} />)
                    ) : (
                        <p className="text-slate-500">No renewals in this period.</p>
                    )}
                </div>
                 <div className="bg-gray-50 p-6 rounded-lg border border-dashed">
                    <h3 className="text-lg font-semibold mb-4 text-slate-700">Add New Renewal</h3>
                    <form onSubmit={handleAddRenewal} className="space-y-4">
                        <div>
                            <label htmlFor="company-name" className="block text-sm font-medium text-slate-600">Company Name</label>
                            <input
                                id="company-name"
                                type="text"
                                value={newRenewal.customer}
                                onChange={(e) => setNewRenewal({...newRenewal, customer: e.target.value})}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., Global Tech"
                                required
                            />
                        </div>
                         <div>
                            <label htmlFor="product-service" className="block text-sm font-medium text-slate-600">Product/Service</label>
                            <input
                                id="product-service"
                                type="text"
                                value={newRenewal.name}
                                onChange={(e) => setNewRenewal({...newRenewal, name: e.target.value})}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., Software License"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="renewal-date" className="block text-sm font-medium text-slate-600">Renewal Date</label>
                            <input
                                id="renewal-date"
                                type={isDateFocused || newRenewal.renewalDate ? 'date' : 'text'}
                                onFocus={() => setIsDateFocused(true)}
                                onBlur={() => setIsDateFocused(false)}
                                value={newRenewal.renewalDate}
                                onChange={(e) => setNewRenewal({...newRenewal, renewalDate: e.target.value})}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Select a date"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition-colors">
                            Add Contract
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RenewalReminderBotDashboard;