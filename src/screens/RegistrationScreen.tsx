import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../navigation/types';
import { registerSuccess } from '../store/authSlice';
import { useAppDispatch } from '../store/hooks';
import {
  isNonEmpty,
  isValidEmail,
  isValidPassword,
  isValidPhone,
} from '../utils/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'Registration'>;

type FieldErrors = {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
};

export function RegistrationScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  const clearFieldError = useCallback((key: keyof FieldErrors) => {
    setErrors(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const validate = useCallback((): FieldErrors => {
    const next: FieldErrors = {};
    if (!isNonEmpty(name)) {
      next.name = 'Name is required.';
    }
    if (!isNonEmpty(email)) {
      next.email = 'Email is required.';
    } else if (!isValidEmail(email)) {
      next.email = 'Enter a valid email address.';
    }
    if (!isNonEmpty(phone)) {
      next.phone = 'Phone number is required.';
    } else if (!isValidPhone(phone)) {
      next.phone = 'Phone must be exactly 10 digits (numbers only).';
    }
    if (!isNonEmpty(password)) {
      next.password = 'Password is required.';
    } else if (!isValidPassword(password)) {
      next.password = 'Password must be at least 8 characters.';
    }
    return next;
  }, [email, name, password, phone]);

  const onSubmit = useCallback(() => {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    dispatch(
      registerSuccess({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      }),
    );
    navigation.replace('Gallery');
  }, [dispatch, email, name, navigation, phone, validate]);

  const title = useMemo(
    () => 'Create an account to browse the gallery.',
    [],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}>
          <Text style={styles.heading}>Register</Text>
          <Text style={styles.sub}>{title}</Text>

          <LabeledInput
            label="Name"
            value={name}
            onChangeText={t => {
              setName(t);
              clearFieldError('name');
            }}
            error={errors.name}
            autoCapitalize="words"
          />
          <LabeledInput
            label="Email"
            value={email}
            onChangeText={t => {
              setEmail(t);
              clearFieldError('email');
            }}
            error={errors.email}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <LabeledInput
            label="Phone number"
            value={phone}
            onChangeText={t => {
              setPhone(t.replace(/\D/g, '').slice(0, 10));
              clearFieldError('phone');
            }}
            error={errors.phone}
            keyboardType="number-pad"
            maxLength={10}
          />
          <LabeledInput
            label="Password"
            value={password}
            onChangeText={t => {
              setPassword(t);
              clearFieldError('password');
            }}
            error={errors.password}
            secureTextEntry
          />

          <Pressable
            onPress={onSubmit}
            style={({ pressed }) => [
              styles.submit,
              pressed && styles.submitPressed,
            ]}
            accessibilityRole="button">
            <Text style={styles.submitText}>Continue</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function LabeledInput({
  label,
  value,
  onChangeText,
  error,
  ...rest
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  error?: string;
} & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, error ? styles.inputError : null]}
        placeholderTextColor="#636366"
        {...rest}
      />
      {error != null ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#000',
  },
  flex: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginTop: 8,
  },
  sub: {
    marginTop: 8,
    marginBottom: 24,
    color: '#aeaeb2',
    fontSize: 15,
    lineHeight: 22,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    color: '#f2f2f7',
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#3a3a3c',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
    backgroundColor: '#1c1c1e',
  },
  inputError: {
    borderColor: '#ff453a',
  },
  fieldError: {
    color: '#ff6961',
    marginTop: 6,
    fontSize: 13,
  },
  submit: {
    marginTop: 12,
    backgroundColor: '#0a84ff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitPressed: {
    opacity: 0.88,
  },
  submitText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
