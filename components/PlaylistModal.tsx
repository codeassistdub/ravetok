
import React, { useState, useMemo } from 'react';
import { X, Plus, Music, Check, ListMusic, Shield, ArrowRight, Search, Zap, Star } from 'lucide-react';
import { Playlist, Post, User } from '../types';

interface PlaylistModalProps {
  user: User;
  track: Post;
  playlists: Playlist[];
  onClose: () => void;
  onAddToPlaylist: (playlistId: string, trackId: string) => void;
  onCreatePlaylist: (title: string, description: string) => void;
}

const PlaylistModal: React.FC<PlaylistModalProps> = ({ user, track, playlists, onClose, onAddToPlaylist, onCreatePlaylist }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [addedId, setAddedId] = useState<string | null>(null);

  const filteredPlaylists = useMemo(() => {
    return playlists.filter(pl => 
      pl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pl.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [playlists, searchQuery]);

  const handleAdd = (playlistId: string) => {
    setAddedId(playlistId);
    setTimeout(() => {
      onAddToPlaylist(playlistId, track.id);
    }, 600);
  };

  const handleCreate = () => {
    if (newTitle.trim()) {
      onCreatePlaylist(newTitle, newDesc);
      setShowCreate(false);
      setNewTitle('');
      setNewDesc('');
    }
  };

  return (
    <div className="fixed inset-0 z-[700] bg-black/80 backdrop-blur-md flex items-end justify-center animate-in fade-in duration-300">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="w-full max-w-md bg-zinc-950 border-t border-white/10 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] relative z-10 flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-500 ease-out">
        {/* Drag Handle / Header */}
        <div className="flex flex-col items-center pt-3 pb-6">
          <div className="w-12 h-1 bg-zinc-800 rounded-full mb-6" />
          <div className="w-full px-8 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-pink-500/10 rounded-xl">
                <ListMusic className="w-5 h-5 text-pink-500" />
              </div>
              <h2 className="rave-font text-xl text-white italic uppercase tracking-tighter">SELECT VAULT</h2>
            </div>
            <button onClick={onClose} className="p-2 bg-zinc-900 rounded-full text-zinc-500 hover:text-white transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Selected Track Preview */}
        <div className="px-8 mb-6">
          <div className="flex items-center space-x-4 p-4 bg-zinc-900/50 rounded-3xl border border-white/5 shadow-inner">
            <div className="relative w-14 h-14 flex-shrink-0">
              <img src={track.thumbnail} className="w-full h-full rounded-2xl object-cover" alt="" />
              <div className="absolute inset-0 bg-pink-500/10 rounded-2xl animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[8px] font-black text-pink-500 uppercase tracking-[0.2em] mb-0.5 italic">Broadcasting to Vault</p>
              <h4 className="font-black text-white truncate text-sm italic uppercase">{track.trackTitle}</h4>
              <p className="text-[10px] text-zinc-500 font-bold uppercase truncate">by {track.artist}</p>
            </div>
            <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
        </div>

        {!showCreate ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search Bar */}
            <div className="px-8 mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input 
                  type="text"
                  placeholder="Filter vaults..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-white outline-none focus:border-pink-500/50 transition-all placeholder:text-zinc-700"
                />
              </div>
            </div>

            {/* List of Playlists */}
            <div className="flex-1 overflow-y-auto px-8 space-y-3 pb-32 no-scrollbar">
              <button 
                onClick={() => setShowCreate(true)}
                className="w-full p-5 bg-white/5 border border-dashed border-zinc-800 rounded-[2rem] flex items-center justify-center space-x-3 hover:border-pink-500 hover:bg-white/10 transition-all group"
              >
                <Plus className="w-5 h-5 text-zinc-500 group-hover:text-pink-500 transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">Establish New Vault</span>
              </button>

              {filteredPlaylists.map(playlist => {
                const isAdded = addedId === playlist.id || playlist.trackIds.includes(track.id);
                return (
                  <button 
                    key={playlist.id}
                    disabled={isAdded && addedId !== playlist.id}
                    onClick={() => handleAdd(playlist.id)}
                    className={`w-full p-4 rounded-[2rem] border transition-all flex items-center space-x-4 group relative overflow-hidden ${
                      isAdded 
                        ? 'bg-pink-500/10 border-pink-500/50' 
                        : 'bg-zinc-900 border-white/5 hover:border-zinc-600 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-800 relative shadow-lg">
                      <img src={playlist.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                      {playlist.isOfficial && (
                        <div className="absolute top-1 right-1">
                          <Shield className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center space-x-2">
                        <h5 className="font-black text-white text-xs uppercase italic truncate">{playlist.title}</h5>
                        {playlist.isOfficial && <Star className="w-2.5 h-2.5 text-cyan-400 fill-cyan-400" />}
                      </div>
                      <p className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mt-1">
                        {playlist.trackIds.length} FREQUENCIES • {playlist.isOfficial ? 'SYSTEM' : 'PRIVATE'}
                      </p>
                    </div>

                    <div className="relative z-10">
                      {addedId === playlist.id ? (
                        <div className="p-2 bg-green-500 rounded-full animate-bounce shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                          <Check className="w-4 h-4 text-black" strokeWidth={4} />
                        </div>
                      ) : playlist.trackIds.includes(track.id) ? (
                        <div className="flex items-center space-x-1 opacity-40">
                          <Check className="w-3 h-3 text-zinc-500" />
                          <span className="text-[8px] font-black uppercase tracking-widest">Added</span>
                        </div>
                      ) : (
                        <div className="p-3 bg-zinc-950 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus className="w-4 h-4 text-pink-500" />
                        </div>
                      )}
                    </div>

                    {/* Subtle Pulse for Added State */}
                    {addedId === playlist.id && (
                      <div className="absolute inset-0 bg-green-500/5 animate-pulse pointer-events-none" />
                    )}
                  </button>
                );
              })}

              {filteredPlaylists.length === 0 && (
                <div className="py-12 text-center opacity-30">
                  <p className="text-[10px] font-black uppercase tracking-widest italic">No matching vaults found</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="px-8 pb-32 space-y-8 animate-in slide-in-from-right duration-400">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-4">VAULT IDENTIFIER</label>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="E.G. 93 WAREHOUSE ANTHEMS"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-sm text-white font-bold outline-none focus:border-pink-500 shadow-xl"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-4">FREQUENCY ENCODING (BIO)</label>
                <textarea 
                  placeholder="What's the energy inside this vault?"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 text-xs text-zinc-300 font-medium h-32 resize-none outline-none focus:border-pink-500 shadow-xl"
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button 
                onClick={() => setShowCreate(false)} 
                className="flex-1 py-6 bg-zinc-900 text-zinc-500 rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreate}
                disabled={!newTitle.trim()}
                className="flex-[2] py-6 bg-pink-500 text-black rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-[0_0_30px_rgba(255,0,255,0.3)] disabled:opacity-20 active:scale-95 transition-all flex items-center justify-center space-x-3"
              >
                <span>Establish Vault</span>
                <Check className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistModal;
