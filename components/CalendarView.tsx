
import React, { useState } from 'react';
import { Birthday } from '../types';
import { ChevronLeft, ChevronRight, Gift } from 'lucide-react';

interface CalendarViewProps {
  birthdays: Birthday[];
  isNeon?: boolean;
  onBirthdayClick: (b: Birthday) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ birthdays, isNeon, onBirthdayClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: firstDayOfMonth(year, month) }, (_, i) => i);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getBirthdaysOnDay = (day: number) => {
    return birthdays.filter(b => {
      const bDate = new Date(b.date);
      return bDate.getMonth() === month && bDate.getDate() === day;
    });
  };

  const isTodayDate = (day: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  return (
    <div className={`rounded-[3rem] shadow-xl border transition-all-500 overflow-hidden ${isNeon ? 'bg-slate-900/60 border-slate-800 backdrop-blur-md' : 'bg-white border-slate-100'}`}>
      <div className={`p-8 border-b flex items-center justify-between transition-all-500 ${isNeon ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50/50 border-slate-50'}`}>
        <h3 className="text-xl font-black tracking-tight">
          {monthNames[month]} <span className="text-indigo-500">{year}</span>
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={prevMonth}
            className={`p-3 rounded-2xl transition-all border shadow-sm active:scale-90 ${isNeon ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-slate-100 text-slate-600 hover:bg-indigo-50'}`}
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextMonth}
            className={`p-3 rounded-2xl transition-all border shadow-sm active:scale-90 ${isNeon ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-slate-100 text-slate-600 hover:bg-indigo-50'}`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-7 border-b transition-all-500 ${isNeon ? 'border-slate-800 bg-slate-900/20' : 'border-slate-50 bg-slate-50/30'}`}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {paddingDays.map(p => (
          <div key={`p-${p}`} className={`aspect-square border-b border-r transition-all-500 ${isNeon ? 'border-slate-800/50 bg-slate-950/20' : 'border-slate-50 bg-slate-50/10'}`}></div>
        ))}
        {days.map(day => {
          const dayBirthdays = getBirthdaysOnDay(day);
          const isToday = isTodayDate(day);
          return (
            <div 
              key={day} 
              className={`aspect-square border-b border-r transition-all duration-300 p-2 relative group hover:z-10 ${
                isNeon 
                ? `border-slate-800 hover:bg-slate-800/40 ${isToday ? 'bg-indigo-500/10' : ''}` 
                : `border-slate-50 hover:bg-indigo-50/30 ${isToday ? 'bg-indigo-50/50' : ''}`
              }`}
            >
              <span className={`text-sm font-black inline-flex items-center justify-center w-8 h-8 rounded-xl transition-all ${
                isToday 
                ? (isNeon ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-indigo-600 text-white shadow-lg') 
                : (isNeon ? 'text-slate-600 group-hover:text-slate-300' : 'text-slate-500')
              }`}>
                {day}
              </span>
              
              <div className="mt-1 flex flex-col gap-1 overflow-hidden">
                {dayBirthdays.map(b => (
                  <button
                    key={b.id}
                    onClick={() => onBirthdayClick(b)}
                    className={`text-[9px] font-black px-2 py-1 rounded-lg truncate text-white shadow-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 ${b.themeColor} ${isNeon ? 'opacity-90 hover:opacity-100' : ''}`}
                    title={`${b.name}'s Birthday`}
                  >
                    <Gift size={10} />
                    <span className="hidden sm:inline">{b.name}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
