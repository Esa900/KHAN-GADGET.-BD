import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with forced long-polling to maintain instant, rock-solid connection across all devices (mobile, tablet, desktop, mobile data & Wi-Fi)
let firestoreDb: Firestore;
try {
  firestoreDb = firebaseConfig.firestoreDatabaseId
    ? initializeFirestore(app, {
        experimentalForceLongPolling: true,
      }, firebaseConfig.firestoreDatabaseId)
    : initializeFirestore(app, {
        experimentalForceLongPolling: true,
      });
} catch {
  firestoreDb = firebaseConfig.firestoreDatabaseId
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);
}

export const db = firestoreDb;
export default app;

