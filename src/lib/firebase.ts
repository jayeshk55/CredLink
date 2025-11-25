import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Debug: Log configuration (without sensitive data)
if (typeof window !== 'undefined') {
  console.log('🔧 Firebase Config Check:', {
    hasApiKey: !!firebaseConfig.apiKey,
    hasAuthDomain: !!firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
  });
}

const hasFirebaseConfig = Boolean(firebaseConfig.apiKey);

let auth: ReturnType<typeof getAuth> | null = null;
if (hasFirebaseConfig) {
  // Reuse app on HMR to avoid re-initialization errors
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  
  if (typeof window !== 'undefined') {
    console.log('✅ Firebase initialized successfully');
    console.log('🔐 Auth instance:', auth ? 'Available' : 'Not available');
  }
} else {
  if (typeof console !== 'undefined') {
    // Avoid failing builds when env vars are missing (e.g., CI/prerender)
    console.warn("⚠️ Missing Firebase config. Auth features will be disabled until env vars are provided.");
  }
}

export { auth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword };
