
import React, { useState, useEffect, useMemo } from 'react';
import { Birthday, ViewState, User } from './types';
import { THEME_COLORS } from './constants';
import BirthdayCard from './components/BirthdayCard';
import WishMaker from './components/WishMaker';
import CalendarView from './components/CalendarView';
import Auth from './components/Auth';
import { db } from './utils/db';
import { calculateDaysUntil } from './utils/dateUtils';
import { Plus, Search, Calendar, Cake, X, Gift, LogOut, User as UserIcon, Check, List, ArrowDownWideNarrow, Clock, Zap, Sun, Sparkles, PartyPopper } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [view, setView] = useState<ViewState>('dashboard');
  const [dashboardMode, setDashboardMode] = useState<'list' | 'calendar'>('list');
  const [sortBy, setSortBy] = useState<'chronological' | 'closest'>('chronological');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedBirthday, setSelectedBirthday] = useState<Birthday | null>(null);
  const [isNeon, setIsNeon] = useState(false);
  
  // Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newCategory, setNewCategory] = useState<Birthday['category']>('Friend');
  const [newColor, setNewColor] = useState(THEME_COLORS[0].class);

  // Auth initialization
  useEffect(() => {
    const session = db.getSession();
    if (session) {
      setUser(session);
    }
    const savedTheme = localStorage.getItem('aim_theme');
    if (savedTheme === 'neon') setIsNeon(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('aim_theme', isNeon ? 'neon' : 'standard');
    if (isNeon) {
      document.body.classList.add('bg-slate-950');
      document.body.classList.remove('bg-slate-50');
    } else {
      document.body.classList.add('bg-slate-50');
      document.body.classList.remove('bg-slate-950');
    }
  }, [isNeon]);

  useEffect(() => {
    if (user) {
      const data = db.getBirthdays(user.id);
      setBirthdays(data);
    } else {
      setBirthdays([]);
    }
  }, [user]);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    db.setSession(newUser);
  };

  const handleLogout = () => {
    setUser(null);
    db.setSession(null);
    setView('dashboard');
  };

  const filteredBirthdays = useMemo(() => {
    return birthdays
      .filter(b => {
        const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || b.category === activeCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'closest') {
          return calculateDaysUntil(a.date) - calculateDaysUntil(b.date);
        } else {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getMonth() - dateB.getMonth() || dateA.getDate() - dateB.getDate();
        }
      });
  }, [birthdays, searchQuery, activeCategory, sortBy]);

  const handleAddBirthday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDate || !user) return;

    // Strict validation to ensure year is exactly 4 characters
    const year = new Date(newDate).getFullYear();
    if (year > 9999 || year < 100) {
      alert("Please enter a valid year (YYYY).");
      return;
    }

    const newEntry: Birthday = {
      id: Date.now().toString(),
      userId: user.id,
      name: newName,
      date: newDate,
      category: newCategory,
      themeColor: newColor
    };

    db.saveBirthday(newEntry);
    setBirthdays(prev => [...prev, newEntry]);
    setShowAddModal(false);
    resetForm();
  };

  const handleDeleteBirthday = (id: string) => {
    if (window.confirm('Are you sure you want to remove this birthday?')) {
      db.deleteBirthday(id);
      setBirthdays(prev => prev.filter(b => b.id !== id));
    }
  };

  const resetForm = () => {
    setNewName('');
    setNewDate('');
    setNewCategory('Friend');
    setNewColor(THEME_COLORS[0].class);
  };

  if (!user) {
    return <Auth onLogin={handleLogin} isNeon={isNeon} />;
  }

  if (view === 'wish-maker' && selectedBirthday) {
    return (
      <div className={`min-h-screen ${isNeon ? 'bg-slate-950' : 'bg-[#fff5f5]'} transition-all-500`}>
        <WishMaker birthday={selectedBirthday} onBack={() => setView('dashboard')} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-20 transition-all-500 relative ${isNeon ? 'bg-slate-950 text-slate-100' : 'bg-[#f8faff] text-slate-900'}`}>
      {/* Mesh Gradients for Colorful Design */}
      {!isNeon && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
          <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-indigo-200 rounded-full blur-[100px]"></div>
          <div className="absolute top-1/2 -left-20 w-[600px] h-[600px] bg-pink-200 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-20 right-1/4 w-[600px] h-[600px] bg-yellow-100 rounded-full blur-[100px]"></div>
        </div>
      )}

      {/* Header */}
      <header className={`sticky top-0 z-30 px-4 py-5 border-b transition-all-500 ${isNeon ? 'bg-slate-900/80 border-slate-800 backdrop-blur-md' : 'bg-white/80 border-slate-100 backdrop-blur-md'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('dashboard')}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all duration-500 transform group-hover:rotate-[360deg] ${isNeon ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg' : 'bg-gradient-to-br from-indigo-600 to-indigo-400 shadow-xl shadow-indigo-200'} group-hover:scale-110`}>
              <Cake size={28} />
            </div>
            <h1 className="text-2xl font-black tracking-tight flex flex-col leading-none">
              <span className="text-[10px] uppercase tracking-[0.3em] opacity-50 mb-1">Joyful Tracker</span>
              <span className="flex items-center gap-2">
                AIM <span className="text-indigo-600">Birthday</span>
              </span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsNeon(!isNeon)}
              className={`p-2.5 rounded-xl transition-all duration-300 active:scale-90 ${isNeon ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-slate-100 text-slate-600 border border-slate-200 shadow-inner'}`}
              title="Toggle Party Mode"
            >
              {isNeon ? <Sun size={20} /> : <Zap size={20} />}
            </button>

            <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full border transition-all-500 ${isNeon ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isNeon ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                <UserIcon size={14} />
              </div>
              <span className="text-sm font-black">Hi, {user.name.split(' ')[0]}</span>
            </div>
            
            <button 
              onClick={() => setShowAddModal(true)}
              className={`font-black py-2.5 px-8 rounded-2xl transition-all flex items-center gap-2 active:scale-95 ${isNeon ? 'bg-indigo-500 hover:bg-indigo-400 shadow-lg' : 'bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100'} text-white uppercase tracking-widest text-xs`}
            >
              <Plus size={20} />
              <span>Add</span>
            </button>
            <button 
              onClick={handleLogout}
              className={`p-2 transition-all hover:scale-110 ${isNeon ? 'text-slate-500 hover:text-rose-400' : 'text-slate-400 hover:text-rose-500'}`}
              title="Logout"
            >
              <LogOut size={22} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h2 className="text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
              <Sparkles className="text-yellow-400" size={32} /> My Celebrations
            </h2>
            <p className={`${isNeon ? 'text-slate-400' : 'text-slate-500'} font-bold text-lg`}>You have <span className="text-indigo-600 underline decoration-indigo-200">{birthdays.length}</span> people to celebrate.</p>
          </div>
          
          <div className={`flex p-1.5 rounded-3xl border transition-all-500 ${isNeon ? 'bg-slate-900 border-slate-800 shadow-2xl' : 'bg-white border-slate-100 shadow-lg shadow-indigo-100/30'}`}>
            <button 
              onClick={() => setDashboardMode('list')}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${dashboardMode === 'list' ? (isNeon ? 'bg-indigo-500 text-white shadow-lg' : 'bg-indigo-600 text-white shadow-xl') : 'text-slate-500 hover:bg-slate-800/50'}`}
            >
              <List size={18} /> List
            </button>
            <button 
              onClick={() => setDashboardMode('calendar')}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${dashboardMode === 'calendar' ? (isNeon ? 'bg-indigo-500 text-white shadow-lg' : 'bg-indigo-600 text-white shadow-xl') : 'text-slate-500 hover:bg-slate-800/50'}`}
            >
              <Calendar size={18} /> Calendar
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col gap-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isNeon ? 'text-slate-600 group-focus-within:text-indigo-400' : 'text-slate-400 group-focus-within:text-indigo-600'}`} size={22} />
              <input 
                type="text" 
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-14 pr-6 py-5 border rounded-3xl outline-none transition-all-500 font-bold ${isNeon ? 'bg-slate-900 border-slate-800 text-slate-100 focus:border-indigo-500' : 'bg-white border-slate-100 focus:border-indigo-400 shadow-xl shadow-indigo-100/20'}`}
              />
            </div>
            
            <div className={`flex p-1.5 rounded-3xl border transition-all-500 ${isNeon ? 'bg-slate-900 border-slate-800 shadow-2xl' : 'bg-white border-slate-100 shadow-lg'}`}>
              <button 
                onClick={() => setSortBy('chronological')}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === 'chronological' ? (isNeon ? 'bg-white text-slate-900' : 'bg-slate-800 text-white') : 'text-slate-400 hover:bg-slate-800/30'}`}
              >
                <ArrowDownWideNarrow size={16} /> Month
              </button>
              <button 
                onClick={() => setSortBy('closest')}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === 'closest' ? (isNeon ? 'bg-white text-slate-900' : 'bg-slate-800 text-white') : 'text-slate-400 hover:bg-slate-800/30'}`}
              >
                <Clock size={16} /> Soon
              </button>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {['All', 'Family', 'Friend', 'Work', 'Other'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border-2 ${
                  activeCategory === cat 
                  ? (isNeon ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500 shadow-lg' : 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-200 scale-105') 
                  : (isNeon ? 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300 shadow-sm')
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Content */}
        {filteredBirthdays.length > 0 ? (
          dashboardMode === 'list' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredBirthdays.map((b, idx) => (
                <div key={b.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
                  <BirthdayCard 
                    birthday={b} 
                    isNeon={isNeon}
                    onClick={(birthday) => {
                      setSelectedBirthday(birthday);
                      setView('wish-maker');
                    }}
                    onDelete={handleDeleteBirthday}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="animate-in zoom-in-95 duration-700 shadow-2xl rounded-[3rem] overflow-hidden">
              <CalendarView 
                birthdays={filteredBirthdays} 
                isNeon={isNeon}
                onBirthdayClick={(birthday) => {
                  setSelectedBirthday(birthday);
                  setView('wish-maker');
                }} 
              />
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center animate-float">
            <div className={`w-32 h-32 rounded-[3rem] flex items-center justify-center mb-8 transition-all-500 transform rotate-12 shadow-2xl ${isNeon ? 'bg-slate-900 text-slate-700' : 'bg-white text-slate-200 border-4 border-indigo-50'}`}>
              <Calendar size={64} />
            </div>
            <h3 className="text-3xl font-black mb-2">No birthdays found</h3>
            <p className="text-slate-400 font-bold max-w-xs mx-auto text-lg leading-relaxed">
              Start adding your friends and family to fill this page with colors!
            </p>
          </div>
        )}
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className={`w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 transition-all-500 ${isNeon ? 'bg-slate-900 border-2 border-slate-800' : 'bg-white border-4 border-indigo-50'}`}>
            <div className={`p-10 border-b flex justify-between items-center transition-all-500 ${isNeon ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Gift size={24} />
                </div>
                <h2 className="text-3xl font-black tracking-tight">New Wish</h2>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className={`p-2 rounded-full transition-all hover:scale-110 active:scale-90 ${isNeon ? 'hover:bg-slate-800 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}`}
              >
                <X size={28} />
              </button>
            </div>
            
            <form onSubmit={handleAddBirthday} className="p-10 space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">Full Name</label>
                <input 
                  autoFocus required type="text" 
                  value={newName} onChange={(e) => setNewName(e.target.value)}
                  placeholder="Who are we celebrating?"
                  className={`w-full px-7 py-5 border-2 rounded-[2rem] outline-none transition-all-500 font-bold text-lg ${isNeon ? 'bg-slate-800 border-transparent focus:bg-slate-700 focus:border-indigo-500' : 'bg-slate-50 border-slate-100 focus:bg-white focus:border-indigo-500'}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">Date of Birth</label>
                  <input 
                    required type="date" value={newDate} 
                    max="9999-12-31" // Restrict year to 4 digits at HTML level
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val && val.split('-')[0].length > 4) return; // Block values like 275760
                      setNewDate(val);
                    }}
                    className={`w-full px-6 py-5 border-2 rounded-[2rem] outline-none transition-all-500 font-bold ${isNeon ? 'bg-slate-800 border-transparent text-slate-200' : 'bg-slate-50 border-slate-100 text-slate-700'}`}
                  />
                  <p className="text-[10px] text-slate-400 font-bold text-center">4-digit year limit</p>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">Category</label>
                  <select 
                    value={newCategory} onChange={(e) => setNewCategory(e.target.value as any)}
                    className={`w-full px-6 py-5 border-2 rounded-[2rem] outline-none transition-all-500 appearance-none font-bold ${isNeon ? 'bg-slate-800 border-transparent text-slate-200' : 'bg-slate-50 border-slate-100 text-slate-700'}`}
                  >
                    <option value="Family">Family</option>
                    <option value="Friend">Friend</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">Party Theme Color</label>
                <div className={`grid grid-cols-5 gap-3 p-5 rounded-[2.5rem] border-2 transition-all-500 ${isNeon ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100 shadow-inner'}`}>
                  {THEME_COLORS.slice(0, 10).map(color => (
                    <button
                      key={color.name} type="button" title={color.name}
                      onClick={() => setNewColor(color.class)}
                      className={`w-10 h-10 rounded-full transition-all flex items-center justify-center hover:scale-125 active:scale-95 ${color.class} ${
                        newColor === color.class 
                        ? (isNeon ? 'ring-4 ring-offset-4 ring-offset-slate-900 ring-indigo-500 scale-110 shadow-lg' : 'ring-4 ring-offset-4 ring-indigo-500 scale-110 shadow-lg') 
                        : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      {newColor === color.class && <Check size={18} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className={`w-full font-black uppercase tracking-[0.3em] text-sm py-6 rounded-[2rem] transition-all transform hover:scale-105 active:scale-95 ${isNeon ? 'bg-indigo-500 hover:bg-indigo-400 shadow-lg' : 'bg-indigo-600 hover:bg-indigo-700 shadow-2xl shadow-indigo-200'} text-white`}
                >
                  Create Celebration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer Navigation (Mobile) */}
      <nav className={`fixed bottom-0 left-0 right-0 border-t transition-all-500 md:hidden px-8 py-4 flex justify-around items-center z-40 backdrop-blur-xl ${isNeon ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]'}`}>
        <button 
          onClick={() => { setView('dashboard'); setDashboardMode('list'); }}
          className={`flex flex-col items-center gap-1.5 transition-all ${view === 'dashboard' && dashboardMode === 'list' ? 'text-indigo-500 scale-110' : 'text-slate-400'}`}
        >
          <List size={26} />
          <span className="text-[10px] font-black uppercase tracking-widest">List</span>
        </button>
        <button 
          onClick={() => { setView('dashboard'); setDashboardMode('calendar'); }}
          className={`flex flex-col items-center gap-1.5 transition-all ${view === 'dashboard' && dashboardMode === 'calendar' ? 'text-indigo-500 scale-110' : 'text-slate-400'}`}
        >
          <Calendar size={26} />
          <span className="text-[10px] font-black uppercase tracking-widest">Grid</span>
        </button>
        <button 
          onClick={() => setShowAddModal(true)}
          className={`w-14 h-14 -mt-10 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all transform active:scale-90 ${isNeon ? 'bg-indigo-500 shadow-indigo-500/40' : 'bg-indigo-600 shadow-indigo-600/30'}`}
        >
          <Plus size={32} />
        </button>
      </nav>
    </div>
  );
};

export default App;