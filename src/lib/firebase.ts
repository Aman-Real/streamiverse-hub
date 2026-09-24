import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from "firebase/firestore";
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
 */
export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(firebaseApp);

/**
 * Firestore with an on-device cache shared by every open tab: repeat visits read from the cache,
 * and writes made offline sync once the connection returns. ignoreUndefinedProperties drops unset
 * optional fields instead of rejecting the whole write.
 * initializeFirestore can only run once per app, so on hot reload the existing instance is reused.
 */
const createFirestore = (): Firestore => {
  try {
    return initializeFirestore(firebaseApp, {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
      ignoreUndefinedProperties: true,
    });
  } catch {
    return getFirestore(firebaseApp);
  }
};

export const db = createFirestore();
