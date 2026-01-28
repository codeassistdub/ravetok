
import React, { useRef, useEffect, useState } from 'react';
import { Heart, Music, Disc, VolumeX, MessageSquare, Share2, Plus, ShoppingBag, Zap, Tag, Loader2 } from 'lucide-react';
import { Post } from '../types';
import { RAVE_VISUALS, MOCK_USERS } from '../constants';

interface VideoCardProps {
  post: Post;
  isActive: boolean;
  onLike?: (postId: string) => void;
  onFollow?: (userId: string) => void;
  onShare?: (post: Post) => void;
  onOpenComments?: (postId: string) => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
  currentUser?: any;
  onMakeOffer?: (post: Post) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ 
  post, isActive, onLike, onFollow, onShare, onOpenComments,
  isMuted = true, onToggleMute, currentUser, onMakeOffer 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLiked, setIsLiked] = useState(!!post.isLiked);
  const [isFollowing, setIsFollowing] = useState(!!post.user?.isFollowing);
  const [isLoading, setIsLoading] = useState(true);

  const isYoutube = post.videoUrl?.includes('youtube.com') || post.videoUrl?.includes('youtu.be') || !!post.youtubeId;
  const youtubeId = post.youtubeId || (post.videoUrl?.includes('v=') ? post.videoUrl.split('v=')[1]?.split('&')[0] : '');
  
  const isAudioOnly = !isYoutube && (!!post.audioUrl || !post.videoUrl || post.videoUrl === '');
  const bgImage = post.thumbnail || RAVE_VISUALS[0].replace('.mp4', '.jpg');

  useEffect(() => {
    if (isActive) {
      setIsLoading(true);
      if (!isYoutube && !isAudioOnly && post.videoUrl) {
        videoRef.current?.play().then(() => setIsLoading(false)).catch(() => {});
      } else if (isAudioOnly || post.audioUrl) {
        audioRef.current?.play().then(() => setIsLoading(false)).catch(() => {});
      } else if (isYoutube) {
        // Simple delay for youtube to load
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
      }
    } else {
      if (!isYoutube && videoRef.current) videoRef.current.pause();
      if (audioRef.current) audioRef.current.pause();
    }
  }, [isActive, isYoutube, isAudioOnly, post.audioUrl, post.videoUrl]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted;
    if (videoRef.current) videoRef.current.muted = isMuted;
  }, [isMuted]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden group" onClick={onToggleMute}>
      {/* LOADING STATE */}
      {isActive && isLoading && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black">
          <Loader2 className="w-10 h-10 text-pink-500 animate-spin mb-4" />
          <p className="rave-font text-[10px] text-white italic uppercase tracking-[0.2em]">Syncing Signal...</p>
        </div>
      )}

      {/* BACKGROUND VISUALS */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
        {isYoutube ? (
          <div className="w-full h-full pointer-events-none scale-[1.7] origin-center bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${isActive ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${youtubeId}&modestbranding=1&rel=0&iv_load_policy=3`}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        ) : (isAudioOnly || !post.videoUrl) ? (
          <div className="w-full h-full relative overflow-hidden bg-zinc-950">
            <img src={bgImage} className="w-full h-full object-cover brightness-[0.2] blur-3xl scale-125" alt="" />
            <div className="absolute inset-0 flex items-center justify-center p-12">
              <div className="relative aspect-square w-full max-w-[300px] rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
                <img src={bgImage} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            </div>
            <audio ref={audioRef} src={post.audioUrl || post.videoUrl} loop playsInline />
          </div>
        ) : (
          <video 
            ref={videoRef} 
            src={post.videoUrl} 
            className="w-full h-full object-cover" 
            loop 
            playsInline 
            onError={(e) => {
              // If blob URL is invalid (e.g. after navigation/refresh), fallback to thumbnail
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        {/* Fallback Static Thumbnail if video fails or is missing */}
        {!isYoutube && !isAudioOnly && post.videoUrl && (
          <img src={bgImage} className="absolute inset-0 w-full h-full object-cover brightness-50 z-[-1]" alt="" />
        )}
      </div>

      <div className="absolute inset-0 vhs-effect opacity-10 pointer-events-none z-10" />

      {/* USER INFO & TRACK DETAILS */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 pb-28 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-transparent">
        <div className="space-y-4 max-w-[85%] pointer-events-auto">
          <div className="flex items-center space-x-3">
             <div className="relative" onClick={(e) => e.stopPropagation()}>
                <img src={post.user?.avatar || MOCK_USERS['admin_01'].avatar} className="w-12 h-12 rounded-full border-2 border-pink-500 object-cover shadow-xl" alt="" />
                {!isFollowing && post.userId !== currentUser?.id && (
                  <button onClick={(e) => { e.stopPropagation(); setIsFollowing(true); onFollow?.(post.userId); }} className="absolute -bottom-1 -right-1 bg-white text-black rounded-full p-1 border border-black">
                    <Plus className="w-2.5 h-2.5" strokeWidth={4} />
                  </button>
                )}
             </div>
             <div>
                <p className="font-black text-white text-lg tracking-tight italic uppercase leading-none">@{post.user?.username || 'raver'}</p>
                <p className="text-[8px] text-pink-500 font-black uppercase tracking-widest italic leading-none mt-1">
                  {post.user?.role?.toUpperCase() || 'RAVER'} AUTHORITY
                </p>
             </div>
          </div>
          <p className="text-sm text-zinc-100 font-medium italic drop-shadow-lg leading-relaxed">{post.description}</p>
          <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2.5 rounded-full w-fit max-w-full">
            <Music className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
            <span className="text-[10px] font-black text-white truncate uppercase italic tracking-tighter">
              {post.trackTitle} // {post.artist}
            </span>
          </div>
        </div>
      </div>

      {/* SIDEBAR INTERACTIONS */}
      <div className="absolute right-4 bottom-28 flex flex-col items-center space-y-7 z-30" onClick={e => e.stopPropagation()}>
        <div className="flex flex-col items-center">
          <button onClick={() => { setIsLiked(!isLiked); onLike?.(post.id); }} className={`p-4 rounded-full border transition-all active:scale-125 ${isLiked ? 'bg-pink-600 border-pink-400 text-white shadow-[0_0_15px_rgba(255,0,255,0.4)]' : 'bg-black/40 border-white/10 text-white'}`}>
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-white' : ''}`} strokeWidth={2.5} />
          </button>
          <span className="text-[9px] font-black mt-1.5 uppercase text-zinc-400">{post.likes + (isLiked ? 1 : 0)}</span>
        </div>
        <div className="flex flex-col items-center">
          <button onClick={() => onOpenComments?.(post.id)} className="p-4 rounded-full bg-black/40 border border-white/10 text-white active:scale-125 transition-all">
            <MessageSquare className="w-6 h-6" strokeWidth={2.5} />
          </button>
          <span className="text-[9px] font-black text-zinc-400 mt-1.5 uppercase">Syncs</span>
        </div>
        <div className="flex flex-col items-center">
          <button onClick={() => onShare?.(post)} className="p-4 rounded-full bg-black/40 border border-white/10 text-white active:scale-110">
            <Share2 className="w-6 h-6" strokeWidth={2.5} />
          </button>
          <span className="text-[9px] font-black text-zinc-400 mt-1.5 uppercase">Signal</span>
        </div>
        <Disc className={`w-14 h-14 text-pink-500 ${isActive ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
      </div>

      {isMuted && isActive && (
        <div className="absolute top-12 right-6 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 z-50 animate-in fade-in duration-300">
           <VolumeX className="w-4 h-4 text-white/60" />
        </div>
      )}
    </div>
  );
};

export default VideoCard;
