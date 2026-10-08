import { getAuth } from 'firebase/auth';
import { app } from './firebase';

// Kept out of firebase.ts so public pages don't pull in the auth SDK and its iframe.
export const auth = getAuth(app);
