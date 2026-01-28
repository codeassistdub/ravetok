
import React, { useState, useEffect } from 'react';
import { Shield, ArrowRight, User, Key, Loader2, Info, FastForward, Terminal, Disc } from 'lucide-react';

interface LandingPageProps {
  onLogin: (userData?: any) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [mode, setMode] = useState<'welcome' | 'signup' | 'login' | 'admin'>('welcome');
  const [formData, setFormData] = useState({ alias: '', pass: '' });
  const [statusMessage, setStatusMessage] = useState('Standby');

  const handleDemoLogin = () => {
    setIsLoggingIn(true);
    setStatusMessage("Establishing Demo Link...");
    setTimeout(() => {
      onLogin({ 
        id: 'guest_' + Math.random().toString(36).substr(2, 9),
        username: 'guest_raver',
        displayName: 'Guest Raver',
        avatar: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb1?w=200&h=200&fit=crop',
        role: 'raver',
        followers: 0,
        following: 0,
        isNewUser: false
      });
    }, 1000);
  };

  const handleCreateIdentity = () => {
    onLogin({ isNewUser: true });
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate credentials
    if (formData.alias.toLowerCase() === 'ravetok' && formData.pass === 'admin') {
      setIsLoggingIn(true);
      setStatusMessage("Verifying Resident Credentials...");
      
      // Simulate secure link establishment
      setTimeout(() => {
        onLogin({ 
          id: 'admin_01',
          username: 'ravetok', 
          displayName: 'Master Resident', 
          avatar: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200&h=200&fit=crop',
          role: 'resident', 
          followers: 12400, 
          following: 0,
          isNewUser: false 
        });
      }, 1200);
    } else {
      alert("UNAUTHORIZED: Resident credentials invalid or link refused.");
    }
  };

  return (
    <div className="fixed inset-0 z-[500] bg-black overflow-hidden flex flex-col items-center justify-center p-8">
      {/* Visual Background */}
      <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2FwMHp4NHB4NHB4NHB4NHB4NHB4NHB4NHB4NHB4NHB4NHB4NHB4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKVUn7iM8FMEU24/giphy.gif')] bg-cover grayscale" />
      <div className="absolute inset-0 bg-gradient-to-tr from-pink-600/10 via-black/90 to-cyan-600/10" />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center space-y-12 animate-in fade-in zoom-in duration-700">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="w-3 h-3 text-pink-500 animate-pulse" />
            <span className="text-[7px] font-black text-pink-500 uppercase tracking-[0.5em]">Beta Release v1.0</span>
          </div>
          <h1 className="rave-font text-6xl tracking-tighter text-white italic drop-shadow-[0_0_30px_rgba(255,0,255,0.3)] leading-none">
            RAVE<span className="text-pink-500">TOK</span>
          </h1>
          <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.3em] mt-4 italic">Heritage Archive Sync Point</p>
        </div>

        {mode === 'welcome' ? (
          <div className="w-full space-y-6 animate-in slide-in-from-bottom duration-500">
            <button 
              onClick={handleCreateIdentity}
              className="w-full bg-white text-black py-7 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center space-x-4 shadow-2xl active:scale-95 transition-all"
            >
              <span>CREATE IDENTITY</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button 
              onClick={handleDemoLogin}
              className="w-full bg-zinc-900 text-zinc-400 py-6 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.3em] border border-white/5 active:scale-95 transition-all"
            >
              <FastForward className="w-4 h-4 mr-2 inline-block fill-zinc-500" />
              <span>GUEST ACCESS</span>
            </button>

            <button 
              onClick={() => setMode('admin')}
              className="w-full py-4 text-[9px] text-zinc-600 font-black uppercase tracking-widest hover:text-pink-500 transition-colors"
            >
              Resident Login (Mission Control)
            </button>
          </div>
        ) : (
          <form onSubmit={handleAdminLogin} className="w-full space-y-6 animate-in slide-in-from-right duration-400">
            <div className="bg-pink-500/10 border border-pink-500/20 p-4 rounded-2xl flex items-start space-x-3">
              <Info className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
              <p className="text-[8px] text-pink-200/60 font-medium leading-relaxed uppercase tracking-widest">
                Resident credentials required for archive oversight and global signal control.
              </p>
            </div>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="ALIAS" 
                autoComplete="username"
                className="w-full bg-zinc-900 border border-white/5 rounded-3xl p-6 text-sm font-bold text-white outline-none focus:border-pink-500 uppercase"
                value={formData.alias} 
                onChange={e => setFormData({...formData, alias: e.target.value})}
              />
              <input 
                type="password" 
                placeholder="SECURITY KEY" 
                autoComplete="current-password"
                className="w-full bg-zinc-900 border border-white/5 rounded-3xl p-6 text-sm font-bold text-white outline-none focus:border-pink-500"
                value={formData.pass} 
                onChange={e => setFormData({...formData, pass: e.target.value})}
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-pink-600 text-white py-6 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl active:scale-95 transition-all"
            >
              AUTHORIZE SYNC
            </button>
            <button 
              type="button" 
              onClick={() => setMode('welcome')} 
              className="w-full text-[8px] text-zinc-600 font-black uppercase tracking-widest"
            >
              Cancel
            </button>
          </form>
        )}
      </div>

      {isLoggingIn && (
        <div className="absolute inset-0 z-[600] bg-black flex flex-col items-center justify-center animate-in fade-in duration-500">
           <Disc className="w-20 h-20 text-pink-500 animate-spin-slow mb-6" />
           <p className="rave-font text-2xl text-white animate-pulse italic uppercase tracking-widest">{statusMessage}</p>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
