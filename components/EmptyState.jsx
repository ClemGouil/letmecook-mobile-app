import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const EmptyState = ({
  iconName = 'folder-open-outline',
  iconSize = 42,
  iconColor = 'rgb(180, 180, 230)',
  title = 'Aucun élément',
  message = 'Aucun élément à afficher.',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Icon
        name={iconName}
        size={iconSize}
        color={iconColor}
      />

      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.message}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },

  title: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },

  message: {
    marginTop: 5,
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
});

export default EmptyState;
