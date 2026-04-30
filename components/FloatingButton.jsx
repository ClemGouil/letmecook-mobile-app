import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const FloatingButton = ({ onPress, iconName = "add-outline" , iconSize = 20, iconColor = "black", label, position = "right" }) => {

  const positionStyle = position === "left"
    ? { left: 20, right: undefined }
    : { right: 20, left: undefined };

  return (
    <TouchableOpacity style={[styles.fab, positionStyle]} onPress={onPress}>
      <View style={styles.content}>
        <Icon name={iconName} size={iconSize} color={iconColor} />
        {label && <Text style={styles.label}>{label}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 20,
    minWidth: 50,
    height: 50,
    paddingHorizontal : 10,
    backgroundColor: "rgb(205, 205, 255)",
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
});

export default FloatingButton;