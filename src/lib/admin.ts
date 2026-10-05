import type { User } from 'firebase/auth';

// Firebase Auth UIDs allowed into the admin dashboard.
// Keep in sync with isOwner() in firestore.rules, which is what actually protects the data.
export const ADMIN_UIDS = ['x4BowypLZRSJ3ptp8CbFuafSFjj1'];

export function isAdmin(user: User | null): boolean {
  return !!user && ADMIN_UIDS.includes(user.uid);
}
