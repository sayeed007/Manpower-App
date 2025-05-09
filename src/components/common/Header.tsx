// src/components/common/Header.js
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../../config/theme';

const Header = ({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  showBack = false,
  transparent = false,
  titleStyle,
  containerStyle,
  rightComponent,
  backgroundColor = COLORS.surface,
}) => {
  const insets = useSafeAreaInsets();
  
  return (
    <>
      <StatusBar 
        backgroundColor={transparent ? 'transparent' : backgroundColor} 
        barStyle={transparent || backgroundColor === COLORS.surface ? 'dark-content' : 'light-content'} 
        translucent={transparent}
      />
      <View 
        style={[
          styles.container, 
          {
            backgroundColor,
            paddingTop: transparent ? insets.top : insets.top + 8,
          },
          containerStyle
        ]}
      >
        <View style={styles.leftContainer}>
          {(showBack || leftIcon) && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onLeftPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon 
                name={showBack ? 'arrow-left' : leftIcon} 
                size={24} 
                color={transparent ? COLORS.surface : COLORS.text} 
              />
            </TouchableOpacity>
          )}
        </View>
        
        {title && (
          <Text 
            style={[
              styles.title, 
              {
                color: transparent ? COLORS.surface : COLORS.text
              },
              titleStyle
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        )}
        
        <View style={styles.rightContainer}>
          {rightIcon && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onRightPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon 
                name={rightIcon} 
                size={24} 
                color={transparent ? COLORS.surface : COLORS.text} 
              />
            </TouchableOpacity>
          )}
          {rightComponent && rightComponent}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.large,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  leftContainer: {
    flex: 0.2,
    alignItems: 'flex-start',
  },
  rightContainer: {
    flex: 0.2,
    alignItems: 'flex-end',
  },
  title: {
    flex: 0.6,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.large,
    textAlign: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Header;