import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export interface UserProfile {
  username: string;
  isAdmin: boolean;
  isActive: boolean;
}

class AuthService {
  private auth = getAuth();

  // Test Firestore connectivity
  async testFirestoreConnection(): Promise<boolean> {
    try {
      const testCollection = collection(db, 'users');
      await getDocs(testCollection);
      return true;
    } catch (error) {
      console.error('Firestore connection failed:', error);
      return false;
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string; userProfile?: UserProfile }> {
    try {
      // Test Firestore connection first
      const firestoreConnected = await this.testFirestoreConnection();
      if (!firestoreConnected) {
        return { success: false, error: 'Unable to connect to database. Please check your connection and try again.' };
      }
      
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      
      // Get additional user profile data from Firestore
      const userProfile = await this.getUserProfile(user.uid);
      
      if (!userProfile) {
        return { success: false, error: "User profile not found. Please contact administrator." };
      }

      if (!userProfile.isActive) {
        return { success: false, error: "Account is deactivated. Please contact administrator." };
      }

      return { success: true, userProfile };
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

  // Get user profile from Firestore
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          username: data.username,
          isAdmin: data.isAdmin,
          isActive: data.isActive
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Return null instead of throwing error
      return null;
    }
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