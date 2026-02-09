import React, { useState } from 'react';
import { Button } from './Button';
import { User } from '../types';
import { authService } from '../services/authService';
import { Mail, Lock, AlertCircle, Phone, User as UserIcon } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

type AuthView = 'login' | 'register';

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let user;
      if (view === 'login') {
        user = await authService.login(email, password);
      } else {
        user = await authService.register(email, password, name);
      }
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
        await authService.loginWithGoogle();
        // Redirect happens automatically if successful, no need to stop loading
    } catch (err: any) {
        setError(err.message || 'Google login failed');
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl space-y-8 animate-in zoom-in duration-300">
        
        <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">PennyWise AI</h1>
            <p className="text-gray-500 mt-2">
                {view === 'register' ? "Create your account" : "Welcome back"}
            </p>
        </div>

        {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={16} />
            {error}
        </div>
        )}

        <div className="space-y-4">
            <button 
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className={`w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
                ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                )}
                Continue with Google
            </button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                </div>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
                {view === 'register' && (
                     <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full Name"
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                    </div>
                )}
                
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                </div>

                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        minLength={6}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                </div>

                <Button type="submit" fullWidth loading={loading}>
                    {view === 'register' ? 'Sign Up' : 'Sign In'}
                </Button>
            </form>
        </div>

        <div className="text-center text-sm">
            <span className="text-gray-500">
                {view === 'register' ? "Already have an account?" : "Don't have an account yet?"}
            </span>
            <button 
                onClick={() => {
                    setView(view === 'register' ? 'login' : 'register');
                    setError(null);
                }}
                className="ml-2 font-semibold text-indigo-600 hover:text-indigo-800"
            >
                {view === 'register' ? 'Sign In' : 'Sign Up'}
            </button>
        </div>

      </div>
    </div>
  );
};