import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ReusableModal from './ReusableModal';

const ActionListModal = ({visible, onClose, actions = [],
}) => {
  return (
    <ReusableModal
      visible={visible}
      onClose={onClose}
    >
      <View style={styles.buttonContainer}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={action.onPress}
          >
            <Text style={styles.buttonText}>
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ReusableModal>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 2,
    width: '90%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgb(180, 180, 230)',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgb(180, 180, 230)',
    textAlign: 'center',
  },
});

export default ActionListModal;
