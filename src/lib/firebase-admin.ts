import admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountKey) {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error) {
      console.error("Error parsing FIREBASE_SERVICE_ACCOUNT_KEY, falling back to default initialization:", error);
      admin.initializeApp();
    }
  } else {
    // In a deployed environment, Application Default Credentials should be available.
    console.log("Initializing Firebase Admin SDK without explicit credentials.");
    admin.initializeApp();
  }
}

export const auth = admin.auth();
export const db = admin.firestore();
