// src/navigation/AppNavigator.js
import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import { useSelector, useDispatch } from 'react-redux';

// Navigators
import AuthNavigator from './AuthNavigator';
import HomeNavigator from './HomeNavigator';

// Additional screens
import SplashScreen from '../screens/SplashScreen';
import { setUser, clearUser } from '../redux/slices/authSlice';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // Handle user state changes
    const subscriber = auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        // User is signed in
        dispatch(setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        }));
      } else {
        // User is signed out
        dispatch(clearUser());
      }
      
      if (initializing) {
        setInitializing(false);
      }
    });

    // Unsubscribe on unmount
    return subscriber;
  }, [dispatch, initializing]);

  if (initializing) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Home" component={HomeNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;