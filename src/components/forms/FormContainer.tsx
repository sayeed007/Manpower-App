import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';

interface FormContainerProps {
  children: React.ReactNode;
  style?: object;
  scrollable?: boolean;
}

const FormContainer: React.FC<FormContainerProps> = ({ 
  children, 
  style, 
  scrollable = true 
}) => {
  const headerHeight = useHeaderHeight();

  const content = (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={headerHeight}
    >
      {scrollable ? (
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
});

export default FormContainer;