import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyALHvP6odpJdSacN9_CGTikhMmRhMHjRDs",
  authDomain: "pathpilot-ai-3a774.firebaseapp.com",
  projectId: "pathpilot-ai-3a774",
  storageBucket: "pathpilot-ai-3a774.firebasestorage.app",
  messagingSenderId: "944707759538",
  appId: "1:944707759538:web:8b82987c6c782cd2de08ab",
  measurementId: "G-KV3M4BKENG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Firestore Helpers
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { UserProfile, QuestProgress } from "../../types";

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  } else {
    return null;
  }
};

export const saveUserProfile = async (userId: string, profile: UserProfile) => {
  await setDoc(doc(db, "users", userId), profile, { merge: true });
};

export const updateUserQuestProgress = async (userId: string, progress: QuestProgress) => {
  await updateDoc(doc(db, "users", userId), { questProgress: progress });
};
