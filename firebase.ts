
/**
 * MOCK FIREBASE SERVICE
 * This file simulates Firebase Auth to ensure the app works without real API keys.
 */

// Mock User Type
export interface MockUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

// Simulating Auth State
let authStateListener: ((user: MockUser | null) => void) | null = null;

const getSavedUser = (): MockUser | null => {
  const saved = localStorage.getItem('gemini_forms_user');
  return saved ? JSON.parse(saved) : null;
};

export const auth = {
  get currentUser() {
    return getSavedUser();
  }
};

export const onAuthStateChanged = (authObj: any, callback: (user: MockUser | null) => void) => {
  authStateListener = callback;
  // Trigger initial state
  setTimeout(() => callback(getSavedUser()), 100);
  return () => { authStateListener = null; };
};

export const signInWithGoogle = async () => {
  // Simulate a delay for realism
  return new Promise<MockUser>((resolve) => {
    setTimeout(() => {
      const mockUser: MockUser = {
        uid: 'user_123456789',
        email: 'demo.user@example.com',
        displayName: 'Demo Admin',
        photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
      };
      localStorage.setItem('gemini_forms_user', JSON.stringify(mockUser));
      if (authStateListener) authStateListener(mockUser);
      resolve(mockUser);
    }, 800);
  });
};

export const logout = async () => {
  localStorage.removeItem('gemini_forms_user');
  if (authStateListener) authStateListener(null);
};

// Firestore is mocked in formService.ts
export const db = {}; 
