import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Text, TextInput, Button, Surface } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuthStore } from '../store/useAuthStore';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const login = useAuthStore(state => state.login);

  const handleLogin = () => {
    const name = username.trim() || 'Guest';
    login(name);
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoIcon}>Z</Text>
            </View>
            <Text style={styles.bankName}>ZimperiumBank</Text>
            <Text style={styles.tagline}>Secure. Fast. Reliable.</Text>
          </View>

          {/* Login Card */}
          <Surface style={styles.card} elevation={4}>
            <Text style={styles.cardTitle}>Welcome Back</Text>
            <Text style={styles.cardSubtitle}>Sign in to your account</Text>

            <TextInput
              label="Username or Email"
              value={username}
              onChangeText={setUsername}
              mode="outlined"
              style={styles.input}
              outlineColor={colors.inputBorder}
              activeOutlineColor={colors.primary}
              autoCapitalize="none"
              autoCorrect={false}
              left={<TextInput.Icon icon="account-outline" color={colors.iconColor} />}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              style={styles.input}
              outlineColor={colors.inputBorder}
              activeOutlineColor={colors.primary}
              secureTextEntry={secureText}
              left={<TextInput.Icon icon="lock-outline" color={colors.iconColor} />}
              right={
                <TextInput.Icon
                  icon={secureText ? 'eye-outline' : 'eye-off-outline'}
                  color={colors.iconColor}
                  onPress={() => setSecureText(!secureText)}
                />
              }
            />

            <Text style={styles.forgotPassword}>Forgot Password?</Text>

            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.loginButton}
              contentStyle={styles.loginButtonContent}
              labelStyle={styles.loginButtonLabel}
              buttonColor={colors.primary}>
              Sign In
            </Button>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.divider} />
            </View>

            <Button
              mode="outlined"
              onPress={handleLogin}
              style={styles.biometricButton}
              contentStyle={styles.loginButtonContent}
              labelStyle={styles.biometricLabel}
              textColor={colors.primary}
              icon="fingerprint">
              Sign In with Biometrics
            </Button>
          </Surface>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <Text style={styles.signupLink}>Apply Now</Text>
            </Text>
            <Text style={styles.securityNote}>
              🔒 256-bit SSL Encrypted Connection
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const colors = {
  primary: '#0A2463',
  primaryLight: '#1A3A8F',
  accent: '#FFB800',
  background: '#0A2463',
  card: '#FFFFFF',
  inputBorder: '#D0D5E8',
  iconColor: '#8899BB',
  textPrimary: '#0A2463',
  textSecondary: '#6B7A99',
  textLight: '#FFFFFF',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.primary,
  },
  bankName: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textLight,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 4,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  card: {
    borderRadius: 24,
    padding: 28,
    backgroundColor: colors.card,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 28,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#F7F8FC',
    fontSize: 15,
  },
  forgotPassword: {
    textAlign: 'right',
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 24,
    marginTop: -4,
  },
  loginButton: {
    borderRadius: 12,
    marginBottom: 20,
  },
  loginButtonContent: {
    height: 52,
  },
  loginButtonLabel: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8ECF4',
  },
  dividerText: {
    marginHorizontal: 12,
    color: colors.textSecondary,
    fontSize: 13,
  },
  biometricButton: {
    borderRadius: 12,
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  biometricLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  signupLink: {
    color: colors.accent,
    fontWeight: '700',
  },
  securityNote: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginTop: 16,
  },
});
