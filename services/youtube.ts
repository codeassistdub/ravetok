
// STRICT RULE: API keys must be accessed via process.env. Never hardcode keys.
// STRICT RULE: All API calls must filter for videoCategoryId='10' (Music).
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || process.env.API_KEY;

export const searchYouTube = async (query: string) => {
  if (!query || typeof query !== 'string' || query.trim().length === 0) return [];

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query + ' rave old skool'
      )}&type=video&videoCategoryId=10&maxResults=10&key=${YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) {
      console.warn("YouTube API Service unreachable.");
      return [];
    }

    const data = await response.json();

    if (!data) {
      return [];
    }

    if (data.error) {
      console.error('YouTube Data API Error:', data.error);
      return [];
    }

    if (!data.items || !Array.isArray(data.items)) {
      return [];
    }

    return data.items
      .filter((item: any) => item && item.id && item.id.videoId && item.snippet) 
      .map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title || 'Unknown Title',
        artist: item.snippet.channelTitle || 'Unknown Artist',
        type: 'youtube',
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
        youtubeId: item.id.videoId,
        metadata: {
          publishedAt: item.snippet.publishedAt,
          description: item.snippet.description
        }
      }));
  } catch (error) {
    console.error('Failed to search YouTube (Network or Parse Error):', error);
    return [];
  }
};
