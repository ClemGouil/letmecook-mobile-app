import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ServingsControl = ({ servings, onIncrease, onDecrease }) => {
  return (
    <View style={styles.servingsContainer}>
      <TouchableOpacity onPress={onDecrease} style={styles.fabButton}>
        <Icon name="remove-circle-outline" size={30} color="rgb(180, 180, 230)" />
      </TouchableOpacity>
      <Text style={styles.servingsText}>{servings} personnes</Text>
      <TouchableOpacity onPress={onIncrease} style={styles.fabButton}>
        <Icon name="add-circle-outline" size={30} color="rgb(180, 180, 230)" />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
servingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  fabButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  servingsText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ServingsControl;