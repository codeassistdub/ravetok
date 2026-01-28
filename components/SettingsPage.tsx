
import React, { useState } from 'react';
import { 
  Bell, Lock, Share2, User as UserIcon, Globe, Shield, 
  ChevronRight, Smartphone, Mail, Facebook, Chrome, 
  LogOut, Trash2, Zap, Radio
} from 'lucide-react';
import { User } from '../types';

interface SettingsPageProps {
  user: User;
  onLogout: () => void;
  onBack: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user, onLogout, onBack }) => {
  const [notifs, setNotifs] = useState({ push: true, email: false, market: true });
  const [privacy, setPrivacy] = useState({ public: true, showLocation: false });

  return (
    <div className="h-full bg-black text-white flex flex-col pt-28 pb-32 animate-in fade-in slide-in-from-right duration-300">
      <div className="px-8 mb-10 flex items-center justify-between">
        <h1 className="rave-font text-4xl italic uppercase tracking-tighter">CONFIG</h1>
        <button onClick={onBack} className="p-3 bg-zinc-900 rounded-2xl text-zinc-500">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-8 space-y-10 no-scrollbar">
        {/* Notifications */}
        <section className="space-y-4">
          <div className="flex items-center space-x-3 mb-2">
            <Bell className="w-4 h-4 text-pink-500" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Notifications</h3>
          </div>
          <div className="space-y-1 bg-zinc-900/40 rounded-[2rem] border border-white/5 overflow-hidden">
            {[
              { id: 'push', label: 'Push Signals', state: notifs.push, icon: Smartphone },
              { id: 'email', label: 'Email Logs', state: notifs.email, icon: Mail },
              { id: 'market', label: 'Market Offers', state: notifs.market, icon: ShoppingBag }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setNotifs(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof notifs] }))}
                className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-all"
              >
                <div className="flex items-center space-x-4">
                  <item.icon className="w-5 h-5 text-zinc-600" />
                  <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                </div>
                <div className={`w-10 h-5 rounded-full p-1 transition-all ${item.state ? 'bg-pink-500' : 'bg-zinc-800'}`}>
                  <div className={`w-3 h-3 bg-white rounded-full transition-all ${item.state ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Privacy */}
        <section className="space-y-4">
          <div className="flex items-center space-x-3 mb-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Security & Privacy</h3>
          </div>
          <div className="space-y-1 bg-zinc-900/40 rounded-[2rem] border border-white/5 overflow-hidden">
            <button className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-all">
              <div className="flex items-center space-x-4">
                <Shield className="w-5 h-5 text-zinc-600" />
                <span className="text-xs font-bold uppercase tracking-widest">Two-Factor Authentication</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-700" />
            </button>
            <button className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-all">
              <div className="flex items-center space-x-4">
                <Globe className="w-5 h-5 text-zinc-600" />
                <span className="text-xs font-bold uppercase tracking-widest">Public Archive</span>
              </div>
              <div className="w-10 h-5 bg-pink-500 rounded-full p-1"><div className="w-3 h-3 bg-white rounded-full translate-x-5" /></div>
            </button>
          </div>
        </section>

        {/* Linked Accounts */}
        <section className="space-y-4">
          <div className="flex items-center space-x-3 mb-2">
            <Share2 className="w-4 h-4 text-yellow-400" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Linked Channels</h3>
          </div>
          <div className="space-y-1 bg-zinc-900/40 rounded-[2rem] border border-white/5 overflow-hidden">
            <div className="p-5 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center space-x-4">
                <Chrome className="w-5 h-5 text-zinc-400" />
                <span className="text-xs font-bold uppercase tracking-widest italic">Google Nexus</span>
              </div>
              <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">Connected</span>
            </div>
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Facebook className="w-5 h-5 text-zinc-400" />
                <span className="text-xs font-bold uppercase tracking-widest italic">Facebook Uplink</span>
              </div>
              <button className="text-[8px] font-black text-pink-500 uppercase tracking-widest border border-pink-500/30 px-3 py-1.5 rounded-full">Link Account</button>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="pt-4 space-y-4">
          <button 
            onClick={onLogout}
            className="w-full p-6 bg-red-500/10 border border-red-500/30 rounded-[2rem] flex items-center justify-center space-x-3 group active:scale-95 transition-all"
          >
            <LogOut className="w-5 h-5 text-red-500 group-hover:animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-red-500 italic">Terminate Uplink</span>
          </button>
          <p className="text-[7px] text-zinc-700 font-bold uppercase tracking-[0.4em] text-center px-10 leading-loose">
            Archive Protocol v1.4.2 • 1989-1997 Heritage Preservation Node
          </p>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
import { ShoppingBag } from 'lucide-react';
