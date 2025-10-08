// src/services/firebase.ts
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAqUtmiKTuryH866YYqNCZuHD1buVoD9vs',
  authDomain: 'leche-e373b.firebaseapp.com',
  projectId: 'leche-e373b',
  storageBucket: 'leche-e373b.firebasestorage.appspot.com',
  messagingSenderId: '654045976701',
  appId: '1:654045976701:web:862cd0ca0f7c6826d7f914',
  measurementId: 'G-WSX2GP79LK',
}

// 1️⃣ Inicializar app
const app = initializeApp(firebaseConfig)

// 2️⃣ Exportar instancias
export const db = getFirestore(app)
export const auth = getAuth(app)

// 3️⃣ Función auxiliar para autenticación anónima
export async function ensureAnonAuth(): Promise<string> {
  if (!auth.currentUser) await signInAnonymously(auth)
  return new Promise((resolve) => onAuthStateChanged(auth, (u) => u && resolve(u.uid)))
}
