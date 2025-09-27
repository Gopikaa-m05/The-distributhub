import React, { useState, useEffect, useRef } from 'react';
// FIX: Changed firebase import path to use scoped package for compatibility.
import { User } from '@firebase/auth';
import { UserIcon, ArrowRightOnRectangleIcon } from './icons/Icons';

interface HeaderProps {
    user: User | null;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const displayName = user?.displayName || user?.email?.split('@')[0];
    const email = user?.email;

    return (
        <header className="bg-white shadow-sm p-4 border-b border-slate-200 flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-700">Distributor Inc.</h1>
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Open user menu"
                    aria-haspopup="true"
                    aria-expanded={isDropdownOpen}
                >
                    <UserIcon className="w-6 h-6 text-slate-600" />
                </button>

                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg overflow-hidden z-10 border border-slate-200">
                        <div className="p-4">
                            <p className="text-sm font-semibold text-slate-800 truncate" title={displayName}>
                                {displayName}
                            </p>
                            <p className="text-xs text-slate-500 truncate" title={email || ''}>
                                {email}
                            </p>
                        </div>
                        <hr className="border-slate-200" />
                        <button
                            onClick={() => {
                                setIsDropdownOpen(false);
                                onLogout();
                            }}
                            className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 flex items-center"
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                            <span>Logout</span>
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
