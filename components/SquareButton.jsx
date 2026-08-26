import React from 'react';
import { TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SquareButton = ({ onPress, iconName = 'trash-outline', size = 40, iconSize = 20, iconColor = "rgb(180, 180, 230)" }) => {

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: size,
          height: size,
        },
      ]}
      onPress={onPress}
    >
      <Icon
         name={iconName}
        size={iconSize}
        color={iconColor}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: 'rgb(180, 180, 230)',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SquareButton;