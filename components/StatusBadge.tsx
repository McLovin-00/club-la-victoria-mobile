import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { sharedStyles } from '../styles/shared.styles';
import { EstadoPersona } from '../constants/estado-persona';

interface StatusBadgeProps {
  estado: string | null;
}

/**
 * Componente reutilizable para mostrar el estado de un socio
 * @param estado - Estado del socio (ACTIVO/INACTIVO)
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
