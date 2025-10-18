import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { sharedStyles } from '../styles/shared.styles';

interface PhotoAvatarProps {
  /**
   * URL de la foto
   */
  fotoUrl?: string;

  /**
   * Tamaño del avatar (default: 150)
   */
  size?: number;

  /**
   * Si debe mostrar el borde de color primario
   */
  bordered?: boolean;
}

/**
 * Componente reutilizable para mostrar foto de perfil con placeholder
 * @param fotoUrl - URL de la imagen
 * @param size - Tamaño del avatar
 * @param bordered - Si debe tener borde de color
 */
export function PhotoAvatar({
  fotoUrl,
  size = 150,
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
      <Feather name="user" size={size * 0.4} color="#999" />
    </View>
  );
}
