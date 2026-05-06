import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const BackButton = ({ onPress, iconName = "chevron-back-outline" , iconSize = 22, iconColor = "rgb(180, 180, 230)" }) => {

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Icon name={iconName} size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
 container : {
  alignSelf: 'flex-start',
  height: 40,
  minWidth: 40,
  justifyContent: 'center', 
  padding: 8,
  borderWidth : 2,
  borderRadius: 20,
  borderColor : "rgb(180, 180, 230)",
 }
});

export default BackButton;