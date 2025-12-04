import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, Image, Button, StyleSheet, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ServingsControl from '../components/ServingsControl'
import ContextSelector from '../components/ContextSelector';

const AddIngredientToListModal = ({ visible, onClose, data, shoppingLists }) => {
  const [selectedListId, setSelectedListId] = useState('__new__');
  const [serving, setServing] = useState(data.serving || 1);
  const [originalServing, setOriginalServing] = useState(data.serving || 1);
  const [items, setItems] = useState(data.items || []);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  useEffect(() => {
    setServing(data.serving || 1);
    setOriginalServing(data.serving || 1);
  }, [data]);

  const toggleAll = () => {
    if (selectedIngredients.length === items.length) {
      setSelectedIngredients([]);
    } else {
      setSelectedIngredients([...items]);
    }
  };

  const isSelected = (item) => {
    return selectedIngredients.some(i => i.id === item.id);
  };

  const toggleSelection = (item, checked) => {
    if (checked) {
      setSelectedIngredients(prev => [...prev, item]);
    } else {
      setSelectedIngredients(prev => prev.filter(i => i.id !== item.id));
    }
  };

  const increaseServings = () => setServing(prev => prev + 1);
  const decreaseServings = () => {
    if (serving > 1) setServing(prev => prev - 1);
  };

  const getScaledQuantity = (originalQuantity) => {
    const ratio = serving / originalServing;
    return Math.round(originalQuantity * ratio * 100) / 100;
  };

  const handleAdd = () => {
    onClose({
      listId: selectedListId === '__new__' ? null : selectedListId,
      ingredients: selectedIngredients,
      newList: selectedListId === '__new__',
      serving,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => onClose()}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Ajout d'ingrédients à une liste</Text>
          <TouchableOpacity style={styles.closeButton} onPress={() => onClose()}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.content}>
            <ContextSelector />
            <Text style={styles.subtitle} >Choisir une liste de courses</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedListId}
                onValueChange={(itemValue) => setSelectedListId(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Nouvelle liste" value="__new__" />
                {shoppingLists.map((list) => (
                  <Picker.Item key={list.id} label={list.name} value={list.id} />
                ))}
              </Picker>
            </View>

            <ServingsControl
              servings={serving}
              onIncrease={increaseServings}
              onDecrease={decreaseServings}
            />

            <View style={styles.toolbar}>
              <Text style={styles.subtitle}>Eléments à ajouter à la liste</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={() => toggleAll()}>
                <Text style={styles.buttonText}>{selectedIngredients.length === items.length ? 'Tout désélectionner' : 'Tout sélectionner'}</Text>
            </TouchableOpacity>

            <FlatList
              data={items}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.ingredientSection}>
                  <Switch
                    value={isSelected(item)}
                    onValueChange={(checked) => toggleSelection(item, checked)}
                  />
                  <View style={styles.checkboxContent}>
                    <Image source={{ uri: item.ingredient.imageUrl }} style={styles.image} />
                    <Text>
                      {item.ingredient.name} - {getScaledQuantity(item.quantity)} {item.unit.symbol}
                    </Text>
                  </View>
                </View>
              )}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.saveButton} onPress={handleAdd} disabled={selectedIngredients.length === 0}>
                <Text style={styles.saveText}>Ajouter</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => onClose()}>
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
            </View>
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
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  closeText: {
    fontSize: 24,
    color: '#999',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: 'rgb(180, 180, 230)',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 2,
    borderColor: 'rgb(180, 180, 230)',
  },
  buttonText: {
    color: 'rgb(180, 180, 230)',
    fontWeight: 'bold',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  ingredientSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 12,
    borderRadius: 4,
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

export default AddIngredientToListModal;
