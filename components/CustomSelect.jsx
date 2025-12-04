import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, StyleSheet } from 'react-native';

const CustomSelect = ({ label, options, selectedValue, onValueChange }) => {
  const [visible, setVisible] = useState(false);

  const handleSelect = (value) => {
    onValueChange(value);
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.selectBox}>
        <View style={styles.row}>
          <Text style={styles.label}>{label}</Text>
          <TouchableOpacity style={styles.touchableArea} onPress={() => setVisible(true)}>
            <Text style={styles.selectedText}>
              {options.find(o => o.value === selectedValue)?.label || 'Choisir'}
            </Text>
          <Text style={styles.arrow}>▼</Text>
        </TouchableOpacity>
        </View>
      </View>

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
  container: { 
    marginVertical: 12,
    width: 150
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  selectBox: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    top: -20,
    left: 10,
    fontSize: 12,
    color: '#555',
    backgroundColor: 'transparent',
  },
  touchableArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10
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