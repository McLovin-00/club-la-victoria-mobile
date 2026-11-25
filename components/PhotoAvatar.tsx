import React from 'react';
import { View, Image } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { colors, sharedStyles } from '../styles/shared.styles';

interface PhotoAvatarProps {
  /**
   * URL de la foto
   */
  fotoUrl?: string;

  /**
   * Tamaño del avatar (default: 112)
   */
  size?: number;

  /**
   * Si debe mostrar el borde de color primario
   */
  bordered?: boolean;
}

/**
 * Componente reutilizable para mostrar foto de perfil con placeholder
 */
export function PhotoAvatar({
  fotoUrl,
  size = 112,
  bordered = true,
}: PhotoAvatarProps) {
  const avatarStyles = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  if (fotoUrl) {
    return (
      <Image
        source={{ uri: fotoUrl }}
        style={[
          sharedStyles.photo,
          avatarStyles,
          !bordered && { borderWidth: 0 },
        ]}
        defaultSource={require('../assets/icon.png')}
      />
    );
  }

  return (
    <View
      style={[
        sharedStyles.photoPlaceholder,
        avatarStyles,
        !bordered && { borderWidth: 0 },
      ]}
    >
      <Feather name="user" size={Math.round(size * 0.4)} color={colors.gray400} />
    </View>
  );
}
