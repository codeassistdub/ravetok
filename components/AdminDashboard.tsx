
import React, { useState, useRef } from 'react';
import { Shield, Radio, Activity, Database, Loader2, DollarSign, Wifi, WifiOff, Zap, Trash2, ExternalLink, Upload, Film, Check, X, ShoppingBag, Tag, Package, AlertTriangle } from 'lucide-react';
import { LibraryTrack, Post } from '../types';
import { RAVE_VISUALS } from '../constants';

interface AdminDashboardProps {
  onAddPost: (data: any) => void;
  onDeletePost: (id: string) => void;
  onClearAll: () => void;
  posts: Post[];
  library: LibraryTrack[];
  onAddLibrary: (track: LibraryTrack) => void;
  isLive?: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onAddPost, onDeletePost, onClearAll, posts, isLive }) => {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [view, setView] = useState<'create' | 'manage'>('create');
  const [postType, setPostType] = useState<'track' | 'marketplace'>('track');
  const [newPost, setNewPost] = useState({
    trackTitle: '',
    artist: '',
    description: '',
    videoUrl: '',
    genre: 'Jungle',
    price: '',
    category: 'Records',
  });
  
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
      setNewPost({ ...newPost, videoUrl: url });
    }
  };

  const handleBroadcast = () => {
    if (!newPost.trackTitle || !newPost.artist) {
      alert("IDENTIFIER REQUIRED: Title and Artist missing.");
      return;
    }
    
    setIsBroadcasting(true);
    
    const payload = {
      ...newPost,
      videoUrl: newPost.videoUrl || RAVE_VISUALS[0], 
      source: postType === 'marketplace' ? 'marketplace' : 'upload',
      shopMetadata: postType === 'marketplace' ? {
        price: newPost.price || '£0.00',
        category: newPost.category,
        condition: 'Used'
      } : null
    };

    onAddPost(payload);

    setNewPost({ 
      trackTitle: '', artist: '', description: '', videoUrl: '', genre: 'Jungle', price: '', category: 'Records' 
    });
    setMediaPreview(null);
    setIsBroadcasting(false);
    setView('manage');
  };

  return (
    <div className="h-full bg-black pt-28 px-6 overflow-y-auto pb-40 no-scrollbar">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-zinc-900 rounded-2xl border border-pink-500/30">
            <Shield className="w-8 h-8 text-pink-500" />
          </div>
          <h1 className="rave-font text-2xl text-white italic uppercase leading-none">MISSION<br/><span className="text-pink-500">CONTROL</span></h1>
        </div>
        <div className="flex space-x-2">
           <button onClick={() => setView('create')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${view === 'create' ? 'bg-white text-black' : 'text-zinc-500 border-zinc-800'}`}>New</button>
           <button onClick={() => setView('manage')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${view === 'manage' ? 'bg-white text-black' : 'text-zinc-500 border-zinc-800'}`}>Archive</button>
        </div>
      </header>

      {view === 'create' ? (
        <div className="bg-zinc-900/40 p-8 rounded-[3rem] border border-white/5 space-y-8 backdrop-blur-3xl shadow-2xl">
          <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5">
            <button onClick={() => setPostType('track')} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${postType === 'track' ? 'bg-pink-600 text-white' : 'text-zinc-600'}`}>Signal</button>
            <button onClick={() => setPostType('marketplace')} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${postType === 'marketplace' ? 'bg-cyan-500 text-black' : 'text-zinc-600'}`}>Asset</button>
          </div>

          <div className="space-y-6">
            <input type="text" placeholder="TITLE" className="w-full bg-black border border-zinc-800 rounded-2xl p-6 text-sm font-black text-white italic outline-none focus:border-pink-500" value={newPost.trackTitle} onChange={e => setNewPost({...newPost, trackTitle: e.target.value})} />
            <input type="text" placeholder="ARTIST" className="w-full bg-black border border-zinc-800 rounded-2xl p-6 text-sm font-black text-white italic outline-none focus:border-pink-500" value={newPost.artist} onChange={e => setNewPost({...newPost, artist: e.target.value})} />
            
            {postType === 'marketplace' && (
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="£0.00" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-xs font-black text-white outline-none focus:border-cyan-400" value={newPost.price} onChange={e => setNewPost({...newPost, price: e.target.value})} />
                <select className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-xs font-black text-white outline-none" value={newPost.category} onChange={e => setNewPost({...newPost, category: e.target.value})}>
                  <option>Records</option>
                  <option>Gear</option>
                  <option>Artifacts</option>
                </select>
              </div>
            )}

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 bg-black/40 border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 transition-all"
            >
              {mediaPreview ? <Check className="w-8 h-8 text-green-500" /> : <Upload className="w-8 h-8 text-zinc-700 mb-2" />}
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Select Visual</span>
              <input type="file" ref={fileInputRef} className="hidden" accept="video/*,audio/*,image/*" onChange={handleFileChange} />
            </div>

            <textarea placeholder="DESCRIPTION..." className="w-full bg-black border border-zinc-800 rounded-3xl p-6 text-xs text-zinc-400 h-24 resize-none outline-none focus:border-pink-500 font-medium" value={newPost.description} onChange={e => setNewPost({...newPost, description: e.target.value})} />
          </div>

          <button onClick={handleBroadcast} disabled={isBroadcasting} className={`w-full py-7 ${postType === 'track' ? 'bg-pink-600' : 'bg-cyan-500 text-black'} rounded-[2rem] font-black uppercase text-[10px] tracking-widest flex items-center justify-center space-x-4 shadow-2xl active:scale-95 transition-all disabled:opacity-50`}>
            {isBroadcasting ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>BROADCAST SIGNAL</span>}
          </button>
        </div>
      ) : (
        <div className="space-y-4 pb-10">
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-[2rem] flex items-center justify-between shadow-xl">
             <div className="space-y-1">
                <h4 className="text-red-500 font-black uppercase italic text-sm">Terminate Archive</h4>
                <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">Full System Wipe</p>
             </div>
             <button onClick={onClearAll} className="p-4 bg-red-600 text-white rounded-2xl active:scale-90 transition-all"><AlertTriangle className="w-6 h-6" /></button>
          </div>

          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-2 italic">Active Signals ({posts.length})</p>
          {posts.map(post => (
            <div key={post.id} className="bg-zinc-900/40 border border-white/5 p-4 rounded-3xl flex items-center justify-between group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-800 relative">
                  <img src={post.thumbnail || RAVE_VISUALS[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-white font-black uppercase italic text-xs truncate w-32">{post.trackTitle}</h4>
                  <p className="text-[10px] text-zinc-500 font-bold truncate">@{post.user?.username || 'user'}</p>
                </div>
              </div>
              <button onClick={() => onDeletePost(post.id)} className="p-3 text-red-500 rounded-xl hover:bg-red-500/10 transition-all active:scale-90">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
