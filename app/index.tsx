import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ClubLogo } from '../components/ClubLogo';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  borderRadius,
  colors,
  fontSize,
  shadows,
  spacing,
} from '../styles/shared.styles';

export default function HomeScreen() {
  const router = useRouter();

  const handleAccesoClub = () => {
    router.push('/acceso-club');
  };

  const handleVerIngresosPileta = () => {
    router.push('/pileta');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.mainContent}>
        <View style={styles.logoBadge}>
          <ClubLogo width={132} height={158} />
        </View>

        <Text style={styles.title}>Control de accesos</Text>

        <Text style={styles.subtitle}>
          Para continuar, por favor elegir "Acceso Club" o "Ver ingresos pileta".
        </Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleAccesoClub}
            activeOpacity={0.85}
            accessibilityRole="button"
          >
            <Ionicons name="enter-outline" size={22} color={colors.white} />
            <Text style={styles.primaryButtonText}>Acceso Club</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleVerIngresosPileta}
            activeOpacity={0.85}
            accessibilityRole="button"
          >
            <Ionicons name="water-outline" size={22} color={colors.primaryDark} />
            <Text style={styles.secondaryButtonText}>Ver ingresos pileta</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Club La Victoria © 2024</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadge: {
    width: 176,
    height: 196,
    borderRadius: borderRadius.xxl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
    ...shadows.md,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: '700',
    color: colors.gray900,
    marginBottom: spacing.sm + 2,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.gray600,
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: spacing.xxxl,
    maxWidth: 310,
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 360,
    gap: spacing.md,
  },
  button: {
    width: '100%',
    minHeight: 56,
    paddingVertical: 16,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    ...shadows.xl,
  },
  primaryButtonText: {
    fontSize: fontSize.md + 1,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.1,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primaryBorder,
    ...shadows.sm,
  },
  secondaryButtonText: {
    fontSize: fontSize.md + 1,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  footer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: fontSize.xs + 1,
    color: colors.gray500,
  },
});
