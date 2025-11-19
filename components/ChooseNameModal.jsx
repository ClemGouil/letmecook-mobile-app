import React, { useState } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet } from "react-native";

const ChooseNameModal = ({ visible, title, placeholder, onSubmit, onCancel }) => {

  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.trim() !== "") {
        onSubmit(name.trim());
        setName("");
    }
  }

  return (

    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => onClose()}
    >
    <View style={styles.modalBackground}>
      <View style={styles.modalContainer}>
        <Text style={styles.label}>{title}</Text>
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={name}
            onChangeText={setName}
        />
        <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                <Text style={styles.saveText}>Valider</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
        </View>
      </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', 
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },
  label: {
    marginBottom: 6,
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3f51b5',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ccc',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  }
});

export default ChooseNameModal;