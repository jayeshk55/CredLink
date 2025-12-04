// Firebase configuration with hardcoded values for client-side
// These values will be replaced during the build process

export const firebaseConfig = {
  apiKey: '__FIREBASE_API_KEY__',
  authDomain: '__FIREBASE_AUTH_DOMAIN__', 
  projectId: '__FIREBASE_PROJECT_ID__',
  storageBucket: '__FIREBASE_STORAGE_BUCKET__',
  messagingSenderId: '__FIREBASE_MESSAGING_SENDER_ID__',
  appId: '__FIREBASE_APP_ID__',
  measurementId: '__FIREBASE_MEASUREMENT_ID__',
};

// Debug function to check configuration
export const checkFirebaseConfig = () => {
  if (typeof window !== 'undefined') {
    console.log("🔧 Firebase Config Check:", {
      hasApiKey: !!firebaseConfig.apiKey && firebaseConfig.apiKey !== '__FIREBASE_API_KEY__',
      hasAuthDomain: !!firebaseConfig.authDomain && firebaseConfig.authDomain !== '__FIREBASE_AUTH_DOMAIN__',
      hasProjectId: !!firebaseConfig.projectId && firebaseConfig.projectId !== '__FIREBASE_PROJECT_ID__',
      apiKeyPreview: firebaseConfig.apiKey && firebaseConfig.apiKey !== '__FIREBASE_API_KEY__' ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'undefined',
      authDomain: firebaseConfig.authDomain && firebaseConfig.authDomain !== '__FIREBASE_AUTH_DOMAIN__' ? firebaseConfig.authDomain : 'undefined',
      projectId: firebaseConfig.projectId && firebaseConfig.projectId !== '__FIREBASE_PROJECT_ID__' ? firebaseConfig.projectId : 'undefined',
    });
  }
  return firebaseConfig;
};
