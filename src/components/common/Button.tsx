// src/components/common/Button.js
import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../../config/theme';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    let buttonStyle = [styles.button];
    
    // Add variant styles
    switch (variant) {
      case 'primary':
        buttonStyle.push(styles.primary);
        break;
      case 'secondary':
        buttonStyle.push(styles.secondary);
        break;
      case 'outline':
        buttonStyle.push(styles.outline);
        break;
      case 'text':
        buttonStyle.push(styles.text);
        break;
      default:
        buttonStyle.push(styles.primary);
    }
    
    // Add size styles
    switch (size) {
      case 'small':
        buttonStyle.push(styles.small);
        break;
      case 'medium':
        buttonStyle.push(styles.medium);
        break;
      case 'large':
        buttonStyle.push(styles.large);
        break;
      default:
        buttonStyle.push(styles.medium);
    }
    
    // Add disabled style
    if (disabled) {
      buttonStyle.push(styles.disabled);
    }
    
    // Add custom style
    if (style) {
      buttonStyle.push(style);
    }
    
    return buttonStyle;
  };
  
  const getTextStyle = () => {
    let buttonTextStyle = [styles.buttonText];
    
    // Add variant text styles
    switch (variant) {
      case 'primary':
        buttonTextStyle.push(styles.primaryText);
        break;
      case 'secondary':
        buttonTextStyle.push(styles.secondaryText);
        break;
      case 'outline':
        buttonTextStyle.push(styles.outlineText);
        break;
      case 'text':
        buttonTextStyle.push(styles.textText);
        break;
      default:
        buttonTextStyle.push(styles.primaryText);
    }
    
    // Add size text styles
    switch (size) {
      case 'small':
        buttonTextStyle.push(styles.smallText);
        break;
      case 'medium':
        buttonTextStyle.push(styles.mediumText);
        break;
      case 'large':
        buttonTextStyle.push(styles.largeText);
        break;
      default:
        buttonTextStyle.push(styles.mediumText);
    }
    
    // Add disabled text style
    if (disabled) {
      buttonTextStyle.push(styles.disabledText);
    }
    
    // Add custom text style
    if (textStyle) {
      buttonTextStyle.push(textStyle);
    }
    
    return buttonTextStyle;
  };
  
  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? COLORS.surface : COLORS.primary} 
        />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={getTextStyle()}>{title}</Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Variants
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  text: {
    backgroundColor: 'transparent',
  },
  // Sizes
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 100,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 150,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 200,
  },
  // Text styles
  buttonText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.medium,
    textAlign: 'center',
  },
  primaryText: {
    color: COLORS.surface,
  },
  secondaryText: {
    color: COLORS.text,
  },
  outlineText: {
    color: COLORS.primary,
  },
  textText: {
    color: COLORS.primary,
  },
  // Text sizes
  smallText: {
    fontSize: FONT_SIZES.small,
  },
  mediumText: {
    fontSize: FONT_SIZES.medium,
  },
  largeText: {
    fontSize: FONT_SIZES.large,
  },
  // Disabled states
  disabled: {
    backgroundColor: COLORS.disabled,
    borderColor: COLORS.disabled,
  },
  disabledText: {
    color: COLORS.textSecondary,
  },
  // Icon positioning
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button;