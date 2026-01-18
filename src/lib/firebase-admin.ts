import admin from "firebase-admin";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

if (!admin.apps.length) {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    // When running locally, initializing without credentials will still work for some features.
    // In a deployed environment, Application Default Credentials should be available.
    console.log("Initializing Firebase Admin SDK without explicit credentials.");
    admin.initializeApp();
  }
}

export const auth = admin.auth();
export const db = admin.firestore();
