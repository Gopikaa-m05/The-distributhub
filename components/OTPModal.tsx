import React, { useState, useRef, useEffect } from 'react';

interface OTPModalProps {
    email: string;
    onClose: () => void;
    onVerified: () => void;
}

const OTPModal: React.FC<OTPModalProps> = ({ email, onClose, onVerified }) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const modalRef = useRef<HTMLDivElement>(null);

    // Mock OTP for demonstration purposes
    const MOCK_OTP = '123456';

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp === MOCK_OTP) {
            setError('');
            onVerified();
        } else {
            setError('Invalid OTP. Please try again.');
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div ref={modalRef} className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full mx-4">
                <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">Verify Your Account</h2>
                <p className="text-slate-500 text-center mb-6">An OTP has been sent to <span className="font-semibold">{email}</span>. (Hint: it's {MOCK_OTP})</p>
                <form onSubmit={handleVerify}>
                    <div className="mb-4">
                        <label htmlFor="otp" className="sr-only">Enter OTP</label>
                        <input
                            id="otp"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            placeholder="------"
                            className="w-full px-4 py-3 text-center tracking-[0.5em] text-lg bg-gray-100 text-slate-800 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                     {error && <p className="text-sm text-red-600 text-center mb-4">{error}</p>}
                    <button type="submit" className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                        Verify
                    </button>
                    <button type="button" onClick={onClose} className="w-full mt-2 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800">
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OTPModal;