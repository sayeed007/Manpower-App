import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { 
  LoginRequest, 
  SignUpRequest, 
  AuthResponse 
} from '../types/api.types';
import { UserRole } from '../types/models.types';

// Initialize Google Sign-In
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID', // Replace with your actual Web Client ID
});

/**
 * Sign in with email and password
 */
export const signInWithEmailAndPassword = async (
  { email, password }: LoginRequest
): Promise<AuthResponse> => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    const token = await userCredential.user.getIdToken();
    
    // Get user data from Firestore
    const userDoc = await firestore()
      .collection('users')
      .doc(userCredential.user.uid)
      .get();
    
    const userData = userDoc.data();
    
    return {
      token,
      user: {
        id: userCredential.user.uid,
        email: userCredential.user.email || '',
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
        role: (userData?.role as UserRole) || 'worker',
      },
    };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

/**
 * Create a new user with email and password
 */
export const createUserWithEmailAndPassword = async (
  { email, password, displayName, role }: SignUpRequest
): Promise<AuthResponse> => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    
    // Update user profile
    await userCredential.user.updateProfile({
      displayName,
    });
    
    // Store additional user info in Firestore
    await firestore()
      .collection('users')
      .doc(userCredential.user.uid)
      .set({
        email,
        displayName,
        role,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    
    const token = await userCredential.user.getIdToken();
    
    return {
      token,
      user: {
        id: userCredential.user.uid,
        email: userCredential.user.email || '',
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
        role,
      },
    };
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async (): Promise<AuthResponse> => {
  try {
    // Get the user ID token
    const { idToken } = await GoogleSignin.signIn();
    
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    
    // Sign in with the credential
    const userCredential = await auth().signInWithCredential(googleCredential);
    const token = await userCredential.user.getIdToken();
    
    // Check if user exists in Firestore
    const userDoc = await firestore()
      .collection('users')
      .doc(userCredential.user.uid)
      .get();
    
    // If user doesn't exist, create a new user document
    if (!userDoc.exists) {
      await firestore()
        .collection('users')
        .doc(userCredential.user.uid)
        .set({
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
          role: 'worker', // Default role
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
    }
    
    const userData = userDoc.data();
    
    return {
      token,
      user: {
        id: userCredential.user.uid,
        email: userCredential.user.email || '',
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
        role: (userData?.role as UserRole) || 'worker',
      },
    };
  } catch (error) {
    console.error('Google sign in error:', error);
    throw error;
  }
};

/**
 * Sign out
 */
export const signOut = async (): Promise<void> => {
  try {
    await auth().signOut();
    // Check if user signed in with Google
    if (await GoogleSignin.isSignedIn()) {
      await GoogleSignin.signOut();
    }
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

/**
 * Reset password
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await auth().sendPasswordResetEmail(email);
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async (): Promise<AuthResponse | null> => {
  const user = auth().currentUser;
  
  if (user) {
    const token = await user.getIdToken();
    
    const userDoc = await firestore()
      .collection('users')
      .doc(user.uid)
      .get();
    
    const userData = userDoc.data();
    
    return {
      token,
      user: {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: (userData?.role as UserRole) || 'worker',
      },
    };
  }
  
  return null;
};