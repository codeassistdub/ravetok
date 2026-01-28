
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getRaveRecommendations = async (userFavorites: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on these old skool rave tracks: ${userFavorites.join(', ')}, suggest 5 more obscure gems from 1989-1997. Return JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              artist: { type: Type.STRING },
              year: { type: Type.STRING },
              label: { type: Type.STRING },
              description: { type: Type.STRING },
            },
            required: ['title', 'artist', 'year', 'label', 'description'],
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    try {
      return JSON.parse(text);
    } catch (parseErr) {
      console.error("Gemini Recommendations JSON Parse Error:", parseErr);
      return [];
    }
  } catch (error) {
    console.error("Gemini recommendation error:", error);
    return [];
  }
};

export const mutateGenre = async (trackTitle: string, artist: string, targetGenre: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `ACT AS A MUSIC PRODUCER & AI MUTATOR. 
      Reimagine the old skool rave track "${trackTitle}" by "${artist}" as a "${targetGenre}" song. 
      How would the breakbeats, acid basslines, and rave stabs be transformed into this new genre?
      Give it a creative "Mutant Title".
      Describe the resulting sound and the visual aesthetic of this reimagined reality.
      
      Return JSON with fields: 'remixTitle', 'description', 'visualPrompt'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            remixTitle: { type: Type.STRING },
            description: { type: Type.STRING },
            visualPrompt: { type: Type.STRING }
          },
          required: ['remixTitle', 'description', 'visualPrompt']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Mutation Error:", error);
    throw error;
  }
};

export const searchRaveMultiverse = async (query: string) => {
  if (!query) return [];
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform a live search for the old skool rave track: "${query}". 
      Find real YouTube video results that allow third-party embedding. 
      
      STRICT REQUIREMENTS:
      1. Extract the EXACT 11-character YouTube video ID.
      2. Prioritize fan uploads and archive channels.
      3. Return exactly 5 high-quality results in JSON format.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              artist: { type: Type.STRING },
              label: { type: Type.STRING },
              year: { type: Type.STRING },
              type: { type: Type.STRING },
              thumbnail: { type: Type.STRING },
              youtubeId: { type: Type.STRING }
            },
            required: ['id', 'title', 'artist', 'type', 'thumbnail', 'year', 'label', 'youtubeId'],
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];

    try {
      const parsed = JSON.parse(text);
      return parsed.map((item: any) => ({
        ...item,
        thumbnail: item.thumbnail || `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`
      }));
    } catch (parseErr) {
      return [];
    }
  } catch (error) {
    return [];
  }
};
