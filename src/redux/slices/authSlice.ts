// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Initial state
const initialState = {
  user: null,
  isLoading: false,
  error: null,
};

// Login action
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const userData = await firestore().collection('users').doc(userCredential.user.uid).get();
      
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        ...userData.data(),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Register action
export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password, displayName, phoneNumber }, { rejectWithValue }) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      
      // Update profile information
      await userCredential.user.updateProfile({
        displayName,
      });
      
      // Store additional user data in Firestore
      await firestore().collection('users').doc(userCredential.user.uid).set({
        email,
        displayName,
        phoneNumber,
        role: 'user',
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName,
        phoneNumber,
        role: 'user',
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Logout action
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await auth().signOut();
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    
    // Register
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    
    // Logout
    builder.addCase(logout.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;