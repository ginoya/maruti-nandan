import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, type User } from "firebase/auth";

export interface UserProfile {
  username: string;
  isAdmin: boolean;
  isActive: boolean;
}

class AuthService {
  private auth = getAuth();



  // Sign in with email and password
  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string; userProfile?: UserProfile }> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      
      console.log('Firebase authentication successful for user:', user.uid);
      
      // Create a default profile for any authenticated user
      const defaultProfile: UserProfile = {
        username: user.email || 'Unknown User',
        isAdmin: false,
        isActive: true
      };
      
      console.log('Created default profile for authenticated user:', defaultProfile);
      return { success: true, userProfile: defaultProfile };
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      // Handle specific Firebase auth errors
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          return { success: false, error: 'Invalid email or password' };
        case 'auth/invalid-email':
          return { success: false, error: 'Invalid email format' };
        case 'auth/too-many-requests':
          return { success: false, error: 'Too many failed attempts. Please try again later.' };
        case 'auth/network-request-failed':
          return { success: false, error: 'Network error. Please check your connection.' };
        default:
          return { success: false, error: 'An error occurred during sign in. Please try again.' };
      }
    }
  }

  // Sign out user
  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Sign out error:', error);
      // Don't throw error, just log it
    }
  }

  // Get current authenticated user
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }



  // Listen to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(this.auth, callback);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }
}

export const authService = new AuthService(); 