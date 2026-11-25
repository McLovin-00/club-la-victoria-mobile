/**
 * Estilos y tokens de diseño compartidos para Club La Victoria Mobile
 * Sistema visual unificado, accesible y optimizado para uso en exteriores
 */

import { Platform, StyleSheet } from 'react-native';

/**
 * Paleta semántica armonizada con la identidad del club
 */
export const colors = {
  // Primarios (verde esmeralda institucional, WCAG AA >= 5.3:1 sobre blanco)
  primary: '#157A5A',
  primaryPressed: '#106147',
  primaryLight: '#E6F4EE',
  primaryBorder: '#B5DFCE',
  primaryDark: '#0F5941',

  // Estados
  success: '#DCFCE7',
  successBorder: '#BBF7D0',
  successText: '#166534',
  error: '#FEE2E2',
  errorBorder: '#FECACA',
  errorText: '#991B1B',
  errorAccent: '#DC2626',
  errorBg: '#FEF2F2',
  warning: '#FEF3C7',
  warningBorder: '#FDE68A',
  warningText: '#92400E',
  info: '#E0F2FE',
  infoText: '#075985',

  // Neutros armonizados (tinte verde muy sutil para calidez y cohesión)
  white: '#FFFFFF',
  black: '#111B16',
  gray50: '#F4F7F5',
  gray100: '#EDF2EF',
  gray200: '#E2E8E4',
  gray300: '#CBD5CF',
  gray400: '#9AA8A0',
  gray500: '#6B7A72',
  gray600: '#52635A',
  gray700: '#37473F',
  gray800: '#212E27',
  gray900: '#111B16',

  // Específicos de superficie
  background: '#F4F7F5',
  surface: '#FFFFFF',
  surfaceSubtle: '#F8FAF9',
  border: '#E2E8E4',
  borderStrong: '#CBD5CF',
  placeholder: '#7A8A82',
  disabled: '#E5ECE8',
  disabledText: '#8A9B92',
};

/**
 * Escala de espaciado (múltiplos de 4)
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

/**
 * Escala tipográfica consistente
 */
export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  huge: 32,
};

/**
 * Radios de borde consistentes
 */
export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  xxl: 24,
  full: 9999,
};

/**
 * Elevación sutil (bordes finos + sombra suave orientada hacia abajo)
 */
export const shadows = {
  sm: {
    shadowColor: '#0F241B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#0F241B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  lg: {
    shadowColor: '#0F241B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  xl: {
    shadowColor: '#0F5941',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
};

const tabularNums = Platform.select({
  ios: { fontVariant: ['tabular-nums' as const] },
  android: { fontVariant: ['tabular-nums' as const] },
  default: { fontVariant: ['tabular-nums' as const] },
});

/**
 * Estilos compartidos de contenedores y controles
 */
export const sharedStyles = StyleSheet.create({
  // ============================================
  // CONTAINERS
  // ============================================
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },

  scrollContent: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },

  // ============================================
  // CARDS Y SECCIONES
  // ============================================
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },

  infoSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },

  // ============================================
  // TEXTOS
  // ============================================
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.gray900,
    letterSpacing: -0.4,
  },

  subtitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.gray900,
    marginBottom: spacing.md,
    letterSpacing: -0.2,
  },

  name: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.gray900,
    letterSpacing: -0.3,
    textAlign: 'center',
  },

  detailText: {
    fontSize: fontSize.md,
    color: colors.gray800,
    flex: 1,
    fontWeight: '500',
    ...tabularNums,
  },

  detailLabelInline: {
    fontSize: fontSize.xs,
    color: colors.gray500,
    fontWeight: '500',
    marginBottom: 2,
  },

  label: {
    fontSize: fontSize.sm,
    color: colors.gray700,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },

  // ============================================
  // BADGES Y STATUS
  // ============================================
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },

  activeBadge: {
    backgroundColor: colors.success,
    borderColor: colors.successBorder,
  },

  inactiveBadge: {
    backgroundColor: colors.error,
    borderColor: colors.errorBorder,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: borderRadius.full,
  },

  statusText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  activeText: {
    color: colors.successText,
  },

  inactiveText: {
    color: colors.errorText,
  },

  // ============================================
  // PHOTOS Y AVATARES
  // ============================================
  photoContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  photo: {
    width: 112,
    height: 112,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray100,
    borderWidth: 3,
    borderColor: colors.primaryBorder,
  },

  photoPlaceholder: {
    width: 112,
    height: 112,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },

  // ============================================
  // DETALLES
  // ============================================
  detailsSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
    gap: spacing.md,
  },

  detailRowLast: {
    borderBottomWidth: 0,
  },

  detailIconWrap: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ============================================
  // BOTONES
  // ============================================
  primaryButton: {
    backgroundColor: colors.primary,
    minHeight: 54,
    paddingVertical: 15,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm + 2,
    ...shadows.xl,
  },

  primaryButtonText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: '700',
    letterSpacing: 0.1,
  },

  secondaryButton: {
    backgroundColor: colors.surface,
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },

  secondaryButtonText: {
    color: colors.gray700,
    fontSize: fontSize.md,
    fontWeight: '600',
  },

  // ============================================
  // FORMULARIOS
  // ============================================
  input: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 13,
    fontSize: fontSize.md,
    color: colors.gray900,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    minHeight: 48,
  },

  inputError: {
    borderColor: colors.errorAccent,
    backgroundColor: colors.errorBg,
  },

  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.xs + 2,
  },

  errorText: {
    fontSize: fontSize.sm,
    color: colors.errorAccent,
    fontWeight: '500',
    flex: 1,
  },

  // ============================================
  // CHECKBOX Y RADIO
  // ============================================
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  checkboxLabel: {
    fontSize: fontSize.md,
    color: colors.gray900,
    fontWeight: '600',
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },

  radioDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
  },

  radioLabel: {
    fontSize: fontSize.sm,
    color: colors.gray800,
    fontWeight: '600',
  },

  // ============================================
  // LAYOUT
  // ============================================
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ============================================
  // LOADING
  // ============================================
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },

  loadingText: {
    fontSize: fontSize.md,
    color: colors.gray600,
    marginTop: spacing.md,
    fontWeight: '500',
    textAlign: 'center',
  },
});

/**
 * Tipo de persona (usado en badges)
 */
export const tipoPersonaStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },

  club: {
    backgroundColor: colors.warning,
    borderColor: colors.warningBorder,
  },

  clubText: {
    color: colors.warningText,
  },

  pileta: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryBorder,
  },

  piletaText: {
    color: colors.primaryDark,
  },

  text: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
