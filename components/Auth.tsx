
import React, { useState } from 'react';
import { db } from '../utils/db';
import { User } from '../types';
import { Cake, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
  isNeon?: boolean;
}

const Auth: React.FC<AuthProps> = ({ onLogin, isNeon }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const user = db.login(email, password);
        onLogin(user);
      } else {
        const user = db.signup(name, email, password);
        onLogin(user);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-all-500 ${isNeon ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Decorative Orbs */}
      <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] transition-all-500 ${isNeon ? 'bg-indigo-900/20' : 'bg-indigo-200/40'}`}></div>
      <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] transition-all-500 ${isNeon ? 'bg-rose-900/20' : 'bg-rose-200/40'}`}></div>

      <div className="w-full max-w-md z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-10">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-[2rem] text-white shadow-2xl transition-all-500 animate-float ${isNeon ? 'bg-indigo-500 shadow-indigo-500/30' : 'bg-indigo-600 shadow-indigo-200'} mb-6`}>
            <Cake size={38} />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            AIM <span className="text-indigo-600">Birthday Calendar</span>
          </h1>
          <p className={`${isNeon ? 'text-slate-400' : 'text-slate-500'} font-medium`}>Every celebration, perfectly tracked.</p>
        </div>

        <div className={`backdrop-blur-xl border rounded-[3rem] shadow-2xl p-8 md:p-10 transition-all-500 ${isNeon ? 'bg-slate-900/60 border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)]' : 'bg-white/80 border-white'}`}>
          <div className={`flex p-1.5 rounded-2xl mb-8 transition-colors ${isNeon ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${isLogin ? (isNeon ? 'bg-indigo-500 text-white' : 'bg-white shadow-sm text-indigo-600') : 'text-slate-500'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${!isLogin ? (isNeon ? 'bg-indigo-500 text-white' : 'bg-white shadow-sm text-indigo-600') : 'text-slate-500'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-black uppercase tracking-widest rounded-xl text-center animate-in shake-in duration-300">
                {error}
              </div>
            )}

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    required type="text" placeholder="Alex Johnson" value={name} onChange={(e) => setName(e.target.value)}
                    className={`w-full pl-14 pr-4 py-4 border rounded-2xl outline-none transition-all-500 ${isNeon ? 'bg-slate-800/50 border-transparent focus:border-indigo-500' : 'bg-slate-100 border-transparent focus:bg-white focus:border-indigo-400'}`}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  required type="email" placeholder="alex@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-14 pr-4 py-4 border rounded-2xl outline-none transition-all-500 ${isNeon ? 'bg-slate-800/50 border-transparent focus:border-indigo-500' : 'bg-slate-100 border-transparent focus:bg-white focus:border-indigo-400'}`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  required type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-14 pr-4 py-4 border rounded-2xl outline-none transition-all-500 ${isNeon ? 'bg-slate-800/50 border-transparent focus:border-indigo-500' : 'bg-slate-100 border-transparent focus:bg-white focus:border-indigo-400'}`}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit"
              className={`w-full font-black uppercase tracking-widest py-5 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-4 ${isNeon ? 'bg-indigo-500 hover:bg-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.5)]' : 'bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100'} text-white`}
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
