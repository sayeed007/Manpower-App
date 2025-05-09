import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Text, Divider, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import Header from '../../components/common/Header';
import { logout } from '../../redux/slices/authSlice';
import { colors } from '../../constants/colors';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);
  
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationServices, setLocationServices] = useState(true);
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => dispatch(logout()),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const renderSettingItem = (
    title: string,
    icon: string,
    rightComponent?: React.ReactNode,
    onPress?: () => void,
  ) => {
    return (
      <TouchableOpacity 
        style={styles.settingItem} 
        onPress={onPress}
        disabled={!onPress}
      >
        <View style={styles.settingIconContainer}>
          <Icon name={icon} size={24} color={colors.primary} />
        </View>
        <Text style={styles.settingTitle}>{title}</Text>
        <View style={styles.settingRight}>{rightComponent}</View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Settings" showBackButton={false} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileSection}>
          <Avatar.Image 
            source={{ uri: user?.photoURL || 'https://via.placeholder.com/150' }} 
            size={80} 
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.displayName || 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            <TouchableOpacity 
              style={styles.editProfileButton}
              onPress={() => navigation.navigate('Profile' as never)}
            >
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          {renderSettingItem(
            'Push Notifications',
            'bell-outline',
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              color={colors.primary}
            />
          )}
          {renderSettingItem(
            'Dark Mode',
            'theme-light-dark',
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              color={colors.primary}
            />
          )}
          {renderSettingItem(
            'Location Services',
            'map-marker-outline',
            <Switch
              value={locationServices}
              onValueChange={setLocationServices}
              color={colors.primary}
            />
          )}
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {renderSettingItem(
            'Change Password',
            'lock-outline',
            <Icon name="chevron-right" size={24} color={colors.grey} />,
            () => navigation.navigate('Auth', { screen: 'ForgotPassword' } as never)
          )}
          {renderSettingItem(
            'Language',
            'translate',
            <View style={styles.language}>
              <Text style={styles.languageText}>English</Text>
              <Icon name="chevron-right" size={24} color={colors.grey} />
            </View>
          )}
          {renderSettingItem(
            'Privacy & Security',
            'shield-outline',
            <Icon name="chevron-right" size={24} color={colors.grey} />
          )}
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & About</Text>
          {renderSettingItem(
            'Help & Support',
            'help-circle-outline',
            <Icon name="chevron-right" size={24} color={colors.grey} />
          )}
          {renderSettingItem(
            'Terms & Conditions',
            'file-document-outline',
            <Icon name="chevron-right" size={24} color={colors.grey} />
          )}
          {renderSettingItem(
            'Privacy Policy',
            'file-document-outline',
            <Icon name="chevron-right" size={24} color={colors.grey} />
          )}
          {renderSettingItem(
            'About',
            'information-outline',
            <Icon name="chevron-right" size={24} color={colors.grey} />
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={24} color={colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    padding: wp('5%'),
    backgroundColor: colors.white,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  profileInfo: {
    marginLeft: wp('4%'),
    flex: 1,
  },
  profileName: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    color: colors.textDark,
  },
  profileEmail: {
    fontSize: RFValue(14),
    color: colors.textMedium,
    marginTop: hp('0.5%'),
  },
  editProfileButton: {
    marginTop: hp('1%'),
  },
  editProfileText: {
    color: colors.primary,
    fontSize: RFValue(14),
    fontWeight: '500',
  },
  section: {
    marginVertical: hp('1%'),
    backgroundColor: colors.white,
    paddingVertical: hp('1%'),
  },
  sectionTitle: {
    fontSize: RFValue(14),
    fontWeight: '500',
    color: colors.textMedium,
    marginLeft: wp('5%'),
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.5%'),
  },
  settingIconContainer: {
    marginRight: wp('3%'),
  },
  settingTitle: {
    flex: 1,
    fontSize: RFValue(15),
    color: colors.textDark,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  language: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    marginRight: wp('2%'),
    color: colors.textMedium,
    fontSize: RFValue(14),
  },
  divider: {
    height: hp('1%'),
    backgroundColor: colors.lightGrey,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('5%'),
    marginBottom: hp('2%'),
    paddingVertical: hp('1.5%'),
    backgroundColor: colors.white,
  },
  logoutText: {
    marginLeft: wp('2%'),
    color: colors.error,
    fontSize: RFValue(16),
    fontWeight: '500',
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: hp('3%'),
  },
  versionText: {
    fontSize: RFValue(12),
    color: colors.textLight,
  },
});

export default SettingsScreen;