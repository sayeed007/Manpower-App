// src/components/common/Card.js
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { COLORS, SHADOWS, SPACING } from '../../config/theme';

const Card = ({
  children,
  style,
  onPress,
  shadow = 'small',
  radius = 12,
  padding = SPACING.medium,
  backgroundColor = COLORS.surface,
}) => {
  const cardStyle = [
    styles.card,
    { 
      borderRadius: radius,
      padding,
      backgroundColor,
    },
    shadow === 'none' ? null : shadow === 'small' ? SHADOWS.small : shadow === 'medium' ? SHADOWS.medium : SHADOWS.large,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.9}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.medium,
    overflow: 'hidden',
  },
});

export default Card;