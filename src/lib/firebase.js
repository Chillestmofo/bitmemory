import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

let app, auth, db, provider;

try {
  // Simple check to ensure we don't init with totally empty config strings
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your_api_key') {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    provider = new GoogleAuthProvider()
  }
} catch (error) {
  console.error("Firebase init error", error)
}

export { auth, db, provider }

export async function loginWithGoogle() {
  if (!auth) throw new Error("Firebase config missing or invalid")
  try {
    const result = await signInWithPopup(auth, provider)
    return result.user
  } catch (error) {
    console.error("Login failed", error)
    throw error
  }
}

export async function logoutUser() {
  if (!auth) return
  return signOut(auth)
}

export async function syncDataToCloud(uid, problems) {
  if (!db) throw new Error("Firebase config missing")
  const userRef = doc(db, 'users', uid)
  await setDoc(userRef, { problems })
}

export async function loadDataFromCloud(uid) {
  if (!db) throw new Error("Firebase config missing")
  const userRef = doc(db, 'users', uid)
  const snap = await getDoc(userRef)
  if (snap.exists()) {
    return snap.data().problems || []
  }
  return null
}
