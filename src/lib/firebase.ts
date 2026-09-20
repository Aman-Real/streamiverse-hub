import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { FIREBASE_CONFIG, MISSING_FIREBASE_ENV_VARS } from "@/config/firebase.config";

if (MISSING_FIREBASE_ENV_VARS.length > 0) {
  throw new Error(
    `Firebase isn't configured: ${MISSING_FIREBASE_ENV_VARS.join(", ")} missing. ` +
      "Add them to .env.local in the project root (next to package.json), then restart the dev server.",
  );
}

/**
 * The one Firebase app. Import services from here; never call initializeApp anywhere else.
 * getApps() keeps hot reload from initializing it twice.
 * Firestore's `db` joins this file with the first feature that stores data, so its SDK isn't shipped before then.
 */
export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(firebaseApp);
