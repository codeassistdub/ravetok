
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  updateDoc, 
  doc, 
  increment,
  arrayUnion,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCR2FI03VGKnGdFsOkBeA70MusUQOQXmE",
  authDomain: "ravetok1.firebaseapp.com",
  projectId: "ravetok1",
  storageBucket: "ravetok1.firebasestorage.app",
  messagingSenderId: "285012534369",
  appId: "1:285012534369:web:7d08ef616d70dece247620",
  measurementId: "G-N5KYTF4X0N"
};

let db: any = null;
let isConnected = false;

try {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // Optional: Analytics
  try {
    getAnalytics(app);
  } catch (e) {
    console.warn("Analytics initialization skipped.");
  }
  
  db = getFirestore(app);
  isConnected = true;
  console.log("Nexus Cloud Interface: CONNECTED to ravetok1");
} catch (e) {
  console.warn("Nexus Cloud Interface: STANDBY (Connection Refused)", e);
  isConnected = false;
}

export { db, isConnected };

/**
 * Broadcasts a new post to the global feed.
 */
export const broadcastSignal = async (postData: any) => {
  if (!db || !isConnected) return null;
  try {
    return await addDoc(collection(db, "posts"), {
      ...postData,
      likes: postData.likes || 0,
      reposts: postData.reposts || 0,
      shares: postData.shares || 0,
      comments: postData.comments || [],
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Broadcast Error: Falling back to local downlink.", err);
    return null;
  }
};

/**
 * Increments counters (likes, etc.) on the cloud.
 */
export const syncEngagement = async (postId: string, type: 'likes' | 'reposts' | 'shares') => {
  if (!db || !isConnected || postId.startsWith('post_')) return;
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, { [type]: increment(1) });
  } catch (e) {
    console.warn("Engagement sync skipped.");
  }
};

/**
 * Appends a comment to a specific post in the cloud.
 */
export const postComment = async (postId: string, comment: any) => {
  if (!db || !isConnected || postId.startsWith('post_')) return;
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      comments: arrayUnion(comment)
    });
  } catch (e) {
    console.warn("Comment sync skipped.");
  }
};
