// src/config/theme.js
import { DefaultTheme } from 'react-native-paper';

export const COLORS = {
  primary: '#2673F0',       // Blue from UI
  secondary: '#F4BF00',     // Yellow accent from UI
  accent: '#FF6363',        // Red accent for notifications/alerts
  background: '#F9FAFC',    // Light background
  surface: '#FFFFFF',       // White surface
  text: '#1C1C28',          // Dark text
  textSecondary: '#636381', // Secondary text
  border: '#E1E1E8',        // Border color
  success: '#34C759',       // Green success color
  error: '#FF3B30',         // Error red
  placeholder: '#A0A0A0',   // Placeholder text
  disabled: '#C7C7CD',      // Disabled state
  cardBackground: '#FFFFFF',// Card background
  input: '#F3F3F7',         // Input background
  statusBar: '#2673F0',     // Status bar color
};

export const FONTS = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
};

export const FONT_SIZES = {
  xs: 10,
  small: 12,
  medium: 14,
  large: 16,
  xl: 18,
  xxl: 20,
  h3: 22,
  h2: 24,
  h1: 28,
};

export const SPACING = {
  xs: 4,
  small: 8,
  medium: 16,
  large: 24,
  xl: 32,
  xxl: 40,
};

export const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.10,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.20,
    shadowRadius: 13.16,
    elevation: 10,
  },
};

// Paper theme configuration
export const paperTheme = {
  ...DefaultTheme,
  roundness: 12,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    accent: COLORS.secondary,
    background: COLORS.background,
    surface: COLORS.surface,
    text: COLORS.text,
    disabled: COLORS.disabled,
    placeholder: COLORS.placeholder,
    error: COLORS.error,
  },
  fonts: {
    regular: {
      fontFamily: FONTS.regular,
    },
    medium: {
      fontFamily: FONTS.medium,
    },
    light: {
      fontFamily: FONTS.regular,
    },
    thin: {
      fontFamily: FONTS.regular,
    },
  },
};

// Export default theme
export default {
  COLORS,
  FONTS,
  FONT_SIZES,
  SPACING,
  SHADOWS,
  paperTheme,
};