import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInputProps } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Controller, Control, FieldValues, FieldPath } from 'react-hook-form';
import { colors } from '../../constants/colors';

interface FormFieldProps<TFieldValues extends FieldValues> extends TextInputProps {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  secureTextEntry?: boolean;
  rules?: any;
  defaultValue?: string;
  icon?: string;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
}

function FormField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  secureTextEntry = false,
  rules = {},
  defaultValue = '',
  icon,
  error,
  multiline = false,
  numberOfLines = 1,
  ...otherProps
}: FormFieldProps<TFieldValues>) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={defaultValue as any}
        render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
          <>
            <TextInput
              label={label}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value as string}
              style={styles.input}
              secureTextEntry={secureTextEntry && !isPasswordVisible}
              error={!!fieldError || !!error}
              mode="outlined"
              outlineColor={colors.borderGray}
              activeOutlineColor={colors.primary}
              multiline={multiline}
              numberOfLines={multiline ? numberOfLines : 1}
              left={icon ? <TextInput.Icon icon={icon} /> : undefined}
              right={
                secureTextEntry ? (
                  <TextInput.Icon
                    icon={isPasswordVisible ? 'eye-off' : 'eye'}
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  />
                ) : undefined
              }
              {...otherProps}
            />
            {(fieldError || error) && (
              <Text style={styles.errorText}>{fieldError?.message || error}</Text>
            )}
          </>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },
  input: {
    backgroundColor: colors.white,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    paddingHorizontal: 8,
    marginTop: 2,
  },
});

export default FormField;