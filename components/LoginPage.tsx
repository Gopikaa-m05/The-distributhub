import React, { useState } from 'react';
// FIX: Changed firebase import path to use scoped package for compatibility.
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    AuthError,
    sendEmailVerification
} from '@firebase/auth';
import { auth } from '../firebaseConfig';
import { UserIcon, LockClosedIcon, CpuChipIcon, GoogleIcon, EyeIcon, EyeSlashIcon } from './icons/Icons';

const LoginPage: React.FC = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const getFirebaseErrorMessage = (errorCode: string): string => {
        switch (errorCode) {
            case 'auth/invalid-email':
                return 'Please enter a valid email address.';
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                return 'Invalid email or password.';
            case 'auth/email-already-in-use':
                return 'An account already exists with this email address.';
            case 'auth/weak-password':
                return 'Password should be at least 6 characters.';
            case 'auth/popup-closed-by-user':
                return 'The sign-in process was cancelled.';
            default:
                return 'An unexpected error occurred. Please try again.';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        if (!isLoginView && password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            if (isLoginView) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await sendEmailVerification(userCredential.user);
                setSuccessMessage('Account created! Please check your email to verify your account before logging in.');
                setIsLoginView(true); // Switch to login view
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            }
            // onAuthStateChanged in App.tsx will handle the navigation
        } catch (err) {
            const authError = err as AuthError;
            setError(getFirebaseErrorMessage(authError.code));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        setError('');
        setSuccessMessage('');
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
             // onAuthStateChanged in App.tsx will handle the navigation
        } catch (err) {
            const authError = err as AuthError;
            setError(getFirebaseErrorMessage(authError.code));
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-green-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <div className="flex justify-center items-center mb-4">
                        <CpuChipIcon className="w-12 h-12 text-blue-600" />
                        <h1 className="text-3xl font-bold text-slate-800 ml-2">Distributor AI</h1>
                    </div>
                    <p className="text-slate-500">Welcome! Please log in or sign up to continue.</p>
                </div>

                {successMessage && <p className="text-sm text-green-600 bg-green-50 p-3 rounded-lg text-center">{successMessage}</p>}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="relative">
                        <UserIcon className="w-5 h-5 text-slate-400 absolute top-3.5 left-4" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full pl-12 pr-4 py-3 text-slate-700 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="relative">
                        <LockClosedIcon className="w-5 h-5 text-slate-400 absolute top-3.5 left-4" />
                         <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full pl-12 pr-12 py-3 text-slate-700 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-3.5 right-4 text-slate-400 hover:text-slate-600"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="w-5 h-5" />
                            ) : (
                                <EyeIcon className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    {!isLoginView && (
                        <div className="relative">
                            <LockClosedIcon className="w-5 h-5 text-slate-400 absolute top-3.5 left-4" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full pl-12 pr-12 py-3 text-slate-700 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute top-3.5 right-4 text-slate-400 hover:text-slate-600"
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? (
                                    <EyeSlashIcon className="w-5 h-5" />
                                ) : (
                                    <EyeIcon className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    )}

                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                    <div>
                        <button type="submit" disabled={loading} className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-slate-400">
                            {loading ? 'Processing...' : (isLoginView ? 'Login' : 'Create Account')}
                        </button>
                    </div>
                </form>

                <div className="relative flex items-center">
                    <div className="flex-grow border-t border-slate-300"></div>
                    <span className="flex-shrink mx-4 text-slate-400 text-sm">OR</span>
                    <div className="flex-grow border-t border-slate-300"></div>
                </div>

                <div>
                    <button
                        type="button"
                        onClick={handleGoogleAuth}
                        disabled={loading}
                        className="w-full flex justify-center items-center py-3 px-4 border border-slate-300 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                    >
                        <GoogleIcon className="w-5 h-5 mr-3" />
                        {isLoginView ? 'Sign in with Google' : 'Sign up with Google'}
                    </button>
                </div>
                
                <div className="text-sm text-center text-slate-500">
                    {isLoginView ? (
                        <span>
                            Don't have an account?{' '}
                            <button type="button" onClick={() => { setIsLoginView(false); setError(''); setSuccessMessage(''); }} className="font-semibold text-blue-600 hover:underline">
                                Sign Up
                            </button>
                        </span>
                    ) : (
                        <span>
                            Already have an account?{' '}
                            <button type="button" onClick={() => { setIsLoginView(true); setError(''); setSuccessMessage(''); }} className="font-semibold text-blue-600 hover:underline">
                                Login
                            </button>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
