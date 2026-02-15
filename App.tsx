
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

  // Initialize Auth & Theme
  useEffect(() => {
    try {
      const session = db.getSession();
      if (session) setUser(session);
      
      const savedTheme = localStorage.getItem('aim_theme');
      if (savedTheme === 'neon') setIsNeon(true);
    } catch (e) {
      console.error("Auth init error:", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('aim_theme', isNeon ? 'neon' : 'standard');
    if (isNeon) {
      document.body.classList.add('bg-slate-950');
      document.body.classList.remove('bg-[#f8faff]');
    } else {
      document.body.classList.add('bg-[#f8faff]');
      document.body.classList.remove('bg-slate-950');
    }
  }, [isNeon]);

  // Load birthdays
  useEffect(() => {
    if (user) {
      setBirthdays(db.getBirthdays(user.id));
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

    // Strict validation to ensure year is strictly 4 characters
    const yearPart = newDate.split('-')[0];
    if (yearPart.length > 4) {
      alert("Please enter a valid year with only 4 digits.");
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
    if (window.confirm('Remove this celebration from your list?')) {
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
      <div className={`min-h-screen transition-all-500 ${isNeon ? 'bg-slate-950' : 'bg-[#fff5f5]'}`}>
        <WishMaker birthday={selectedBirthday} onBack={() => setView('dashboard')} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-20 transition-all-500 relative ${isNeon ? 'bg-slate-950 text-slate-100' : 'text-slate-900'}`}>
      {/* Background Gradients for Celebration Theme */}
      {!isNeon && (
        <div className="fixed inset-0 pointer-events-none opacity-40 z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-pink-100 rounded-full blur-[100px] -translate-x-1/3"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-yellow-50 rounded-full blur-[100px] translate-y-1/2"></div>
        </div>
      )}

      {/* Header */}
      <header className={`sticky top-0 z-30 px-4 py-5 border-b transition-all-500 ${isNeon ? 'bg-slate-900/80 border-slate-800 backdrop-blur-md' : 'bg-white/70 border-slate-100 backdrop-blur-md'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('dashboard')}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all duration-500 transform group-hover:rotate-[360deg] ${isNeon ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20' : 'bg-gradient-to-br from-indigo-600 to-indigo-400 shadow-xl shadow-indigo-100'} group-hover:scale-110`}>
              <Cake size={28} />
            </div>
            <h1 className="text-2xl font-black tracking-tight flex flex-col leading-none">
              <span className="text-[10px] uppercase tracking-[0.3em] text-indigo-500 mb-1 font-black">Party Planner</span>
              <span className="flex items-center gap-2">
                AIM <span className="text-indigo-600">Birthday</span>
              </span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsNeon(!isNeon)}
              className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-110 active:scale-90 ${isNeon ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-lg' : 'bg-white text-slate-600 border border-slate-200 shadow-md'}`}
            >
              {isNeon ? <Sun size={20} /> : <Zap size={20} />}
            </button>
            
            <button 
              onClick={() => setShowAddModal(true)}
              className={`font-black py-2.5 px-8 rounded-2xl transition-all flex items-center gap-2 active:scale-95 ${isNeon ? 'bg-indigo-500 hover:bg-indigo-400 shadow-lg shadow-indigo-500/20' : 'bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200'} text-white uppercase tracking-widest text-xs`}
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Add New</span>
            </button>

            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
              <LogOut size={22} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h2 className="text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
              <Sparkles className="text-yellow-400" size={32} /> Celebrations
            </h2>
            <p className="text-slate-500 font-bold text-lg">You have <span className="text-indigo-600">{birthdays.length}</span> special dates tracked.</p>
          </div>
          
          <div className={`flex p-1.5 rounded-3xl border transition-all-500 ${isNeon ? 'bg-slate-900 border-slate-800 shadow-2xl' : 'bg-white border-slate-200 shadow-lg'}`}>
            <button 
              onClick={() => setDashboardMode('list')}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${dashboardMode === 'list' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <List size={18} /> List
            </button>
            <button 
              onClick={() => setDashboardMode('calendar')}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${dashboardMode === 'calendar' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <Calendar size={18} /> Grid
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col gap-8 mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={22} />
              <input 
                type="text" 
                placeholder="Find a friend..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-14 pr-6 py-5 border rounded-3xl outline-none transition-all-500 font-bold ${isNeon ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 focus:border-indigo-400 shadow-xl shadow-indigo-100/10'}`}
              />
            </div>
            
            <div className={`flex p-1.5 rounded-3xl border transition-all-500 ${isNeon ? 'bg-slate-900 border-slate-800 shadow-2xl' : 'bg-white border-slate-200 shadow-lg'}`}>
              <button 
                onClick={() => setSortBy('chronological')}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === 'chronological' ? (isNeon ? 'bg-white text-slate-900' : 'bg-slate-800 text-white') : 'text-slate-400 hover:bg-slate-50'}`}
              >
                <ArrowDownWideNarrow size={16} /> Time
              </button>
              <button 
                onClick={() => setSortBy('closest')}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === 'closest' ? (isNeon ? 'bg-white text-slate-900' : 'bg-slate-800 text-white') : 'text-slate-400 hover:bg-slate-50'}`}
              >
                <Clock size={16} /> Soon
              </button>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-2">
            {['All', 'Family', 'Friend', 'Work', 'Other'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border-2 ${
                  activeCategory === cat 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-200 scale-105' 
                  : 'bg-white text-slate-500 border-slate-100 hover:border-indigo-200 shadow-sm'
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
            <div className={`w-32 h-32 rounded-[3rem] flex items-center justify-center mb-8 bg-white text-indigo-100 border-4 border-indigo-50 shadow-2xl transform rotate-12`}>
              <PartyPopper size={64} />
            </div>
            <h3 className="text-3xl font-black mb-2 italic">Nothing to celebrate yet?</h3>
            <p className="text-slate-400 font-bold max-w-xs mx-auto text-lg">Tap the "Add" button to invite someone to your party list!</p>
          </div>
        )}
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className={`w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden bg-white border-8 border-indigo-50`}>
            <div className={`p-10 border-b flex justify-between items-center border-indigo-50`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Gift size={24} />
                </div>
                <h2 className="text-3xl font-black tracking-tight text-slate-800">Add Birthday</h2>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className={`p-2 rounded-full hover:bg-indigo-50 text-slate-400 transition-colors`}
              >
                <X size={28} />
              </button>
            </div>
            
            <form onSubmit={handleAddBirthday} className="p-10 space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] px-1">Name of Celebrant</label>
                <input 
                  autoFocus required type="text" 
                  value={newName} onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Grandma Rose"
                  className={`w-full px-7 py-5 border-2 border-indigo-50 rounded-[2rem] outline-none focus:border-indigo-500 focus:bg-white bg-indigo-50/30 transition-all font-bold text-lg`}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] px-1">Birthday Date</label>
                  <input 
                    required type="date" value={newDate} 
                    max="9999-12-31" // Restrict year to 4 characters in the UI
                    onChange={(e) => {
                      const val = e.target.value;
                      // Block manual input of year > 4 chars
                      const year = val.split('-')[0];
                      if (year && year.length > 4) return;
                      setNewDate(val);
                    }}
                    className={`w-full px-6 py-5 border-2 border-indigo-50 rounded-[2rem] outline-none focus:border-indigo-500 bg-indigo-50/30 transition-all font-bold text-slate-700`}
                  />
                  <p className="text-[10px] text-slate-400 text-center font-bold">Limit: 4-digit year</p>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] px-1">Category</label>
                  <select 
                    value={newCategory} onChange={(e) => setNewCategory(e.target.value as any)}
                    className={`w-full px-6 py-5 border-2 border-indigo-50 rounded-[2rem] outline-none focus:border-indigo-500 bg-indigo-50/30 transition-all font-bold text-slate-700 appearance-none`}
                  >
                    <option value="Family">Family</option>
                    <option value="Friend">Friend</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] px-1">Theme Color</label>
                <div className={`grid grid-cols-5 gap-3 p-5 rounded-[2.5rem] bg-indigo-50/30 border-2 border-indigo-50`}>
                  {THEME_COLORS.slice(0, 10).map(color => (
                    <button
                      key={color.name} type="button" title={color.name}
                      onClick={() => setNewColor(color.class)}
                      className={`w-10 h-10 rounded-full transition-all flex items-center justify-center hover:scale-125 active:scale-95 ${color.class} ${
                        newColor === color.class 
                        ? 'ring-4 ring-offset-4 ring-indigo-500 scale-110 shadow-lg' 
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
                  className={`w-full font-black uppercase tracking-[0.3em] text-sm py-6 rounded-[2rem] transition-all transform hover:scale-105 active:scale-95 bg-gradient-to-r from-indigo-600 to-pink-500 shadow-2xl shadow-indigo-200 text-white`}
                >
                  Save Celebration
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
          className={`flex flex-col items-center gap-1.5 transition-all ${view === 'dashboard' && dashboardMode === 'list' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}
        >
          <List size={26} />
          <span className="text-[10px] font-black uppercase tracking-widest">Feed</span>
        </button>
        <button 
          onClick={() => setShowAddModal(true)}
          className={`w-14 h-14 -mt-10 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all transform active:scale-90 bg-indigo-600 shadow-indigo-600/30`}
        >
          <Plus size={32} />
        </button>
        <button 
          onClick={() => { setView('dashboard'); setDashboardMode('calendar'); }}
          className={`flex flex-col items-center gap-1.5 transition-all ${view === 'dashboard' && dashboardMode === 'calendar' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}
        >
          <Calendar size={26} />
          <span className="text-[10px] font-black uppercase tracking-widest">Grid</span>
        </button>
      </nav>
    </div>
  );
};

export default App;