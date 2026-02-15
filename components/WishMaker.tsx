
import React, { useState, useRef } from 'react';
import { Birthday } from '../types';
import { WISH_TEMPLATES, THEME_COLORS } from '../constants';
// Added Cake to the imports from lucide-react
import { Download, Share2, ArrowLeft, RefreshCw, Type, Palette, Image as ImageIcon, X, Cake } from 'lucide-react';
import confetti from 'https://cdn.skypack.dev/canvas-confetti';

interface WishMakerProps {
  birthday: Birthday;
  onBack: () => void;
}

const WishMaker: React.FC<WishMakerProps> = ({ birthday, onBack }) => {
  const [wishText, setWishText] = useState(WISH_TEMPLATES[0].text);
  const [activeTheme, setActiveTheme] = useState(THEME_COLORS.find(t => t.class === birthday.themeColor) || THEME_COLORS[0]);
  const [fontSize, setFontSize] = useState('text-2xl');
  const [bgImage, setBgImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCelebrate = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: [activeTheme.hex, '#ffffff', '#ffd700']
    });
  };

  const handleRandomWish = () => {
    const random = WISH_TEMPLATES[Math.floor(Math.random() * WISH_TEMPLATES.length)];
    setWishText(random.text);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBgImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBgImage = () => {
    setBgImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Sophisticated gradient generation
  const getCardStyle = () => {
    if (bgImage) {
      return {
        backgroundImage: `
          linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%),
          url(${bgImage})
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    
    // Create a rich multi-stop gradient using the theme color
    return {
      background: `linear-gradient(135deg, 
        ${activeTheme.hex} 0%, 
        color-mix(in srgb, ${activeTheme.hex}, #000 15%) 50%, 
        color-mix(in srgb, ${activeTheme.hex}, #000 30%) 100%
      )`,
    };
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium"
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Preview Card */}
        <div className="sticky top-8">
          <div 
            id="wish-card-preview"
            className="aspect-[4/5] rounded-[3rem] p-10 flex flex-col items-center justify-center text-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] relative overflow-hidden transition-all duration-700 ease-in-out text-white border-4 border-white/20"
            style={getCardStyle()}
          >
            {/* Dynamic Glass Sheen Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none opacity-50"></div>
            
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-black/10 rounded-full blur-3xl"></div>
              
              {!bgImage && (
                <>
                  <div className="absolute top-12 left-12 w-16 h-16 border-2 border-white/20 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-1/4 right-8 w-4 h-4 bg-white/30 rounded-full"></div>
                  <div className="absolute top-1/3 right-12 w-2 h-2 bg-white/40 rounded-full"></div>
                </>
              )}
            </div>

            <div className="z-10 space-y-8">
              <div className="space-y-3">
                <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-2">
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-90 block">Special Edition</span>
                </div>
                <h2 className="text-6xl font-accent leading-none drop-shadow-md">Happy Birthday</h2>
                <h3 className="text-4xl font-black uppercase tracking-tight drop-shadow-lg bg-clip-text text-white">
                  {birthday.name}!
                </h3>
              </div>
              
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto rounded-full"></div>

              <div className="relative group px-6">
                {/* Text High Contrast Wrapper */}
                <p className={`${fontSize} font-bold leading-relaxed italic text-balance drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-all duration-300`}>
                  "{wishText}"
                </p>
              </div>

              <div className="pt-10 space-y-4">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl mx-auto flex items-center justify-center">
                  <Cake size={24} className="text-white" />
                </div>
                <p className="text-[10px] font-black tracking-[0.4em] uppercase opacity-60">AIM CALENDAR • {new Date().getFullYear()}</p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4">
            <div className="flex gap-4">
              <button 
                onClick={handleCelebrate}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                Celebrate 🎉
              </button>
              <button 
                className="flex-1 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold py-4 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                onClick={() => alert('This feature would integrate with a library like html2canvas in a production environment.')}
              >
                <Download size={20} />
                Download Card
              </button>
            </div>
            <button 
              className="w-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold py-4 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              onClick={() => alert('Card link copied to clipboard!')}
            >
              <Share2 size={20} />
              Share with Friends
            </button>
          </div>
        </div>

        {/* Editor Controls */}
        <div className="space-y-10">
          <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Type size={16} className="text-indigo-500" /> Content
              </h4>
              <button 
                onClick={handleRandomWish}
                className="text-indigo-600 text-xs font-black flex items-center gap-1 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all"
              >
                <RefreshCw size={14} /> Refresh
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
              {WISH_TEMPLATES.map(template => (
                <button
                  key={template.id}
                  onClick={() => setWishText(template.text)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all text-sm group ${
                    wishText === template.text 
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900' 
                    : 'border-slate-50 bg-white text-slate-500 hover:border-slate-200'
                  }`}
                >
                  <span className="text-[10px] uppercase font-black text-slate-400 block mb-2 group-hover:text-indigo-400 transition-colors">{template.category}</span>
                  <span className="font-medium leading-relaxed">{template.text}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
              <ImageIcon size={16} className="text-indigo-500" /> Background
            </h4>
            <div className="flex items-center gap-4">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-3 px-6 py-5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-slate-500 hover:text-indigo-600 font-bold transition-all"
              >
                <ImageIcon size={20} />
                {bgImage ? 'Update Background' : 'Upload Image'}
              </button>
              {bgImage && (
                <button 
                  onClick={removeBgImage}
                  className="p-5 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 hover:bg-rose-100 transition-all active:scale-95"
                  title="Remove Image"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
              <Palette size={16} className="text-indigo-500" /> Theme Palette
            </h4>
            <div className="grid grid-cols-5 gap-3">
              {THEME_COLORS.map(color => (
                <button
                  key={color.name}
                  onClick={() => setActiveTheme(color)}
                  className={`w-full aspect-square rounded-2xl transition-all flex items-center justify-center ${color.class} ${
                    activeTheme.name === color.name 
                    ? 'ring-4 ring-offset-2 ring-indigo-500 scale-105 shadow-lg' 
                    : 'opacity-80 hover:opacity-100 hover:scale-105 active:scale-95'
                  }`}
                  title={color.name}
                >
                   {activeTheme.name === color.name && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
              Typography Size
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {['text-lg', 'text-xl', 'text-2xl', 'text-3xl'].map(size => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`px-4 py-4 rounded-2xl border-2 font-black text-[10px] uppercase transition-all ${
                    fontSize === size 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105' 
                    : 'bg-white text-slate-400 border-slate-50 hover:border-slate-200'
                  }`}
                >
                  {size.split('-')[1]}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default WishMaker;
