import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

const ShoppingListForm = ({ onSubmit, onCancel }) => {

  const [shoppingListName, setShoppingListName] = useState('');

  const handleSubmit = () => {
    if (shoppingListName.trim() !== "") {
        onSubmit(shoppingListName.trim());
        setShoppingListName("");
    }
  }

  return (
    <View style={styles.formContainer}>
        <Text style={styles.label}>Nom de la liste :</Text>
        <TextInput
            style={styles.input}
            placeholder="Ex : Courses du week-end"
            value={shoppingListName}
            onChangeText={setShoppingListName}
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
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
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

export default ShoppingListForm;