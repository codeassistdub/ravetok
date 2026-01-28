
import React, { useState, useMemo } from 'react';
import { Search, Play, Plus, Disc, Check, Zap, Archive, ArrowUpRight, Music, Sparkles, Loader2, X, ListPlus, Headphones, Clock } from 'lucide-react';
import { LibraryTrack } from '../types';
import { getRaveRecommendations } from '../services/gemini';

interface LibraryProps {
  tracks: LibraryTrack[];
  onPlayTrack?: (track: LibraryTrack) => void;
  onSaveToVault?: (track: LibraryTrack) => void;
}

const Library: React.FC<LibraryProps> = ({ tracks, onPlayTrack, onSaveToVault }) => {
  const [activeEra, setActiveEra] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [showMixesOnly, setShowMixesOnly] = useState(false);

  const eras = ['All', '89-91', '92-93', '94-95', '96-97'];

  const filteredTracks = useMemo(() => {
    return tracks.filter(track => {
      const eraMatch = activeEra === 'All' || 
        (activeEra === '89-91' && ['1989', '1990', '1991'].includes(track.year)) ||
        (activeEra === '92-93' && ['1992', '1993'].includes(track.year)) ||
        (activeEra === '94-95' && ['1994', '1995'].includes(track.year)) ||
        (activeEra === '96-97' && ['1996', '1997'].includes(track.year));
      const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            track.artist.toLowerCase().includes(searchQuery.toLowerCase());
      const mixMatch = !showMixesOnly || track.isMix;
      return eraMatch && matchesSearch && mixMatch;
    });
  }, [activeEra, searchQuery, showMixesOnly, tracks]);

  const handleScanDeepVault = async () => {
    setIsScanning(true);
    const favorites = tracks.slice(0, 3).map(t => t.title);
    const recs = await getRaveRecommendations(favorites);
    setRecommendations(recs);
    setIsScanning(false);
  };

  return (
    <div className="h-full flex flex-col bg-black overflow-hidden relative">
      <header className="p-8 pt-28 pb-4 flex flex-col space-y-6 relative z-10 bg-gradient-to-b from-black to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
             <div className="p-3 bg-pink-500/10 rounded-2xl border border-pink-500/20 shadow-[0_0_20px_rgba(255,0,255,0.1)]">
               <Music className="w-8 h-8 text-pink-500" />
             </div>
             <div>
               <h1 className="rave-font text-4xl text-white italic uppercase tracking-tighter leading-none">LIBRARY</h1>
               <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.4em] mt-2 italic">Heritage Collection</p>
             </div>
          </div>
          <button onClick={handleScanDeepVault} className="p-3 bg-zinc-900 rounded-full border border-zinc-800 text-pink-500 hover:bg-zinc-800 transition-all active:scale-90 shadow-xl">
            <Sparkles className={`w-5 h-5 ${isScanning ? 'animate-pulse' : ''}`} />
          </button>
        </div>

        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5 group-focus-within:text-pink-500 transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tracks..." 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl py-5 pl-14 pr-6 focus:border-pink-500 outline-none transition-all placeholder:text-zinc-700 font-bold text-white shadow-2xl"
          />
        </div>

        <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar py-2">
            {eras.map(era => (
              <button
                key={era}
                onClick={() => setActiveEra(era)}
                className={`px-8 py-2.5 rounded-2xl whitespace-nowrap font-black text-[10px] uppercase tracking-widest transition-all ${
                  activeEra === era && !showMixesOnly ? 'bg-white text-black shadow-xl scale-105' : 'bg-zinc-900 text-zinc-500 border border-white/5'
                }`}
              >
                {era}
              </button>
            ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-40 space-y-4 relative z-10 no-scrollbar">
        {isScanning && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
            <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
            <p className="rave-font text-xl text-white tracking-widest uppercase italic animate-pulse">Deep Scanning Vault...</p>
          </div>
        )}

        {!isScanning && filteredTracks.map((track, i) => (
          <div 
            key={track.id} 
            className="group relative bg-zinc-900/40 hover:bg-zinc-900 border border-white/5 rounded-[2rem] p-5 flex items-center transition-all cursor-pointer shadow-xl active:scale-[0.98]"
            onClick={() => onPlayTrack?.(track)}
          >
            <div className="w-20 h-20 rounded-2xl overflow-hidden relative flex-shrink-0 bg-zinc-800 shadow-2xl">
               <img src={track.artwork} className="w-full h-full object-cover group-hover:scale-110 transition-transform opacity-60 group-hover:opacity-100" alt="" />
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-8 h-8 text-white fill-white shadow-2xl" />
               </div>
               <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[7px] font-black text-white">{track.year}</div>
            </div>
            
            <div className="flex-1 ml-5 min-w-0">
               <div className="flex items-center space-x-2">
                 <h3 className="font-black uppercase italic tracking-tighter truncate text-lg leading-none text-white group-hover:text-pink-500 transition-colors">{track.title}</h3>
                 {track.verified && <Check className="w-3 h-3 text-cyan-400" strokeWidth={4} />}
               </div>
               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{track.artist}</p>
               <span className="inline-block text-[7px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full border bg-pink-500/10 border-pink-500/10 text-pink-500 mt-2">
                 {track.genre}
               </span>
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); onSaveToVault?.(track); }}
              className="p-4 rounded-2xl bg-zinc-800/40 text-zinc-500 hover:text-white hover:bg-pink-500 transition-all active:scale-110 shadow-lg"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
