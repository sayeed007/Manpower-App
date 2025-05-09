import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  phoneNumber?: string;
  photoURL?: string;
  role: 'admin' | 'user' | 'worker';
  createdAt: Date | null;
  lastLoginAt: Date | null;
  status: 'active' | 'inactive';
}

interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const userDoc = await firestore().collection('users').doc(userId).get();
      
      if (!userDoc.exists) {
        return rejectWithValue('User profile not found');
      }
      
      const userData = userDoc.data() as Omit<UserProfile, 'id'>;
      return { id: userDoc.id, ...userData };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async ({ userId, profileData }: { userId: string; profileData: Partial<UserProfile> }, { rejectWithValue }) => {
    try {
      await firestore().collection('users').doc(userId).update({
        ...profileData,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      
      const updatedDoc = await firestore().collection('users').doc(userId).get();
      return { id: updatedDoc.id, ...updatedDoc.data() } as UserProfile;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
    setUserProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUserProfile, setUserProfile } = userSlice.actions;

export default userSlice.reducer;