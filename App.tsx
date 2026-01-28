
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Home, Disc, Shield, ShoppingBag, Wifi, WifiOff, Search, MessageCircle, User as UserIcon, Plus, Radio, LogOut } from 'lucide-react';
import { MOCK_POSTS, MOCK_USERS, RAVE_VISUALS, MOCK_LIBRARY } from './constants';
import { Post, User as UserType, Comment, LibraryTrack } from './types';
import VideoCard from './components/VideoCard';
import Library from './components/Library';
import LandingPage from './components/LandingPage';
import Onboarding from './components/Onboarding';
import AdminDashboard from './components/AdminDashboard';
import SearchOverlay from './components/SearchOverlay';
import ShareModal from './components/ShareModal';
import CommentsModal from './components/CommentsModal';
import Marketplace from './components/Marketplace';
import MarketplaceOfferModal from './components/MarketplaceOfferModal';
import Messaging from './components/Messaging';
import ProfilePage from './components/ProfilePage';
import UploadWizard from './components/UploadWizard';

// Firebase Imports
import { db, broadcastSignal, syncEngagement, postComment, isConnected } from './services/firebase';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, writeBatch, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

type Tab = 'feed' | 'library' | 'messages' | 'market' | 'profile' | 'admin';

const App: React.FC = () => {
  const sanitizePost = (p: any): Post | null => {
    if (!p) return null;
    const postUser = p.user || MOCK_USERS['admin_01'];
    return {
      id: p.id || `post_${Date.now()}_${Math.random()}`,
      userId: p.userId || postUser.id,
      user: postUser,
      trackTitle: p.trackTitle || 'Unknown Signal',
      artist: p.artist || 'Unknown Archivist',
      videoUrl: p.videoUrl || '',
      youtubeId: p.youtubeId || '',
      audioUrl: p.audioUrl || '',
      thumbnail: p.thumbnail || '',
      description: p.description || '',
      likes: Number(p.likes || 0),
      reposts: Number(p.reposts || 0),
      comments: Array.isArray(p.comments) ? p.comments : [],
      shares: Number(p.shares || 0),
      source: p.source || 'upload',
      tags: Array.isArray(p.tags) ? p.tags : ['rave'],
      isLiked: !!p.isLiked,
      isSaved: !!p.isSaved,
      isReposted: !!p.isReposted,
      isMix: !!p.isMix
    };
  };

  const [currentUser, setCurrentUser] = useState<UserType | null>(() => {
    try {
      const saved = localStorage.getItem('ravetok_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('ravetok_auth') === 'true';
  });

  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    return localStorage.getItem('ravetok_onboarded') === 'true';
  });
  
  const [activeTab, setActiveTab] = useState<Tab>('feed');
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);

  const [cloudPosts, setCloudPosts] = useState<Post[]>([]);
  const [localPosts, setLocalPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem('ravetok_local_posts');
      // If we are starting fresh as requested, we might want this to be []
      // But we respect existing storage if it exists unless we manually clear.
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [deletedPostIds, setDeletedPostIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('ravetok_deleted_ids');
      return new Set(saved ? JSON.parse(saved) : []);
    } catch (e) { return new Set(); }
  });

  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);
  const [sharingPost, setSharingPost] = useState<Post | null>(null);
  const [offeringPost, setOfferingPost] = useState<Post | null>(null);

  const posts = useMemo(() => {
    const uniqueMap = new Map<string, Post>();
    
    // EXCLUDE MOCK POSTS to satisfy "start fresh"
    cloudPosts.forEach(p => { const sp = sanitizePost(p); if (sp) uniqueMap.set(sp.id, sp); });
    localPosts.forEach(p => { const sp = sanitizePost(p); if (sp) uniqueMap.set(sp.id, sp); });
    
    return Array.from(uniqueMap.values())
      .filter(p => !deletedPostIds.has(p.id))
      .sort((a, b) => b.id.localeCompare(a.id));
  }, [localPosts, cloudPosts, deletedPostIds]);

  const commentingPost = useMemo(() => 
    posts.find(p => p.id === commentingPostId), 
    [posts, commentingPostId]
  );

  const handleLike = (postId: string) => {
    if (isLive) syncEngagement(postId, 'likes');
    setLocalPosts(prev => {
      return prev.map(p => p.id === postId ? { ...p, likes: (p.likes || 0) + 1, isLiked: true } : p);
    });
  };

  useEffect(() => {
    if (!db || !isConnected) return;
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      setCloudPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Post[]);
      setIsLive(true);
    }, () => setIsLive(false));
  }, []);

  // Use a ref to track if we're doing the first render to avoid clearing localPosts by accident
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (!isFirstRender.current) {
      localStorage.setItem('ravetok_local_posts', JSON.stringify(localPosts));
    }
    isFirstRender.current = false;
  }, [localPosts]);

  const handleAddPost = (postData: any) => {
    if (!currentUser) return;
    const newPost = sanitizePost({
      id: `post_${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      ...postData,
      likes: 0,
      reposts: 0,
      comments: [],
      shares: 0,
    })!;

    if (isLive) broadcastSignal(newPost);
    setLocalPosts(prev => [newPost, ...prev]);
    setIsUploadOpen(false);
    setActiveTab('feed');
  };

  const handleClearArchive = async () => {
    if (!confirm("CRITICAL: Wipe entire global and local archive? This cannot be undone.")) return;
    
    setLocalPosts([]);
    setCloudPosts([]);
    localStorage.removeItem('ravetok_local_posts');
    
    if (isLive && db) {
      try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        const batch = writeBatch(db);
        querySnapshot.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
      } catch (e) {
        console.error("Cloud wipe failed:", e);
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('ravetok_auth');
    localStorage.removeItem('ravetok_user');
    localStorage.removeItem('ravetok_onboarded');
    localStorage.removeItem('ravetok_local_posts'); // Also clear local posts on logout for fresh start
  };

  if (!isAuthenticated) return <LandingPage onLogin={(userData) => {
    if (userData) {
      setCurrentUser(userData);
      localStorage.setItem('ravetok_user', JSON.stringify(userData));
      const alreadyOnboarded = localStorage.getItem('ravetok_onboarded') === 'true';
      setIsOnboarded(alreadyOnboarded || !userData.isNewUser);
    }
    setIsAuthenticated(true);
    localStorage.setItem('ravetok_auth', 'true');
  }} />;

  if (!isOnboarded) return <Onboarding onComplete={(u) => {
    setCurrentUser(u);
    setIsOnboarded(true);
    localStorage.setItem('ravetok_user', JSON.stringify(u));
    localStorage.setItem('ravetok_onboarded', 'true');
    setActiveTab('feed');
  }} />;

  const isAuthority = currentUser?.role === 'resident' || currentUser?.role === 'admin';

  return (
    <div className="flex flex-col h-[100dvh] bg-black select-none max-w-md mx-auto relative overflow-hidden border-x border-zinc-900 shadow-2xl">
      <div className="absolute top-0 left-0 right-0 z-[60] px-6 pt-12 pb-6 flex justify-between items-center bg-gradient-to-b from-black/90 via-black/20 to-transparent">
        <div className="rave-font text-2xl text-white italic uppercase tracking-tighter drop-shadow-lg cursor-pointer" onClick={() => setActiveTab('feed')}>
          RAVE<span className="text-pink-500">TOK</span>
        </div>
        <div className="flex items-center space-x-3">
          {isAuthority && (
            <button 
              onClick={() => setActiveTab('admin')} 
              className={`p-2 rounded-full border transition-all ${activeTab === 'admin' ? 'bg-pink-500 border-pink-400 text-white' : 'bg-black/40 border-white/10 text-white'}`}
            >
              <Shield className="w-4 h-4" />
            </button>
          )}
          <button onClick={() => setIsSearchOpen(true)} className="p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white"><Search className="w-4 h-4" /></button>
          <div className={`p-1.5 rounded-full border transition-all ${isLive ? 'bg-green-500/20 border-green-500/50 shadow-[0_0_15px_#39ff14]' : 'bg-red-500/20 border-red-500/50'}`}>
            {isLive ? <Wifi className="w-3.5 h-3.5 text-green-500" /> : <WifiOff className="w-3.5 h-3.5 text-red-500" />}
          </div>
          <button onClick={handleLogout} className="p-2 bg-black/40 rounded-full border border-white/10 text-zinc-500 hover:text-white">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <main className="flex-1 relative h-full">
        {activeTab === 'feed' && (
          <div ref={feedRef} className="h-full overflow-y-scroll snap-y snap-mandatory bg-black no-scrollbar" onScroll={(e) => setActiveVideoIndex(Math.round(e.currentTarget.scrollTop / e.currentTarget.clientHeight))}>
            {posts.map((post, idx) => (
              <div key={post.id} className="h-full w-full snap-start relative">
                <VideoCard post={post} isActive={activeVideoIndex === idx} onLike={handleLike} onOpenComments={setCommentingPostId} onShare={setSharingPost} isMuted={isMuted} onToggleMute={() => setIsMuted(!isMuted)} currentUser={currentUser} />
              </div>
            ))}
            {posts.length === 0 && (
               <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-40">
                  <Disc className="w-16 h-16 text-zinc-800 animate-spin-slow mb-6" />
                  <p className="rave-font text-xl text-white uppercase italic">Archive Empty</p>
                  <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-2">Initialize a new signal broadcast</p>
               </div>
            )}
          </div>
        )}
        {activeTab === 'library' && <Library tracks={MOCK_LIBRARY} />}
        {activeTab === 'messages' && <Messaging currentUser={currentUser!} />}
        {activeTab === 'market' && <Marketplace posts={posts} currentUser={currentUser!} onMakeOffer={setOfferingPost} />}
        {activeTab === 'profile' && <ProfilePage user={currentUser!} onLogout={handleLogout} />}
        {activeTab === 'admin' && <AdminDashboard onAddPost={handleAddPost} onDeletePost={(id) => setDeletedPostIds(prev => new Set(prev).add(id))} onClearAll={handleClearArchive} posts={posts} library={[]} onAddLibrary={() => {}} isLive={isLive} />}
      </main>

      <nav className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-2xl border-t border-white/5 px-4 pb-10 pt-4 flex justify-between items-center z-[110] safe-pb">
        <button onClick={() => setActiveTab('feed')} className={`flex flex-col items-center space-y-1 flex-1 ${activeTab === 'feed' ? 'text-pink-500' : 'text-zinc-600'}`}><Home className="w-6 h-6" /><span className="text-[8px] font-black uppercase">Nexus</span></button>
        <button onClick={() => setActiveTab('library')} className={`flex flex-col items-center space-y-1 flex-1 ${activeTab === 'library' ? 'text-cyan-400' : 'text-zinc-600'}`}><Disc className="w-6 h-6" /><span className="text-[8px] font-black uppercase">Archive</span></button>
        
        <div className="flex-1 flex justify-center -mt-8">
          <button 
            onClick={() => setIsUploadOpen(true)} 
            className="w-16 h-16 bg-gradient-to-tr from-pink-600 to-cyan-500 rounded-full p-0.5 shadow-[0_0_30px_rgba(255,0,255,0.4)] active:scale-90 transition-all group"
          >
            <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
              <Plus className="w-8 h-8 text-white group-hover:rotate-90 transition-transform duration-300" />
            </div>
          </button>
        </div>

        <button onClick={() => setActiveTab('messages')} className={`flex flex-col items-center space-y-1 flex-1 ${activeTab === 'messages' ? 'text-cyan-400' : 'text-zinc-600'}`}><MessageCircle className="w-6 h-6" /><span className="text-[8px] font-black uppercase">Comms</span></button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center space-y-1 flex-1 ${activeTab === 'profile' ? 'text-pink-500' : 'text-zinc-600'}`}><UserIcon className="w-6 h-6" /><span className="text-[8px] font-black uppercase">Identity</span></button>
      </nav>

      {isSearchOpen && <SearchOverlay onClose={() => setIsSearchOpen(false)} onSelect={() => {}} />}
      {isUploadOpen && <UploadWizard onClose={() => setIsUploadOpen(false)} onPost={handleAddPost} />}
      {commentingPost && <CommentsModal post={commentingPost} currentUser={currentUser!} onClose={() => setCommentingPostId(null)} onAddComment={(pid, c) => postComment(pid, c)} />}
      {sharingPost && <ShareModal user={currentUser!} post={sharingPost} onClose={() => setSharingPost(null)} onShareToFeed={() => {}} />}
      {offeringPost && <MarketplaceOfferModal user={currentUser!} post={offeringPost} onClose={() => setOfferingPost(null)} onConfirm={(a, m) => alert('Offer Transmitted')} />}
    </div>
  );
};

export default App;
