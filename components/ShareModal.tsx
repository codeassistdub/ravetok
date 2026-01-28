
import React from 'react';
import { X, Share2, Link, MessageSquarePlus, Send, MessageCircle, Twitter, Instagram, Copy, Check } from 'lucide-react';
import { Post, User } from '../types';

interface ShareModalProps {
  user: User;
  post: Post;
  onClose: () => void;
  onShareToFeed: (post: Post) => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ user, post, onClose, onShareToFeed }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    { 
      id: 'feed', 
      label: 'Share to Feed', 
      icon: MessageSquarePlus, 
      color: 'bg-pink-600', 
      description: 'Preserve frequency on your profile',
      action: () => {
        onShareToFeed(post);
        onClose();
      }
    },
    { 
      id: 'copy', 
      label: copied ? 'Link Copied!' : 'Copy Link', 
      icon: copied ? Check : Link, 
      color: 'bg-zinc-800', 
      description: 'Copy source URL to clipboard',
      action: handleCopyLink 
    },
  ];

  const socialOptions = [
    { icon: MessageCircle, label: 'WhatsApp', color: 'text-green-500' },
    { icon: Send, label: 'Telegram', color: 'text-cyan-400' },
    { icon: Twitter, label: 'X / Twitter', color: 'text-white' },
    { icon: Instagram, label: 'Instagram', color: 'text-pink-400' },
  ];

  return (
    <div className="fixed inset-0 z-[800] bg-black/80 backdrop-blur-md flex items-end justify-center animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="w-full max-w-md bg-zinc-950 border-t border-white/10 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] relative z-10 flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-500 ease-out p-8 pb-12">
        {/* Drag Handle */}
        <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto mb-8" />

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3 text-white">
            <Share2 className="w-6 h-6 text-pink-500" />
            <h2 className="rave-font text-2xl italic uppercase tracking-tighter leading-none">TRANSMIT SIGNAL</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-zinc-900 rounded-full text-zinc-500 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Actions */}
        <div className="space-y-4 mb-10">
          {shareOptions.map((opt) => (
            <button 
              key={opt.id}
              onClick={opt.action}
              className="w-full p-5 bg-zinc-900 border border-white/5 rounded-[2rem] flex items-center space-x-5 group hover:border-pink-500/50 hover:bg-zinc-800 transition-all text-left"
            >
              <div className={`p-4 ${opt.color} rounded-2xl group-hover:scale-110 transition-transform`}>
                <opt.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-black text-white text-sm uppercase italic tracking-wide">{opt.label}</h4>
                <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mt-1">{opt.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Secondary / Social Grid */}
        <div className="space-y-6">
          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] text-center">External Uplinks</p>
          <div className="grid grid-cols-4 gap-4">
            {socialOptions.map((soc, idx) => (
              <button 
                key={idx}
                className="flex flex-col items-center space-y-3 group"
              >
                <div className="p-4 bg-zinc-900 border border-white/5 rounded-2xl group-hover:border-zinc-500 transition-all group-active:scale-90">
                  <soc.icon className={`w-6 h-6 ${soc.color}`} />
                </div>
                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-tighter group-hover:text-white transition-colors">
                  {soc.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Preview Footer */}
        <div className="mt-12 p-4 bg-white/5 rounded-3xl border border-white/5 flex items-center space-x-4">
          <img src={post.thumbnail} className="w-10 h-10 rounded-lg object-cover grayscale opacity-50" alt="" />
          <div className="flex-1 min-w-0">
            <p className="text-[9px] text-zinc-400 font-black uppercase tracking-widest truncate">{post.trackTitle}</p>
            <p className="text-[7px] text-zinc-600 font-black uppercase tracking-[0.2em] truncate mt-0.5">Frequency Ready for Transmission</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
