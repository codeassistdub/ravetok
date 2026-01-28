
export type UserRole = 'fan' | 'dj' | 'label' | 'admin' | 'raver' | 'resident';

export interface Favorites {
  djs: string[];
  labels: string[];
  artists: string[];
  genres: string[];
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  role: UserRole;
  followers: number;
  following: number;
  bio?: string;
  isFollowing?: boolean;
  banner?: string;
  themeColor?: 'pink' | 'cyan' | 'green' | 'yellow';
  favorites?: Favorites;
  isPro?: boolean;
}

export type PostSource = 'upload' | 'library' | 'live' | 'youtube' | 'marketplace';

export interface Comment {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  likes: number;
}

export interface Offer {
  id: string;
  userId: string;
  amount: string;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  createdBy: string; // User ID
  isOfficial: boolean; // Admin created
  trackIds: string[]; // List of Post IDs or Library IDs
  subscriberCount: number;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  trackTitle: string;
  artist: string;
  videoUrl: string;
  youtubeId?: string;
  audioUrl?: string;
  thumbnail?: string;
  description: string;
  likes: number;
  reposts: number;
  comments: Comment[];
  offers?: Offer[];
  shares: number;
  source: PostSource;
  year?: string;
  label?: string;
  genre?: string;
  tags: string[];
  isLiked?: boolean;
  isSaved?: boolean;
  isReposted?: boolean;
  algorithmScore?: number;
  isMix?: boolean;
  duration?: string;
  shopMetadata?: {
    price: string;
    condition: string;
    category: string;
  };
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  participants: string[];
  messages: Message[];
  lastUpdate: string;
}

export interface LibraryTrack {
  id: string;
  title: string;
  artist: string;
  label: string;
  year: string;
  genre: string;
  bpm?: number;
  artwork: string;
  previewUrl: string;
  verified: boolean;
  isMix?: boolean;
  duration?: string;
  shopLink?: string;
  playLink?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  artist: string;
  type: 'library' | 'user' | 'upload' | 'youtube';
  thumbnail: string;
  youtubeId?: string;
  metadata?: any;
}
