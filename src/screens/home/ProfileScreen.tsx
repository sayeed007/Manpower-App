import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { Text, Avatar, Button, List, Divider, ActivityIndicator } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { RootState } from '../../redux/store';
import { colors } from '../../constants/colors';
import { updateUserProfile } from '../../redux/slices/userSlice';
import { signOut } from '../../redux/slices/authSlice';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.user.profile);
  const loading = useSelector((state: RootState) => state.user.loading);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          onPress: async () => {
            try {
              await auth().signOut();
              dispatch(signOut());
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const handleUploadImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 500,
        maxHeight: 500,
      });

      if (result.didCancel || !result.assets || result.assets.length === 0) {
        return;
      }

      const { uri, fileName, type } = result.assets[0];
      
      if (!uri || !fileName) {
        throw new Error('Invalid image selected');
      }

      setUploading(true);
      setUploadProgress(0);

      // Create reference
      const reference = storage().ref(`profile_images/${auth().currentUser?.uid}`);

      // Upload file
      const task = reference.putFile(uri);

      // Monitor upload progress
      task.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      });

      // Complete the upload
      await task;

      // Get download URL
      const downloadUrl = await reference.getDownloadURL();

      // Update user profile
      if (auth().currentUser) {
        await auth().currentUser.updateProfile({
          photoURL: downloadUrl,
        });
  
        // Update in Firestore via Redux
        dispatch(
          updateUserProfile({
            userId: auth().currentUser.uid,
            profileData: { photoURL: downloadUrl },
          })
        );
      }

    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleUploadImage} disabled={uploading}>
          {user.photoURL ? (
            <Avatar.Image
              source={{ uri: user.photoURL }}
              size={120}
              style={styles.avatar}
            />
          ) : (
            <Avatar.Icon
              icon="account"
              size={120}
              style={styles.avatar}
              color={colors.white}
            />
          )}
          {uploading && (
            <View style={styles.uploadingOverlay}>
              <Text style={styles.uploadingText}>{Math.floor(uploadProgress)}%</Text>
            </View>
          )}
          <View style={styles.cameraIcon}>
            <Icon name="camera" size={20} color={colors.white} />
          </View>
        </TouchableOpacity>
        <Text style={styles.name}>{user.displayName}</Text>
        <Text style={styles.role}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <List.Item
          title="Email"
          description={user.email}
          left={props => <List.Icon {...props} icon="email" color={colors.primary} />}
        />
        <Divider />
        <List.Item
          title="Phone"
          description={user.phoneNumber || 'Not provided'}
          left={props => <List.Icon {...props} icon="phone" color={colors.primary} />}
        />
        <Divider />
        <List.Item
          title="Member Since"
          description={formatDate(user.createdAt)}
          left={props => <List.Icon {...props} icon="calendar" color={colors.primary} />}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <List.Item
          title="Edit Profile"
          left={props => <List.Icon {...props} icon="account-edit" color={colors.primary} />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('EditProfile' as never)}
        />
        <Divider />
        <List.Item
          title="Change Password"
          left={props => <List.Icon {...props} icon="lock" color={colors.primary} />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('ChangePassword' as never)}
        />
        <Divider />
        <List.Item
          title="Notifications"
          left={props => <List.Icon {...props} icon="bell" color={colors.primary} />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('Notifications' as never)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <List.Item
          title="Help Center"
          left={props => <List.Icon {...props} icon="help-circle" color={colors.primary} />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('HelpCenter' as never)}
        />
        <Divider />
        <List.Item
          title="Contact Us"
          left={props => <List.Icon {...props} icon="message" color={colors.primary} />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('ContactUs' as never)}
        />
      </View>

      <Button
        mode="outlined"
        onPress={handleSignOut}
        style={styles.signOutButton}
        icon="logout"
        labelStyle={styles.signOutButtonText}
      >
        Sign Out
      </Button>

      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
  avatar: {
    backgroundColor: colors.primary,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    color: colors.textDark,
  },
  role: {
    fontSize: 16,
    color: colors.primary,
    marginTop: 4,
  },
  section: {
    backgroundColor: colors.white,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  signOutButton: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
    borderColor: colors.error,
    borderWidth: 1,
  },
  signOutButtonText: {
    color: colors.error,
  },
  appInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  appVersion: {
    fontSize: 12,
    color: colors.textGray,
  },
});

export default ProfileScreen;