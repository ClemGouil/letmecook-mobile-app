import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const EditItemForm = ({ item, unitsList, onSave, onCancel }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [unitId, setUnitId] = useState(item.unit.id);

  const selectedUnit = unitsList.find(u => u.id === unitId);

  const compatibleUnits = unitsList.filter(
    (u) => u.type === item.ingredient.unitType
  );

  return (
    <View style={styles.formContainer}>

      <View style={styles.header}>
        <Image
          source={{ uri: item.ingredient.imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.ingredientName}>{item.ingredient.name}</Text>
      </View>

      <Text style={styles.label}>Quantité :</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={quantity.toString()}
        onChangeText={(text) => setQuantity(text)}
      />

      <Text style={styles.label}>Unité :</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={unitId}
          onValueChange={(value) => setUnitId(value)}
          style={styles.picker}
        >
          {compatibleUnits.map((u) => (
            <Picker.Item key={u.id} label={u.name} value={u.id} />
          ))}
        </Picker>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.saveButton} onPress={() =>
          onSave({
            ...item,
            quantity: Number(quantity),
            unit: selectedUnit,
          })
        }>
          <Text style={styles.saveText}>Enregistrer</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#f2f2f2',
  },
  ingredientName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    flexShrink: 1,
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
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
  },
});

export default EditItemForm;