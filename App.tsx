// src/App.tsx
import React, { useEffect, useState } from 'react';
import { StatusBar, LogBox, Platform, View, Text } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import { Provider as PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import NetInfo from '@react-native-community/netinfo';

// App specific imports
// import store from './redux/store';
// import AppNavigator from './navigation/AppNavigator';
// import { theme } from './config/theme';
// import { checkAuthStatus } from './redux/slices/authSlice';

// Firebase initialization
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { store } from './src/redux/store';
import theme from './src/config/theme';
import AppNavigator from './src/navigation/AppNavigator';
// import messaging from '@react-native-firebase/messaging';

// Ignore specific warnings
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested',
  'Setting a timer',
  'AsyncStorage has been extracted from react-native',
]);

const App: React.FC = () => {
  const [initializing, setInitializing] = useState(true);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  // Handle connection state changes
  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener(state => {
  //     setIsConnected(state.isConnected);
  //   });
    
  //   // Initial fetch of connection status
  //   NetInfo.fetch().then(state => {
  //     setIsConnected(state.isConnected);
  //   });

  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  // Handle Firebase authentication state
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async (user) => {
      if (user) {
        // Dispatch user data to Redux store
        store.dispatch(checkAuthStatus());
      }
      
      if (initializing) {
        setInitializing(false);
      }
    });

    return subscriber; // unsubscribe on unmount
  }, [initializing]);

  // Request notification permissions if on iOS
  useEffect(() => {
    if (Platform.OS === 'ios') {
      messaging()
        .requestPermission()
        .then(authStatus => {
          console.log('Authorization status:', authStatus);
        })
        .catch(error => {
          console.log('Permission request error:', error);
        });
    }
  }, []);

  // Setup Firebase messaging
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
      // Handle foreground notifications here
    });

    return unsubscribe;
  }, []);

  // Hide splash screen once initialized
  useEffect(() => {
    if (!initializing) {
      SplashScreen.hide();
    }
  }, [initializing]);

  // Show loading screen while initializing
  if (initializing) {
    return null; // Let the native splash screen handle this
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <SafeAreaProvider>
            <NavigationContainer>
              <StatusBar
                barStyle="dark-content"
                backgroundColor={theme.COLORS.background}
              />
              {!isConnected && (
                <View style={{
                  backgroundColor: '#f44336',
                  padding: 5,
                  alignItems: 'center'
                }}>
                  <View style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    padding: 8,
                    borderRadius: 4,
                    width: '100%',
                    alignItems: 'center' 
                  }}>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <View style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#f44336',
                        marginRight: 8
                      }} />
                      <Text style={{ color: '#f44336', fontSize: 12 }}>
                        No internet connection
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              <AppNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        </PaperProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;