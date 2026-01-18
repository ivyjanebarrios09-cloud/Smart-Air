"use client";

import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { firebaseConfig } from "./config";

// Re-export hooks and providers
export {
  FirebaseProvider,
  useFirebaseApp,
  useAuth,
  useFirestore,
  useFirebase,
} from "./provider";
export { FirebaseClientProvider } from "./client-provider";
export { useUser } from "./auth/use-user";
export { useDoc } from "./firestore/use-doc";
export { useCollection } from "./firestore/use-collection";

type FirebaseInstances = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

let firebaseInstances: FirebaseInstances | null = null;

export function initializeFirebase(): FirebaseInstances {
  if (firebaseInstances) {
    return firebaseInstances;
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  firebaseInstances = { app, auth, firestore };
  return firebaseInstances;
}
