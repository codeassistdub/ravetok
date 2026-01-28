
import React, { useState } from 'react';
import { X, Send, Music, Zap, MessageSquarePlus } from 'lucide-react';
import { Post, User } from '../types';

interface RepostModalProps {
  user: User;
  post: Post;
  onClose: () => void;
  onConfirm: (comment: string) => void;
}

const RepostModal: React.FC<RepostModalProps> = ({ user, post, onClose, onConfirm }) => {
  const [comment, setComment] = useState('');

  const handleRepost = () => {
    onConfirm(comment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[700] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[3rem] p-8 shadow-2xl space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <MessageSquarePlus className="w-6 h-6 text-cyan-400" />
             <h2 className="rave-font text-2xl text-white italic uppercase tracking-tighter">RE-BROADCAST</h2>
          </div>
          <button onClick={onClose} className="p-3 bg-zinc-800 rounded-2xl text-zinc-400 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] ml-2">Original Signal</p>
          <div className="flex items-center space-x-4 p-4 bg-black/50 rounded-2xl border border-white/5">
             <img src={post.thumbnail} className="w-16 h-16 rounded-xl object-cover" alt="" />
             <div className="flex-1 min-w-0">
                <h4 className="font-black text-white truncate text-sm italic uppercase">{post.trackTitle}</h4>
                <p className="text-[9px] text-pink-500 font-black uppercase tracking-widest mt-1">by {post.artist}</p>
             </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-4">YOUR THOUGHTS</label>
          <textarea 
            className="w-full bg-black border border-zinc-800 rounded-2xl p-6 text-sm text-white font-medium h-32 resize-none outline-none focus:border-cyan-400 shadow-xl transition-all"
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Dial in your frequency on this track..."
            autoFocus
          />
        </div>

        <button 
          onClick={handleRepost}
          className="w-full bg-cyan-400 text-black py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center space-x-3 active:scale-95 transition-all shadow-[0_0_40px_rgba(0,255,255,0.2)]"
        >
          <span>SYNC TO TIMELINE</span>
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default RepostModal;
