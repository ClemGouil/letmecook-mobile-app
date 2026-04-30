import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, StyleSheet } from 'react-native';

const CustomSelect = ({ label, options, selectedValue, onValueChange }) => {
  const [visible, setVisible] = useState(false);

  const handleSelect = (value) => {
    onValueChange(value);
    setVisible(false);
  };

  return (
    <View style={styles.pickerContainer}>

      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.touchableArea} onPress={() => setVisible(true)}>
        <Text style={styles.selectedText}>
          {options.find(o => o.value === selectedValue)?.label || 'Choisir'}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal transparent={true} visible={visible} animationType="fade">
        <TouchableOpacity style={styles.modalBackground} onPress={() => setVisible(false)}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.option} onPress={() => handleSelect(item.value)}>
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    marginVertical: 12,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: 'rgb(180, 180, 230)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingTop: 18, 
    paddingBottom: 10,
  },
    label: {
    position: 'absolute',
    top: -10,
    left: 15,
    paddingHorizontal: 4,
    fontSize: 12,
    color: '#555',
  },
  touchableArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedText: { 
    fontSize: 14 
  },
  arrow: { fontSize: 14, color: '#555' },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    maxHeight: 300,
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: { fontSize: 16 },
});

export default CustomSelect;