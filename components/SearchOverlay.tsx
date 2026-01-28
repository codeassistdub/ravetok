
import React, { useState, useEffect, useRef } from 'react';
import { Search, Youtube, Disc, User as UserIcon, X, Music, Play, Loader2, ArrowRight, Share2, Plus, Flame } from 'lucide-react';
import { MOCK_LIBRARY, MOCK_USERS } from '../constants';
import { SearchResult } from '../types';
import { searchYouTube } from '../services/youtube';

interface SearchOverlayProps {
  onClose: () => void;
  onSelect: (result: SearchResult, action?: 'view' | 'post') => void;
  mode?: 'global' | 'pick_track';
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ onClose, onSelect, mode = 'global' }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'youtube' | 'library' | 'people'>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 2) {
        setLoading(true);
        try {
          // Real YouTube Search
          const youtubeResults = await searchYouTube(query);
          
          const localLibrary = MOCK_LIBRARY.filter(t => 
            t.title.toLowerCase().includes(query.toLowerCase()) || 
            t.artist.toLowerCase().includes(query.toLowerCase())
          ).map(t => ({
            id: t.id,
            title: t.title,
            artist: t.artist,
            type: 'library' as const,
            thumbnail: t.artwork,
            youtubeId: '',
            metadata: { label: t.label, year: t.year }
          }));

          const localUsers = Object.values(MOCK_USERS).filter(u => 
            u.username.toLowerCase().includes(query.toLowerCase()) || 
            u.displayName.toLowerCase().includes(query.toLowerCase())
          ).map(u => ({
            id: u.id,
            title: u.displayName,
            artist: `@${u.username}`,
            type: 'user' as const,
            thumbnail: u.avatar,
          }));

          const combined = [...localLibrary, ...localUsers, ...youtubeResults];
          // Remove duplicates based on ID and type
          const unique = Array.from(new Map(combined.map(item => [`${item.id}-${item.type}`, item])).values());
          
          setResults(unique);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const filteredResults = results.filter(r => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'youtube') return r.type === 'youtube';
    if (activeFilter === 'library') return r.type === 'library';
    if (activeFilter === 'people') return r.type === 'user';
    return true;
  });

  return (
    <div className="fixed inset-0 z-[300] bg-black flex flex-col animate-in fade-in slide-in-from-bottom duration-300">
      <div className="p-4 flex items-center space-x-3 border-b border-zinc-900 bg-black/90 backdrop-blur-md pt-14">
        <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
          <input 
            ref={searchInputRef}
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={mode === 'pick_track' ? "Search track to tag..." : "Search artists, labels, tracks..."}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-3 pl-12 pr-12 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all placeholder:text-zinc-700 font-medium text-white"
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Loader2 className="w-5 h-5 text-pink-500 animate-spin" />
            </div>
          )}
        </div>
      </div>

      <div className="flex p-4 space-x-2 overflow-x-auto scrollbar-hide border-b border-zinc-900 bg-zinc-950/50">
        {(['all', 'youtube', 'library', 'people'] as const).map((f) => (
          <button 
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
              activeFilter === f 
                ? 'bg-pink-600 text-white shadow-pink-500/20' 
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-20">
        {query === '' ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
              <Disc className="w-10 h-10 text-zinc-600 animate-[spin_10s_linear_infinite]" />
            </div>
            <h3 className="rave-font text-xl text-white tracking-widest uppercase">The Archives Await</h3>
            <p className="text-zinc-500 text-xs mt-2 max-w-[240px] font-bold uppercase tracking-widest leading-loose">Search for that missing ID or your favorite warehouse anthem.</p>
          </div>
        ) : filteredResults.length > 0 ? (
          filteredResults.map((result) => (
            <div 
              key={`${result.id}-${result.type}`}
              className="w-full flex items-center p-3 rounded-2xl hover:bg-zinc-900/80 border border-zinc-900 hover:border-zinc-700 transition-all group active:scale-[0.98]"
            >
              <div 
                className="relative mr-4 flex-shrink-0 cursor-pointer"
                onClick={() => onSelect(result, 'view')}
              >
                <img 
                  src={result.thumbnail} 
                  className={`w-14 h-14 object-cover ${result.type === 'user' ? 'rounded-full border-2 border-cyan-500/50' : 'rounded-xl border border-white/5 shadow-xl'}`} 
                  alt="" 
                />
                {result.type === 'youtube' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-600/20 rounded-xl">
                    <Play className="w-6 h-6 text-white fill-white shadow-lg" />
                  </div>
                )}
              </div>
              
              <div 
                className="flex-1 min-w-0 cursor-pointer"
                onClick={() => onSelect(result, 'view')}
              >
                <h4 className="font-black text-white truncate text-base group-hover:text-pink-500 transition-colors uppercase tracking-tight italic">{result.title}</h4>
                <div className="flex items-center mt-1 space-x-2">
                  <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${result.type === 'youtube' ? 'bg-red-600/20 text-red-500' : result.type === 'library' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-cyan-500/20 text-cyan-500'}`}>
                    {result.type}
                  </span>
                  <p className="text-[10px] text-zinc-500 truncate font-bold uppercase tracking-widest">
                    {result.artist}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 pl-2">
                {(result.type === 'youtube' || result.type === 'library') && (
                  <button 
                    onClick={() => onSelect(result, 'post')}
                    className="p-3 bg-pink-600 hover:bg-pink-500 text-white rounded-xl shadow-lg transition-all active:scale-90 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Post</span>
                  </button>
                )}
              </div>
            </div>
          ))
        ) : !loading && (
          <div className="text-center py-20 bg-zinc-900/20 rounded-3xl border border-zinc-900">
            <X className="w-10 h-10 text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Nothing found in this reality.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
