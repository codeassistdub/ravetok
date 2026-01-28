
import { Post, LibraryTrack, User } from './types';

export const COLORS = {
  primary: '#ff00ff',
  secondary: '#00ffff',
  accent: '#ffff00',
  bg: '#000000',
};

export const RAVE_VISUALS = [
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
];

export const MOCK_USERS: Record<string, User> = {
  'admin_01': { 
    id: 'admin_01', 
    username: 'ravetok', 
    displayName: 'Master Resident', 
    avatar: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200&h=200&fit=crop', 
    role: 'resident', 
    followers: 12400, 
    following: 0, 
    bio: 'Master Resident Authority. Oversight and Global Broadcast Control.',
    themeColor: 'pink',
    banner: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&fit=crop'
  }
};

// Start with empty archives for beta testing
export const MOCK_POSTS: Post[] = [];

export const MOCK_LIBRARY: LibraryTrack[] = [];
