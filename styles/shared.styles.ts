/**
 * Estilos compartidos entre componentes
 * Evita duplicación y mantiene consistencia visual
 */

import { StyleSheet } from 'react-native';

/**
 * Colores del tema
 */
export const colors = {
  // Primarios
  primary: '#2DD4BF',
  primaryLight: '#B8E6D5',
  primaryDark: '#2D9D78',

  // Estados
  success: '#D4EDDA',
  successText: '#155724',
  error: '#F8D7DA',
  errorText: '#721C24',
  warning: '#FFF3CD',
  warningText: '#856404',

  // Neutros
  white: '#FFFFFF',
  black: '#1A1A1A',
  gray50: '#F8F9FA',
  gray100: '#F5F5F5',
  gray200: '#E9ECEF',
  gray300: '#DEE2E6',
  gray400: '#CED4DA',
  gray500: '#ADB5BD',
  gray600: '#6C757D',
  gray700: '#495057',
  gray800: '#343A40',
  gray900: '#212529',

  // Específicos
  background: '#F8F9FA',
  border: '#E0E0E0',
  placeholder: '#999999',
  disabled: '#E0E0E0',
};

/**
 * Espaciados consistentes
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
 * Tamaños de fuente
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
 * Border radius
 */
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 9999,
};

/**
 * Sombras
 */
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
};

/**
 * Estilos compartidos de contenedores
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
    paddingHorizontal: spacing.xl,
  },

  scrollContent: {
    paddingBottom: spacing.xl,
  },

  // ============================================
  // CARDS Y SECCIONES
  // ============================================
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.lg,
  },

  infoSection: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.lg,
  },

  // ============================================
  // TEXTOS
  // ============================================
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.gray900,
  },

  subtitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.gray900,
    marginBottom: spacing.lg,
  },

  name: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.gray900,
    flex: 1,
  },

  detailText: {
    fontSize: fontSize.md,
    color: colors.gray700,
    marginLeft: spacing.lg,
    flex: 1,
  },

  label: {
    fontSize: fontSize.md,
    color: colors.gray700,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },

  // ============================================
  // BADGES Y STATUS
  // ============================================
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.xxl,
  },

  activeBadge: {
    backgroundColor: colors.success,
  },

  inactiveBadge: {
    backgroundColor: colors.error,
  },

  statusText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
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
    marginBottom: spacing.xl,
  },

  photo: {
    width: 150,
    height: 150,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray200,
    borderWidth: 3,
    borderColor: colors.primary,
  },

  photoPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.gray300,
  },

  // ============================================
  // DETALLES
  // ============================================
  detailsSection: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    ...shadows.lg,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },

  // ============================================
  // BOTONES
  // ============================================
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg + 2,
    borderRadius: borderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    ...shadows.xl,
  },

  primaryButtonText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: '600',
  },

  secondaryButton: {
    backgroundColor: colors.white,
    paddingVertical: spacing.lg + 2,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    borderColor: colors.gray600,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },

  secondaryButtonText: {
    color: colors.gray600,
    fontSize: fontSize.md,
    fontWeight: '600',
  },

  // ============================================
  // FORMULARIOS
  // ============================================
  input: {
    backgroundColor: colors.gray50,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.gray900,
    borderWidth: 1,
    borderColor: colors.gray300,
  },

  inputError: {
    borderColor: '#DC3545',
    backgroundColor: '#FFF5F5',
  },

  errorText: {
    fontSize: fontSize.sm,
    color: '#DC3545',
    marginTop: spacing.xs,
    fontWeight: '500',
  },

  // ============================================
  // CHECKBOX Y RADIO
  // ============================================
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxChecked: {
    backgroundColor: colors.primary,
  },

  checkboxLabel: {
    fontSize: fontSize.md,
    color: colors.gray700,
    fontWeight: '500',
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.primary,
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
    fontSize: fontSize.md,
    color: colors.gray700,
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
  },

  loadingText: {
    fontSize: fontSize.md,
    color: colors.gray600,
    marginTop: spacing.sm + 2,
  },
});

/**
 * Tipo de persona (usado en badges)
 */
export const tipoPersonaStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    alignSelf: 'flex-start',
  },

  club: {
    backgroundColor: colors.warning,
  },

  clubText: {
    color: colors.warningText,
  },

  pileta: {
    backgroundColor: colors.success,
  },

  piletaText: {
    color: colors.successText,
  },

  text: {
    fontSize: fontSize.md,
    marginLeft: spacing.sm,
    fontWeight: '500',
  },
});
