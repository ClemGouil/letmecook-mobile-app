import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

export default function ReusableModal({ visible, onClose, children }) {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={['down']}
      style={styles.modal}
      backdropTransitionOutTiming={0}
      propagateSwipe={false}
      useNativeDriverForBackdrop
    >
      <View style={styles.bottomSheet}>
        {/* Barre de fermeture */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onClose}
          style={styles.dragBarContainer}
        >
          <View style={styles.dragBar} />
        </TouchableOpacity>

        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  bottomSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 8,
    maxHeight: '80%',
  },
  dragBarContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  dragBar: {
    width: 60,
    height: 6,
    backgroundColor: '#ccc',
    borderRadius: 3,
  },
});