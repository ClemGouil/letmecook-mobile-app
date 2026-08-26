import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const BackButton = ({ onPress, iconName = "chevron-back-outline" , dim = 40, iconSize = 20, iconColor = "rgb(180, 180, 230)" }) => {

  return (
    <TouchableOpacity 
    style={[
        styles.container,
        {
          height: dim,
          minWidth: dim,
        }
      ]} 
      onPress={onPress}>
      <Icon name={iconName} size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
 container : {
  alignSelf: 'flex-start',
  justifyContent: 'center', 
  padding: 8,
  borderWidth : 2,
  borderRadius: 20,
  borderColor : "rgb(180, 180, 230)",
 }
});

export default BackButton;