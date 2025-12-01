"use client";

import { useEffect } from 'react';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

interface FirebaseConfigProviderProps {
  children: React.ReactNode;
  config: FirebaseConfig;
}

export default function FirebaseConfigProvider({ children, config }: FirebaseConfigProviderProps) {
  useEffect(() => {
    // Set Firebase config on window object for client-side access
    (window as any).__FIREBASE_CONFIG__ = config;
    
    console.log("🔧 Firebase config injected into window:", {
      hasApiKey: !!config.apiKey,
      hasAuthDomain: !!config.authDomain,
      hasProjectId: !!config.projectId,
    });
  }, [config]);

  return <>{children}</>;
}
