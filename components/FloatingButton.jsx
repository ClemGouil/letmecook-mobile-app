import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';

const FloatingButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress}>
      <Text style={styles.fabText}>+</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: "rgb(205, 205, 255)",
    borderRadius: 25, // Ronde
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 100
  },
  fabText: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
  },
});

export default FloatingButton;