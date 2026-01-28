
import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Music, Headphones, Check, ShoppingBag, Radio, Tag, DollarSign, Package, Search, Image as ImageIcon, Zap, Globe, FileAudio, FileVideo, Loader2, Camera, Link } from 'lucide-react';

interface ArtworkResult {
  artworkUrl: string;
  collectionName: string;
  artistName: string;
}

interface UploadWizardProps {
  onClose: () => void;
  onPost: (postData: any) => void;
}

const UploadWizard: React.FC<UploadWizardProps> = ({ onClose, onPost }) => {
  const [step, setStep] = useState<'type' | 'source' | 'metadata' | 'artwork_finder'>('type');
  const [postType, setPostType] = useState<'track' | 'marketplace' | 'mix'>('track');
  const [metadata, setMetadata] = useState({ 
    title: '', 
    artist: '', 
    genre: 'Jungle', 
    description: '',
    price: '',
    category: 'Records',
    youtubeId: ''
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tempVideoUrl, setTempVideoUrl] = useState<string | null>(null);
  const [tempThumbnail, setTempThumbnail] = useState<string | null>(null);
  
  const [artworkResults, setArtworkResults] = useState<ArtworkResult[]>([]);
  const [isSearchingArtwork, setIsSearchingArtwork] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const visualInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          const url = URL.createObjectURL(file);
          setTempVideoUrl(url);
          setIsUploading(false);
          setStep('metadata');
          return 100;
        }
        return p + 25;
      });
    }, 150);
  };

  const handlePost = () => {
    if (!metadata.title) {
       alert("IDENTIFIER REQUIRED: Please enter a title.");
       return;
    }
    onPost({
      trackTitle: metadata.title,
      artist: metadata.artist,
      description: metadata.description,
      videoUrl: tempVideoUrl,
      youtubeId: metadata.youtubeId,
      thumbnail: tempThumbnail,
      source: postType === 'marketplace' ? 'marketplace' : 'upload',
      isMix: postType === 'mix',
      shopMetadata: postType === 'marketplace' ? {
        price: metadata.price || '£0.00',
        category: metadata.category,
        condition: 'Mint'
      } : null
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col pt-16 animate-in slide-in-from-bottom duration-500">
      <div className="px-8 flex justify-between items-center mb-8">
        <button onClick={onClose} className="p-4 bg-zinc-900 rounded-3xl active:scale-90"><X className="w-6 h-6" /></button>
        <h2 className="rave-font text-2xl text-white italic tracking-tighter uppercase">Initialize Signal</h2>
        <div className="w-14" />
      </div>

      <div className="flex-1 px-8 overflow-y-auto pb-24 no-scrollbar">
        {step === 'type' ? (
          <div className="space-y-4">
            <button onClick={() => { setPostType('track'); setStep('source'); }} className="w-full p-8 bg-zinc-900 border border-white/5 rounded-[2.5rem] flex items-center space-x-6 text-left active:border-pink-500 transition-all">
              <div className="p-5 bg-pink-500 rounded-3xl"><Music className="w-8 h-8 text-black" /></div>
              <div>
                <span className="block text-lg font-black uppercase italic text-white leading-none">Sonic Signal</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Archive single tracks</span>
              </div>
            </button>
            <button onClick={() => { setPostType('marketplace'); setStep('source'); }} className="w-full p-8 bg-zinc-900 border border-white/5 rounded-[2.5rem] flex items-center space-x-6 text-left active:border-cyan-500 transition-all">
              <div className="p-5 bg-cyan-400 rounded-3xl"><ShoppingBag className="w-8 h-8 text-black" /></div>
              <div>
                <span className="block text-lg font-black uppercase italic text-white leading-none">Asset Sale</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Gear & Artifacts</span>
              </div>
            </button>
          </div>
        ) : isUploading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-8">
            <div className="relative">
              <Loader2 className="w-20 h-20 text-pink-500 animate-spin" />
              <Radio className="absolute inset-0 m-auto w-8 h-8 text-white animate-pulse" />
            </div>
            <p className="rave-font text-xl text-white italic animate-pulse">Uplinking {uploadProgress}%</p>
          </div>
        ) : step === 'source' ? (
          <div className="space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-video bg-zinc-900/40 border-2 border-dashed border-zinc-800 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 transition-all"
            >
              <Upload className="w-12 h-12 text-zinc-700 mb-4" />
              <span className="text-zinc-500 font-black uppercase tracking-widest text-[10px]">Select Local File</span>
              <input type="file" ref={fileInputRef} className="hidden" accept="video/*,audio/*,image/*" onChange={handleFileChange} />
            </div>
            
            <div className="relative">
              <div className="h-px bg-zinc-800 w-full" />
              <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-4 text-[10px] text-zinc-600 font-black uppercase">Or Persistent Link</span>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-4">YouTube Video ID</label>
              <div className="relative">
                <Link className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input 
                  type="text" 
                  placeholder="e.g. WpM1P2vYI0g" 
                  className="w-full bg-zinc-900 border border-white/5 rounded-3xl p-6 pl-14 text-sm text-white font-bold outline-none focus:border-red-500" 
                  value={metadata.youtubeId} onChange={e => setMetadata({...metadata, youtubeId: e.target.value})} 
                />
              </div>
            </div>

            <button onClick={() => setStep('metadata')} className="w-full py-6 bg-white text-black rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl active:scale-95 transition-all">
              Proceed to Metadata
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            <input type="text" placeholder="TITLE" className="w-full bg-zinc-900 border border-white/5 rounded-3xl p-6 text-white font-black uppercase italic outline-none focus:border-pink-500" value={metadata.title} onChange={e => setMetadata({...metadata, title: e.target.value})} />
            <input type="text" placeholder="ARTIST / BRAND" className="w-full bg-zinc-900 border border-white/5 rounded-3xl p-6 text-white font-black uppercase italic outline-none focus:border-cyan-400" value={metadata.artist} onChange={e => setMetadata({...metadata, artist: e.target.value})} />
            
            {postType === 'marketplace' && (
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="£0.00" className="w-full bg-zinc-900 border border-white/5 rounded-3xl p-6 text-white font-black outline-none focus:border-cyan-400" value={metadata.price} onChange={e => setMetadata({...metadata, price: e.target.value})} />
                <select className="w-full bg-zinc-900 border border-white/5 rounded-3xl p-6 text-[10px] font-black text-white uppercase outline-none" value={metadata.category} onChange={e => setMetadata({...metadata, category: e.target.value})}>
                  <option>Records</option><option>Gear</option><option>Artifacts</option>
                </select>
              </div>
            )}

            <textarea placeholder="DESCRIPTION & MEMORIES..." className="w-full h-32 bg-zinc-900 border border-white/5 rounded-[2rem] p-6 text-zinc-400 font-medium outline-none resize-none focus:border-white/20 shadow-inner" value={metadata.description} onChange={e => setMetadata({...metadata, description: e.target.value})} />
            
            <button onClick={handlePost} className={`w-full ${postType === 'marketplace' ? 'bg-cyan-400' : 'bg-pink-600'} text-white py-7 rounded-[2.5rem] font-black uppercase text-sm tracking-widest shadow-2xl active:scale-95 transition-all`}>
              Initialize Broadcast
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadWizard;
