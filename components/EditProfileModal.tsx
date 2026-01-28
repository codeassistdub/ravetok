
import React, { useState, useRef } from 'react';
import { X, Camera, Check, Sparkles, Image as ImageIcon } from 'lucide-react';
import { User } from '../types';

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

const THEME_COLORS = [
  { id: 'pink', color: 'bg-pink-500' },
  { id: 'cyan', color: 'bg-cyan-500' },
  { id: 'green', color: 'bg-green-500' },
  { id: 'yellow', color: 'bg-yellow-500' },
] as const;

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState<User>({ ...user });
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onSave(formData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] bg-black/90 backdrop-blur-3xl flex flex-col items-center justify-center p-6 animate-in fade-in duration-300 overflow-y-auto no-scrollbar">
      <div className="w-full max-w-sm bg-zinc-900 border border-white/5 rounded-[3rem] p-8 shadow-2xl space-y-8 my-10">
        <div className="flex items-center justify-between">
          <h2 className="rave-font text-2xl text-white italic uppercase tracking-tighter">RE-LINK DNA</h2>
          <button onClick={onClose} className="p-3 bg-zinc-800 rounded-2xl text-zinc-400 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Banner Edit */}
        <div className="space-y-3">
          <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-4">BANNER FREQUENCY</label>
          <div 
            className="relative h-24 w-full rounded-2xl overflow-hidden cursor-pointer group border border-zinc-800"
            onClick={() => bannerInputRef.current?.click()}
          >
            <img src={formData.banner || 'https://images.unsplash.com/photo-1514525253361-bee8718a7439?w=800&fit=crop'} className="w-full h-full object-cover brightness-50 group-hover:brightness-75 transition-all" alt="" />
            <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'banner')} />
          </div>
        </div>

        {/* Avatar Edit */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
            <div className={`absolute -inset-2 rounded-full blur-xl opacity-30 ${formData.themeColor === 'pink' ? 'bg-pink-500' : 'bg-cyan-500'}`} />
            <img src={formData.avatar} className="relative w-24 h-24 rounded-full border-4 border-pink-500 object-cover shadow-2xl transition-all group-hover:scale-105" alt="" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'avatar')} />
          </div>
          <p className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">TAP TO CHANGE AVATAR</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-4">ALIAS</label>
            <input 
              type="text" 
              className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-sm text-white font-bold outline-none focus:border-pink-500 transition-all shadow-xl"
              value={formData.username}
              onChange={e => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s/g, '_') })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-4">NEXUS BIO</label>
            <textarea 
              className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-xs text-zinc-300 font-medium outline-none focus:border-pink-500 h-28 resize-none shadow-xl"
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell the world your rave story..."
            />
          </div>

          <div className="space-y-3">
            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-4">THEME FREQUENCY</label>
            <div className="flex justify-between px-2">
              {THEME_COLORS.map(t => (
                <button 
                  key={t.id} 
                  onClick={() => setFormData({ ...formData, themeColor: t.id })}
                  className={`w-10 h-10 rounded-full ${t.color} border-2 transition-all ${formData.themeColor === t.id ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-30 hover:opacity-100'}`} 
                />
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full bg-white text-black py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center space-x-3 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
        >
          <span>LOCK DNA SYNC</span>
          <Check className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default EditProfileModal;
