import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const EditAddItemForm = ({ item, unitsList, ingredientsList, onSave, onCancel }) => {

  const [quantity, setQuantity] = useState(item?.quantity ?? 0);
  const [selectedIngredient, setSelectedIngredient] = useState(item?.ingredient ?? null);
  const [unitId, setUnitId] = useState(item?.unit?.id ?? null);
  const [searchIngredient, setSearchIngredient] = useState('');
  const [showIngredientPicker, setShowIngredientPicker] = useState(!selectedIngredient);

  const compatibleUnits = selectedIngredient
    ? unitsList.filter(u => u.type === selectedIngredient.unitType)
    : unitsList;

  const selectedUnit = compatibleUnits.find(u => u.id === unitId) || null;
  const isEdit = !!item;

  useEffect(() => {
    if (selectedIngredient && !isEdit) {
      setQuantity(selectedIngredient.defaultValue ?? 0);
      setUnitId(selectedIngredient.defaultUnit?.id ?? null);
    }
  }, [selectedIngredient, isEdit]);

  return (
    <View style={styles.formContainer}>

      {selectedIngredient && !showIngredientPicker && (
        <View style={styles.header}>
          <View style={styles.ingredientInfo}>
            <Image
              source={{ uri: selectedIngredient.imageUrl }}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.ingredientName}>{selectedIngredient.name}</Text>
          </View>
          {!isEdit && (
            <TouchableOpacity
              style={styles.changeIngredientButton}
              onPress={() => setShowIngredientPicker(true)}
            >
              <Icon name="edit" size={20} color="#333" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {showIngredientPicker && (
        <>
          <Text style={styles.label}>Sélectionnez un ingrédient :</Text>
          <TextInput
            style={styles.input}
            placeholder="Tapez le nom de l'ingrédient"
            value={searchIngredient}
            onChangeText={setSearchIngredient}
          />
          <FlatList
            data={ingredientsList.filter(i =>
              i.name.toLowerCase().includes(searchIngredient.toLowerCase())
            )}
            keyExtractor={i => i.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedIngredient(item);
                  setShowIngredientPicker(false);
                }}
                style={styles.ingredientItem}
              >
                <Text style={styles.ingredientItemText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            style={styles.ingredientPicker}
          />
        </>
      )}

      {selectedIngredient && !showIngredientPicker && (
        <>
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
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
            if (!selectedIngredient) return;
            onSave({
              ...item,
              ingredient: selectedIngredient,
              quantity: Number(quantity),
              unit: selectedUnit,
            })}
          }
        >
          <Text style={styles.saveText}>Enregistrer</Text>
        </TouchableOpacity>
        

        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
      </View>
      </>
      )}
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
    justifyContent: 'space-between',
  },
  ingredientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
    changeIngredientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
  },
  ingredientPicker: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    elevation: 2, // petite ombre sur Android
    shadowColor: '#000', // ombre sur iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  ingredientItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  ingredientItemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default EditAddItemForm;