
import React from 'react';
import { Birthday } from '../types';
import { calculateDaysUntil, formatBirthday, isToday, getAge } from '../utils/dateUtils';
import { Calendar, Gift, ChevronRight, Cake, Trash2, PartyPopper } from 'lucide-react';
import { THEME_COLORS } from '../constants';

interface BirthdayCardProps {
  birthday: Birthday;
  isNeon?: boolean;
  onClick: (b: Birthday) => void;
  onDelete: (id: string) => void;
}

const BirthdayCard: React.FC<BirthdayCardProps> = ({ birthday, isNeon, onClick, onDelete }) => {
  const daysUntil = calculateDaysUntil(birthday.date);
  const birthdayIsToday = isToday(birthday.date);
  const turningAge = getAge(birthday.date);
  
  const themeHex = THEME_COLORS.find(c => c.class === birthday.themeColor)?.hex || '#6366f1';
  
  // Convert hex to RGB components for CSS variables
  const r = parseInt(themeHex.slice(1, 3), 16);
  const g = parseInt(themeHex.slice(3, 5), 16);
  const b = parseInt(themeHex.slice(5, 7), 16);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(birthday.id);
  };

  return (
    <div 
      onClick={() => onClick(birthday)}
      style={{ '--glow-color': `${r}, ${g}, ${b}` } as React.CSSProperties}
      className={`group relative rounded-[2.5rem] p-7 border transition-all duration-500 cursor-pointer overflow-hidden transform hover:-rotate-1 active:scale-95 ${
        isNeon 
        ? 'bg-slate-900/60 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/90 neon-glow backdrop-blur-md' 
        : 'bg-white border-white shadow-xl shadow-indigo-100/10 hover:shadow-2xl hover:shadow-indigo-200/40 hover:-translate-y-2'
      }`}
    >
      {/* Dynamic Theme Glow Background */}
      <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 opacity-10 rounded-full transition-all duration-700 group-hover:scale-150 group-hover:opacity-30 ${birthday.themeColor}`}></div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white transition-all duration-500 shadow-xl ${birthday.themeColor} ${isNeon ? 'shadow-[0_0_20px_rgba(var(--glow-color),0.6)]' : ''} group-hover:scale-110 group-hover:rotate-12`}>
          {birthdayIsToday ? <PartyPopper size={28} /> : <Gift size={28} />}
        </div>
        
        <div className="flex items-center gap-2">
          {birthdayIsToday && (
            <span className={`text-[10px] font-black px-4 py-1.5 rounded-full animate-pulse tracking-[0.2em] uppercase ${isNeon ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-rose-100 text-rose-600'}`}>
              Celebration 🎉
            </span>
          )}
          <button 
            onClick={handleDelete}
            className={`p-2.5 rounded-xl transition-all duration-300 ${isNeon ? 'text-slate-600 hover:text-rose-400 hover:bg-rose-400/10' : 'text-slate-300 hover:text-rose-500 hover:bg-rose-50 shadow-sm'}`}
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-1 relative z-10">
        <h3 className={`text-2xl font-black tracking-tight transition-colors duration-300 ${isNeon ? 'text-slate-100 group-hover:text-white' : 'text-slate-800 group-hover:text-indigo-600'}`}>
          {birthday.name}
        </h3>
        <p className={`text-sm font-bold transition-colors duration-300 ${isNeon ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-500'}`}>
          {birthday.category} • <span className={`font-black ${isNeon ? 'text-indigo-400' : 'text-indigo-600'}`}>Turning {turningAge}</span>
        </p>
      </div>

      <div className="mt-8 flex items-center justify-between relative z-10">
        <div className="flex flex-col">
          <span className={`text-4xl font-black leading-none ${isNeon ? 'text-white' : 'text-slate-900'} tracking-tighter`}>
            {birthdayIsToday ? "0" : daysUntil}
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mt-1.5">
            {daysUntil === 1 ? 'Day to go' : 'Days to go'}
          </span>
        </div>
        <div className="flex items-center gap-3">
           <span className={`text-[10px] font-black flex items-center gap-1.5 px-4 py-2 rounded-2xl transition-all duration-300 ${isNeon ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-slate-50 text-slate-400 shadow-inner'}`}>
            <Calendar size={14} />
            {formatBirthday(birthday.date)}
          </span>
          <div className={`p-2.5 rounded-full transition-all duration-500 ${isNeon ? 'bg-slate-800 text-slate-500 group-hover:bg-indigo-500/20 group-hover:text-indigo-400' : 'bg-slate-50 text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
            <ChevronRight size={22} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirthdayCard;