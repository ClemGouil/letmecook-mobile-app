import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const FloatingButton = ({ onPress, iconName = "add-outline" , iconSize = 20, iconColor = "black" }) => {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress}>
      <Icon name={iconName} size={iconSize} color={iconColor}/>
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
  },
});

export default FloatingButton;