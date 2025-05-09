import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Button, Text } from 'react-native-paper';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';

import FormContainer from '../../components/forms/FormContainer';
import FormField from '../../components/forms/FormField';
import { colors } from '../../constants/colors';
import { signIn } from '../../redux/slices/authSlice';
import { fetchUserProfile } from '../../redux/slices/userSlice';

type SignUpFormData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
};

type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

type SignUpScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignUp'>;

interface SignUpScreenProps {
  navigation: SignUpScreenNavigationProp;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, watch, formState: { errors } } = useForm<SignUpFormData>();
  
  const password = watch('password');

  const handleSignUp = async (data: SignUpFormData) => {
    try {
      setLoading(true);
      
      // Create user with email and password
      const userCredential = await auth().createUserWithEmailAndPassword(data.email, data.password);
      const user = userCredential.user;
      
      // Update display name
      await user.updateProfile({
        displayName: data.fullName,
      });
      
      // Create user document in Firestore
      await firestore().collection('users').doc(user.uid).set({
        displayName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        role: 'user',
        status: 'active',
        createdAt: firestore.FieldValue.serverTimestamp(),
        lastLoginAt: firestore.FieldValue.serverTimestamp(),
      });
      
      // Dispatch sign in and fetch user profile
      dispatch(signIn({ uid: user.uid, email: user.email || '' }));
      dispatch(fetchUserProfile(user.uid));
      
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Get the user ID token
      const { idToken } = await GoogleSignin.signIn();
      
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      
      // Sign-in with credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      const user = userCredential.user;
      
      // Check if user exists in Firestore
      const userDoc = await firestore().collection('users').doc(user.uid).get();
      
      if (!userDoc.exists) {
        // Create user document if it doesn't exist
        await firestore().collection('users').doc(user.uid).set({
          displayName: user.displayName || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          photoURL: user.photoURL || '',
          role: 'user',
          status: 'active',
          createdAt: firestore.FieldValue.serverTimestamp(),
          lastLoginAt: firestore.FieldValue.serverTimestamp(),
        });
      } else {
        // Update last login time
        await firestore().collection('users').doc(user.uid).update({
          lastLoginAt: firestore.FieldValue.serverTimestamp(),
        });
      }
      
      // Dispatch sign in and fetch user profile
      dispatch(signIn({ uid: user.uid, email: user.email || '' }));
      dispatch(fetchUserProfile(user.uid));
      
    } catch (error: any) {
      Alert.alert('Google Sign In Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Create Account</Text>
      </View>
      
      <FormField
        control={control}
        name="fullName"
        label="Full Name"
        icon="account"
        rules={{ 
          required: 'Full name is required',
        }}
      />
      
      <FormField
        control={control}
        name="email"
        label="Email"
        icon="email"
        autoCapitalize="none"
        keyboardType="email-address"
        rules={{ 
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          }
        }}
      />
      
      <FormField
        control={control}
        name="phoneNumber"
        label="Phone Number"
        icon="phone"
        keyboardType="phone-pad"
        rules={{ 
          required: 'Phone number is required',
        }}
      />
      
      <FormField
        control={control}
        name="password"
        label="Password"
        icon="lock"
        secureTextEntry
        rules={{ 
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters',
          }
        }}
      />
      
      <FormField
        control={control}
        name="confirmPassword"
        label="Confirm Password"
        icon="lock"
        secureTextEntry
        rules={{
          required: 'Confirm password is required',
          validate: value => value === password || 'Passwords do not match',
        }}
      />
      
      <Button
        mode="contained"
        onPress={handleSubmit(handleSignUp)}
        style={styles.button}
        labelStyle={styles.buttonText}
        loading={loading}
        disabled={loading}
      >
        Sign Up
      </Button>
      
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>
      
      <TouchableOpacity
        style={styles.googleButton}
        onPress={handleGoogleSignIn}
        disabled={loading}
      >
        <Image
          source={require('../../assets/images/google_icon.png')}
          style={styles.googleIcon}
        />
        <Text style={styles.googleButtonText}>Sign up with Google</Text>
      </TouchableOpacity>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 16,
  },
  button: {
    marginTop: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 4,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderGray,
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.textGray,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderGray,
    borderRadius: 8,
    paddingVertical: 12,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    color: colors.textDark,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: colors.textGray,
    marginRight: 4,
  },
  footerLink: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;