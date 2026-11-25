import React from 'react';
import { View, Text } from 'react-native';
import { colors, sharedStyles } from '../styles/shared.styles';
import { EstadoPersona } from '../constants/estado-persona';

interface StatusBadgeProps {
  estado: string | null;
}

/**
 * Componente reutilizable para mostrar el estado de un socio
 */
export function StatusBadge({ estado }: StatusBadgeProps) {
  const isActive = estado === EstadoPersona.ACTIVO;

  return (
    <View
      style={[
        sharedStyles.statusBadge,
        isActive ? sharedStyles.activeBadge : sharedStyles.inactiveBadge,
      ]}
    >
      <View
        style={[
          sharedStyles.statusDot,
          { backgroundColor: isActive ? colors.successText : colors.errorText },
        ]}
      />
      <Text
        style={[
          sharedStyles.statusText,
          isActive ? sharedStyles.activeText : sharedStyles.inactiveText,
        ]}
      >
        {estado?.toUpperCase() || 'N/A'}
      </Text>
    </View>
  );
}
