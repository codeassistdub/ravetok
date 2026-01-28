
import React, { useState } from 'react';
import { X, Send, MessageSquare, History, Sparkles } from 'lucide-react';
import { Post, Comment, User as UserType } from '../types';

interface CommentsModalProps {
  post: Post;
  currentUser: UserType;
  onClose: () => void;
  onAddComment: (postId: string, comment: Comment) => void;
}

const CommentsModal: React.FC<CommentsModalProps> = ({ post, currentUser, onClose, onAddComment }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newComment: Comment = {
      id: `c_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      text: text.trim(),
      timestamp: 'Just now',
      likes: 0
    };

    onAddComment(post.id, newComment);
    setText('');
  };

  return (
    <div className="fixed inset-0 z-[800] bg-black/90 backdrop-blur-2xl flex items-end justify-center animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="w-full max-w-md bg-zinc-950 border-t border-white/10 rounded-t-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,1)] relative z-10 flex flex-col h-[85vh] animate-in slide-in-from-bottom duration-500">
        {/* HEADER */}
        <div className="flex flex-col items-center pt-3 pb-6 border-b border-white/5 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-20">
          <div className="w-12 h-1.5 bg-zinc-800 rounded-full mb-6" />
          <div className="w-full px-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <History className="w-6 h-6 text-pink-500" />
              <div>
                <h2 className="rave-font text-2xl text-white italic uppercase tracking-tighter">RAVE STORIES</h2>
                <p className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mt-0.5">Where the memories live</p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 bg-zinc-900 rounded-2xl text-zinc-500 active:scale-90 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* COMMENTS LIST */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
          {(!post.comments || post.comments.length === 0) ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
              <div className="relative">
                <MessageSquare className="w-20 h-20 text-zinc-800" />
                <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-pink-500 animate-pulse" />
              </div>
              <div className="space-y-2">
                <p className="rave-font text-xl text-white italic uppercase tracking-widest">A Silent Archive</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 max-w-[200px] leading-relaxed">
                  Every classic track has a story. Be the first to share yours.
                </p>
              </div>
            </div>
          ) : (
            post.comments.map((comment) => (
              <div key={comment.id} className="flex space-x-5 animate-in fade-in slide-in-from-bottom duration-400">
                <img src={comment.userAvatar} className="w-12 h-12 rounded-full border-2 border-pink-500/30 object-cover shrink-0 shadow-lg" alt="" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-pink-500 uppercase italic tracking-wider">@{comment.username}</span>
                    <span className="text-[8px] text-zinc-700 font-bold uppercase tracking-widest">{comment.timestamp}</span>
                  </div>
                  <div className="bg-zinc-900/40 border border-white/5 p-5 rounded-3xl rounded-tl-none relative overflow-hidden">
                    <p className="text-sm text-zinc-200 leading-relaxed font-medium selection:bg-pink-500/30">
                      {comment.text}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* INPUT AREA */}
        <div className="p-8 bg-zinc-950 border-t border-white/5 pb-12 sticky bottom-0 z-20">
          <form onSubmit={handleSubmit} className="relative flex flex-col space-y-4">
            <div className="relative group">
              <textarea 
                placeholder="Share your rave memory..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-[2rem] py-6 px-7 text-sm text-white font-medium outline-none focus:border-pink-500/50 transition-all placeholder:text-zinc-700 italic resize-none h-32"
                value={text}
                onChange={e => setText(e.target.value)}
              />
              <div className="absolute right-4 bottom-4 flex items-center space-x-3">
                 <button 
                  type="submit"
                  disabled={!text.trim()}
                  className="p-5 bg-white text-black rounded-3xl shadow-xl active:scale-95 transition-all disabled:opacity-10 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  <Send className="w-5 h-5" strokeWidth={3} />
                </button>
              </div>
            </div>
            <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest text-center italic">
               Broadcast your story to the global archive
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
