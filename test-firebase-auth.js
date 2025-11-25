// Test script to verify Firebase Email/Password authentication
require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('🔧 Firebase Configuration:');
console.log('  Project ID:', firebaseConfig.projectId);
console.log('  Auth Domain:', firebaseConfig.authDomain);
console.log('  Has API Key:', !!firebaseConfig.apiKey);
console.log('');

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log('✅ Firebase initialized');
console.log('📝 Auth instance created');
console.log('');
console.log('⚠️ To test Email/Password sign-up:');
console.log('  1. Make sure Email/Password is enabled in Firebase Console');
console.log('  2. Check that you\'re in the correct Firebase project: ' + firebaseConfig.projectId);
console.log('  3. Try creating a test user with: node test-firebase-auth.js test@example.com password123');
console.log('');

// Test user creation if email and password provided
const testEmail = process.argv[2];
const testPassword = process.argv[3];

if (testEmail && testPassword) {
  console.log('🧪 Testing user creation...');
  console.log('  Email:', testEmail);
  
  createUserWithEmailAndPassword(auth, testEmail, testPassword)
    .then((userCredential) => {
      console.log('✅ SUCCESS! User created:', userCredential.user.uid);
      console.log('  Email:', userCredential.user.email);
      console.log('');
      console.log('🎉 Email/Password authentication is working correctly!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ ERROR:', error.code);
      console.error('  Message:', error.message);
      console.log('');
      
      if (error.code === 'auth/operation-not-allowed') {
        console.log('⚠️ Email/Password authentication is NOT enabled in Firebase Console');
        console.log('');
        console.log('📋 Steps to enable:');
        console.log('  1. Go to https://console.firebase.google.com/project/' + firebaseConfig.projectId + '/authentication/providers');
        console.log('  2. Click on "Email/Password"');
        console.log('  3. Toggle "Enable" to ON');
        console.log('  4. Click "Save"');
        console.log('  5. Wait 1-2 minutes for changes to propagate');
      } else if (error.code === 'auth/email-already-in-use') {
        console.log('✅ Email/Password is enabled (email already exists)');
        console.log('  Try with a different email address');
      }
      
      process.exit(1);
    });
} else {
  console.log('ℹ️ No test credentials provided');
  console.log('  Run: node test-firebase-auth.js test@example.com password123');
}
