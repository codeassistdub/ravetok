
import React, { useState } from 'react';
import { Settings, Grid, List, Bookmark, Shield, MapPin, Link as LinkIcon, Disc, Loader2, Music, LogOut } from 'lucide-react';
import { User, Post } from '../types';
import SettingsPage from './SettingsPage';
import EditProfileModal from './EditProfileModal';

interface ProfilePageProps {
  user: User;
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState<'posts' | 'saved' | 'settings'>('posts');
  const [isEditing, setIsEditing] = useState(false);

  if (activeView === 'settings') {
    return <SettingsPage user={user} onLogout={onLogout} onBack={() => setActiveView('posts')} />;
  }

  return (
    <div className="h-full bg-black overflow-y-auto no-scrollbar pb-32">
      {/* Cover Banner */}
      <div className="relative h-48 w-full">
        <img 
          src={user.banner || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&fit=crop'} 
          className="w-full h-full object-cover opacity-60" 
          alt="" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <button 
          onClick={() => setActiveView('settings')}
          className="absolute top-12 right-6 p-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-white active:scale-90 transition-all"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Profile Info */}
      <div className="px-8 -mt-16 relative z-10 space-y-6">
        <div className="flex items-end justify-between">
          <div className="relative">
            <div className="absolute -inset-1 bg-pink-500 rounded-full blur-lg opacity-30 animate-pulse" />
            <img src={user.avatar} className="relative w-32 h-32 rounded-full border-4 border-black object-cover shadow-2xl" alt="" />
            {user.role === 'resident' && (
              <div className="absolute bottom-1 right-1 bg-pink-500 p-1.5 rounded-full border-2 border-black">
                <Shield className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsEditing(true)}
            className="px-8 py-3 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all mb-2"
          >
            Edit Identity
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <h1 className="rave-font text-3xl text-white italic uppercase tracking-tighter leading-none">{user.displayName}</h1>
            {user.isPro && <Disc className="w-5 h-5 text-cyan-400 animate-spin-slow" />}
          </div>
          <p className="text-[10px] text-pink-500 font-black uppercase tracking-[0.3em] italic leading-none">@{user.username}</p>
        </div>

        <div className="flex items-center space-x-8">
          <div className="text-center">
            <p className="text-lg font-black text-white leading-none tracking-tighter">{user.followers || 0}</p>
            <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mt-1">Signals</p>
          </div>
          <div className="text-center border-x border-white/5 px-8">
            <p className="text-lg font-black text-white leading-none tracking-tighter">{user.following || 0}</p>
            <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mt-1">Uplinks</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-white leading-none tracking-tighter">14.2k</p>
            <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mt-1">Energy</p>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-6 space-y-4">
          <p className="text-xs text-zinc-300 font-medium leading-relaxed italic">
            {user.bio || 'Archive identity established. Awaiting heritage signal broadcast.'}
          </p>
          <div className="flex flex-wrap gap-2">
             {user.favorites?.genres?.slice(0, 3).map(genre => (
                <span key={genre} className="px-3 py-1 bg-black/60 rounded-full text-[8px] font-black text-cyan-400 border border-cyan-400/20 uppercase italic">
                  #{genre}
                </span>
             ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 px-6 sticky top-24 z-20 bg-black/80 backdrop-blur-lg py-4 border-b border-white/5">
        <div className="flex bg-zinc-900 p-1 rounded-2xl">
          <button 
            onClick={() => setActiveView('posts')}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all ${activeView === 'posts' ? 'bg-white text-black' : 'text-zinc-500'}`}
          >
            <Grid className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase tracking-widest">Broadcasts</span>
          </button>
          <button 
            onClick={() => setActiveView('saved')}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all ${activeView === 'saved' ? 'bg-white text-black' : 'text-zinc-500'}`}
          >
            <Bookmark className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase tracking-widest">Vault</span>
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="px-6 mt-6 grid grid-cols-3 gap-2">
        {activeView === 'posts' ? (
          <div className="col-span-3 py-12 flex flex-col items-center justify-center opacity-20 text-center">
            <Music className="w-12 h-12 text-zinc-700 mb-4 animate-pulse" />
            <p className="rave-font text-lg text-white italic uppercase">Signal Lost</p>
            <p className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mt-2">Initialize a new broadcast to fill archive</p>
          </div>
        ) : (
          <div className="col-span-3 py-12 flex flex-col items-center justify-center opacity-20 text-center">
            <Bookmark className="w-12 h-12 text-zinc-700 mb-4" />
            <p className="rave-font text-lg text-white italic uppercase">Vault Empty</p>
            <p className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mt-2">Save signals to your heritage stash</p>
          </div>
        )}
      </div>

      {isEditing && (
        <EditProfileModal 
          user={user} 
          onClose={() => setIsEditing(false)} 
          onSave={(updated) => {
            // In a real app we'd save this to a database
            setIsEditing(false);
          }} 
        />
      )}
    </div>
  );
};

export default ProfilePage;
