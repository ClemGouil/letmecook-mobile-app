import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SaveButton = ({ onPress, title = "Enregistrer"}) => {

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
 button: {
    height: 40,
    minWidth: 40, 
    justifyContent: 'center',
    backgroundColor: 'rgb(180, 180, 230)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize : 16
  },
});

export default SaveButton;