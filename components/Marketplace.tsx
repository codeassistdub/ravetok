
import React, { useState, useMemo } from 'react';
import { ShoppingBag, Tag, Filter, Search, Flame, ArrowUpRight, DollarSign, Package, Zap } from 'lucide-react';
import { Post, User } from '../types';

interface MarketplaceProps {
  posts: Post[];
  currentUser: User;
  onMakeOffer: (post: Post) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ posts, currentUser, onMakeOffer }) => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Records' | 'Gear' | 'Artifacts'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Records', 'Gear', 'Artifacts'];

  const marketItems = useMemo(() => {
    return posts.filter(p => {
      const isMarket = !!p.shopMetadata;
      const categoryMatch = activeCategory === 'All' || p.shopMetadata?.category === activeCategory;
      const searchMatch = p.trackTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.artist.toLowerCase().includes(searchQuery.toLowerCase());
      return isMarket && categoryMatch && searchMatch;
    });
  }, [posts, activeCategory, searchQuery]);

  return (
    <div className="h-full flex flex-col bg-black overflow-hidden relative">
      <header className="p-8 pt-28 pb-4 flex flex-col space-y-6 relative z-10 bg-gradient-to-b from-black to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
              <ShoppingBag className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="rave-font text-4xl text-white italic uppercase tracking-tighter leading-none">NEXUS<br/><span className="text-cyan-400">MARKET</span></h1>
              <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.4em] mt-2 italic">Global Trade Node</p>
            </div>
          </div>
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-zinc-800 overflow-hidden">
                <img src={`https://i.pravatar.cc/100?u=${i}`} alt="" />
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-black bg-cyan-500 flex items-center justify-center text-[8px] font-black text-black">
              +12
            </div>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search artifacts & gear..." 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl py-5 pl-14 pr-6 focus:border-cyan-500 outline-none transition-all placeholder:text-zinc-700 font-bold text-white shadow-2xl"
          />
        </div>

        <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar py-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-6 py-2.5 rounded-2xl whitespace-nowrap font-black text-[10px] uppercase tracking-widest transition-all ${
                activeCategory === cat ? 'bg-cyan-400 text-black shadow-[0_0_20px_rgba(0,255,255,0.3)]' : 'bg-zinc-900 text-zinc-500 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-40 relative z-10 no-scrollbar">
        <div className="grid grid-cols-2 gap-4">
          {marketItems.map((item) => (
            <div 
              key={item.id} 
              className="group bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col transition-all hover:border-cyan-500/30"
            >
              <div className="aspect-square relative overflow-hidden bg-zinc-800">
                <img 
                  src={item.thumbnail || 'https://images.unsplash.com/photo-1605648916319-cf082f7524a1?w=400&fit=crop'} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
                  alt="" 
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[8px] font-black text-cyan-400 border border-cyan-400/20 uppercase">
                    {item.shopMetadata?.category || 'Records'}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4">
                  <div className="bg-cyan-400 text-black px-3 py-1.5 rounded-xl font-black text-[10px] shadow-xl">
                    {item.shopMetadata?.price}
                  </div>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col space-y-3">
                <div className="min-w-0">
                  <h3 className="font-black text-white text-xs uppercase italic truncate">{item.trackTitle}</h3>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase truncate mt-0.5">{item.artist}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-zinc-800 border border-white/10 overflow-hidden">
                    <img src={item.user.avatar} className="w-full h-full object-cover" alt="" />
                  </div>
                  <span className="text-[8px] text-zinc-600 font-black uppercase">@{item.user.username}</span>
                </div>

                <button 
                  onClick={() => onMakeOffer(item)}
                  className="w-full py-3 bg-white/5 border border-white/5 hover:bg-white/10 text-white rounded-2xl font-black uppercase text-[8px] tracking-[0.2em] transition-all flex items-center justify-center space-x-2"
                >
                  <Zap className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                  <span>NEGOTIATE SIGNAL</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {marketItems.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center text-center opacity-30">
            <Package className="w-16 h-16 text-zinc-600 mb-6 animate-pulse" />
            <p className="rave-font text-xl text-white italic uppercase tracking-widest">Market Empty</p>
            <p className="text-[10px] text-zinc-500 uppercase mt-2 font-black">No signals found in this sector</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
