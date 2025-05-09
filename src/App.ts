// src/App.js
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';

// Firebase initialization
import '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

// Local imports
import { store } from './redux/store';
import { paperTheme } from './config/theme';
import AppNavigator from './navigation/AppNavigator';

const App = () => {
  useEffect(() => {
    // Hide splash screen after initialization
    const initApp = async () => {
      try {
        // Add any additional initialization logic here
        // (e.g., prefetching data, checking auth state)
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        SplashScreen.hide();
      }
    };

    initApp();
  }, []);

  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={paperTheme}>
        <SafeAreaProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </PaperProvider>
    </ReduxProvider>
  );
};

export default App;