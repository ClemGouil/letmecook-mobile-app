import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SaveButton = ({ onPress, title = "Enregistrer", disabled = false}) => {

  return (
    <TouchableOpacity style={[styles.button, disabled && styles.disabledButton]} onPress={onPress} disabled={disabled}>
      <Text style={[styles.text, disabled && styles.disabledText]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
 button: {
    height: 40,
    minWidth: 35, 
    justifyContent: 'center',
    backgroundColor: 'rgb(180, 180, 230)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize : 14
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  disabledText: {
    color: '#888',
  },
});

export default SaveButton;