
import React, { useState, useRef, useEffect } from 'react';
import { Shield, Music, Star, Tag, Disc, ArrowRight, Zap, Check, Sparkles, Loader2, Disc as RecordIcon, Activity, Camera, X } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { User, Favorites } from '../types';
import SynthKnob from './SynthKnob';

interface OnboardingProps {
  onComplete: (user: User) => void;
}

const GENRE_NODES = [
  { id: 'jungle', name: 'Jungle', color: '#ff00ff', icon: '🌴' },
  { id: 'hardcore', name: 'Hardcore', color: '#fbbf24', icon: '💥' },
  { id: 'techno', name: 'Techno', color: '#22d3ee', icon: '⚙️' },
  { id: 'gabber', name: 'Gabber', color: '#dc2626', icon: '💣' },
  { id: 'ambient', name: 'Ambient', color: '#2563eb', icon: '🌌' },
  { id: 'trance', name: 'Acid Trance', color: '#22c55e', icon: '🌀' }
];

const LEGENDS = [
  'Goldie', 'LTJ Bukem', 'Andy C', 'Mickey Finn', 'Pete Cannon', 'Carl Cox', 'Grooverider', 'Fabio', 'Omni Trio', 'Origin Unknown'
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [userData, setUserData] = useState<Partial<User>>({
    username: '',
    displayName: '',
    role: 'raver',
    themeColor: 'pink',
    avatar: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb1?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1514525253361-bee8718a7439?w=800&fit=crop',
    favorites: {
      genres: [],
      djs: [],
      labels: [],
      artists: []
    },
    followers: 0,
    following: 0,
    isPro: false
  });

  const [genreValues, setGenreValues] = useState<Record<string, number>>({});
  const [legendValues, setLegendValues] = useState<Record<string, number>>({});
  const [calibrating, setCalibrating] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKnobChange = (id: string, value: number, type: 'genres' | 'djs') => {
    if (type === 'genres') {
      setGenreValues(prev => ({ ...prev, [id]: value }));
      setUserData(prev => {
        const current = prev.favorites?.genres || [];
        const isSet = value > 20; // Lower threshold to make it feel more responsive
        const updated = isSet 
          ? (current.includes(id) ? current : [...current, id])
          : current.filter(g => g !== id);
        return { ...prev, favorites: { ...prev.favorites!, genres: updated } };
      });
    } else {
      setLegendValues(prev => ({ ...prev, [id]: value }));
      setUserData(prev => {
        const current = prev.favorites?.djs || [];
        const isSet = value > 20;
        const updated = isSet 
          ? (current.includes(id) ? current : [...current, id])
          : current.filter(d => d !== id);
        return { ...prev, favorites: { ...prev.favorites!, djs: updated } };
      });
    }
  };

  const runFinalSync = async () => {
    setCalibrating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this rave profile: Genres: ${userData.favorites?.genres.join(', ')}, DJs: ${userData.favorites?.djs.join(', ')}. Write a 1-sentence badass 'Rave Identity' summary for their profile intro. Keep it under 15 words.`
      });
      setAiAnalysis(response.text || 'Archive synced. Signal strong.');
      setTimeout(() => {
        onComplete({
          ...userData as User,
          id: `u_${Date.now()}`,
          bio: response.text
        });
      }, 2000);
    } catch (err) {
      onComplete({ ...userData as User, id: `u_${Date.now()}` });
    }
  };

  return (
    <div className="fixed inset-0 z-[400] bg-black overflow-hidden flex flex-col font-mono">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[url('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2FwMHp4NHB4NHB4NHB4NHB4NHB4NHB4NHB4NHB4NHB4NHB4NHB4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKVUn7iM8FMEU24/giphy.gif')] bg-cover" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/90 to-black/80" />

      {/* Persistent Step Progress */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 pt-12 border-b border-white/5 bg-black/50 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-pink-500" />
          <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">Sync Status: Step {step}/4</span>
        </div>
        <div className="flex space-x-1.5">
          {[1,2,3,4].map(s => (
            <div key={s} className={`h-1 w-6 rounded-full transition-all ${step >= s ? 'bg-pink-500 shadow-[0_0_10px_#ff00ff]' : 'bg-zinc-800'}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 relative z-20 overflow-y-auto no-scrollbar pt-32 pb-40 px-6">
        {step === 1 && (
          <div className="w-full space-y-12 animate-in slide-in-from-bottom duration-500">
            <div className="text-center">
              <h1 className="rave-font text-4xl text-white italic tracking-tighter uppercase leading-tight">INITIALIZE<br/><span className="text-pink-500">IDENTITY</span></h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.4em] mt-4 italic">Establish Archive Credentials</p>
            </div>
            
            <div className="flex flex-col items-center space-y-10">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className={`absolute -inset-4 bg-pink-500/20 rounded-full blur-2xl transition-all ${userData.avatar?.startsWith('data:') ? 'opacity-100' : 'opacity-0'}`} />
                <div className="relative w-36 h-36 rounded-full border-4 border-pink-500 overflow-hidden shadow-[0_0_30px_rgba(255,0,255,0.2)]">
                  <img src={userData.avatar} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-10 h-10 text-white" />
                  </div>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              </div>

              <div className="w-full space-y-8">
                <div className="space-y-3 px-2">
                  <label className="text-[9px] font-black text-pink-500 uppercase tracking-widest ml-2">ARCHIVIST ALIAS</label>
                  <input 
                    type="text" 
                    placeholder="Enter Username..." 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-xl text-white outline-none focus:border-pink-500 transition-all italic font-bold shadow-xl"
                    value={userData.username}
                    onChange={e => setUserData({...userData, username: e.target.value.toLowerCase().replace(/\s/g, '_'), displayName: e.target.value})}
                  />
                </div>
                <button 
                  disabled={!userData.username}
                  onClick={() => setStep(2)}
                  className="w-full bg-white text-black py-7 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center space-x-3 active:scale-95 transition-all disabled:opacity-20 shadow-2xl"
                >
                  <span>Link Identity</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="w-full space-y-12 animate-in fade-in duration-500">
            <div className="text-center">
              <h1 className="rave-font text-3xl text-white italic uppercase tracking-tighter leading-none">SONIC<br/><span className="text-cyan-400">BLUEPRINT</span></h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mt-4 italic">Turn knobs to dial in frequencies</p>
            </div>

            <div className="grid grid-cols-2 gap-y-12 gap-x-8 justify-items-center">
              {GENRE_NODES.map(node => (
                <SynthKnob 
                  key={node.id}
                  label={node.name}
                  value={genreValues[node.name] || 0}
                  onChange={(val) => handleKnobChange(node.name, val, 'genres')}
                  color={node.color}
                  size={90}
                />
              ))}
            </div>

            <div className="pt-8">
              <button 
                disabled={userData.favorites?.genres.length === 0}
                onClick={() => setStep(3)}
                className="w-full bg-cyan-400 text-black py-7 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center space-x-3 active:scale-95 transition-all shadow-[0_0_40px_rgba(0,255,255,0.2)]"
              >
                <span>Initialize Frequencies</span>
                <Check className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="w-full space-y-12 animate-in fade-in duration-500">
            <div className="text-center">
              <h1 className="rave-font text-3xl text-white italic uppercase tracking-tighter leading-none">ARCHIVE<br/><span className="text-yellow-400">MASTERS</span></h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mt-4 italic">Dial in your legendary influences</p>
            </div>

            <div className="grid grid-cols-2 gap-y-14 gap-x-8 justify-items-center">
              {LEGENDS.slice(0, 8).map(name => (
                <SynthKnob 
                  key={name}
                  label={name}
                  value={legendValues[name] || 0}
                  onChange={(val) => handleKnobChange(name, val, 'djs')}
                  color="#fbbf24"
                  size={90}
                />
              ))}
            </div>

            <div className="pt-10">
              <button 
                onClick={() => setStep(4)}
                className="w-full bg-white text-black py-7 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center space-x-3 active:scale-95 transition-all shadow-2xl"
              >
                <span>Finalize Blueprint</span>
                <Zap className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-12 animate-in zoom-in duration-500">
            <div className="text-center space-y-10">
              {!calibrating ? (
                <>
                  <div className="relative">
                    <Sparkles className="w-24 h-24 text-pink-500 mx-auto animate-pulse" />
                    <div className="absolute inset-0 bg-pink-500/10 blur-3xl rounded-full" />
                  </div>
                  <div className="space-y-4 px-4">
                    <h1 className="rave-font text-4xl text-white italic uppercase tracking-tighter">NEXUS<br/><span className="text-green-500">AUTHORIZED</span></h1>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-[0.4em] leading-loose max-w-[280px] mx-auto italic">
                      Frequency imprint locked. Feed calibration sequence standing by for broadcast.
                    </p>
                  </div>
                  <button 
                    onClick={runFinalSync}
                    className="w-full bg-green-500 text-black py-8 rounded-[3rem] font-black uppercase text-sm tracking-[0.3em] flex items-center justify-center space-x-4 active:scale-95 transition-all shadow-[0_0_60px_rgba(34,197,94,0.3)]"
                  >
                    <span>ACTIVATE NEXUS</span>
                    <ArrowRight className="w-7 h-7" />
                  </button>
                </>
              ) : (
                <div className="space-y-12 py-10 flex flex-col items-center">
                   <div className="relative">
                     <Loader2 className="w-24 h-24 text-pink-500 animate-spin" />
                     <div className="absolute inset-0 bg-pink-500/5 blur-2xl rounded-full animate-pulse" />
                   </div>
                   <div className="space-y-4 px-6">
                     <p className="rave-font text-xl text-white italic uppercase animate-pulse">Syncing Vibe Imprint...</p>
                     <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-[0.3em] leading-relaxed max-w-[240px] mx-auto">
                        {aiAnalysis || 'Synthesizing your sonic identity from the archives...'}
                     </p>
                   </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Persistent Footer */}
      <div className="absolute bottom-10 left-0 right-0 z-50 px-8 text-center pointer-events-none opacity-30">
        <p className="text-[7px] text-zinc-600 font-black uppercase tracking-[0.5em]">Establishing Connection • Archive Protocol 091-B</p>
      </div>
    </div>
  );
};

export default Onboarding;
