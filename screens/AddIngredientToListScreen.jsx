import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, Image, Button, StyleSheet, Switch , ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import ServingsControl from '../components/ServingsControl'
import CustomSelect from '../components/CustomSelect';
import ContextSelector from '../components/ContextSelector';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUser } from '../hooks/useUser';
import { useShoppingList } from '../hooks/useShoppingList';

export default function AddIngredientToListScreen({ route, navigation }) {

  const data = route.params || {};

  const { user } = useUser();
  const { shoppingLists, addRecipeToShoppingList} = useShoppingList();

  const [selectedListId, setSelectedListId] = useState('__new__');
  const [serving, setServing] = useState(data?.serving || 1);
  const [originalServing, setOriginalServing] = useState(data?.serving || 1);
  const [items, setItems] = useState(data?.items || []);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  useEffect(() => {
    if (data) {
        setServing(data.serving || 1);
        setOriginalServing(data.serving || 1);
        setItems(data.items || [])
    }
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

  const  handleAddRecipeToShoppingList = async () => {
    try {
      await addRecipeToShoppingList({
        shoppingListId: selectedListId === '__new__' ? null : selectedListId,
        recipeId: data.recipeId,
        userId: user.id,
        ingredients: selectedIngredients,
        newList: selectedListId === '__new__',
        serving : serving,
    });
    navigation.goBack();
    } catch (err) {
      console.error('Erreur lors de l ajout du planning :', err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 10 }}>

          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={20} color="#fff" />
              <Text style={styles.backButtonText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.saveButton, selectedIngredients.length === 0 && styles.disabledButton]} onPress={handleAddRecipeToShoppingList} disabled={selectedIngredients.length === 0}>
              <Text style={[styles.saveButtonText, selectedIngredients.length === 0 && styles.disabledButtonText]}>Ajouter</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.titlePage}>Ajout d'ingrédients à une liste</Text>
              <View style={{ height: 60 }} />
            </View>

            <View style={styles.content}>
              <ContextSelector />
              <CustomSelect
                label="Choisir une liste de courses"
                options={[
                  { label: 'Nouvelle liste', value: "__new__" },
                  ...shoppingLists.map(list => ({ label: list.name, value: list.id }))
                ]}
                selectedValue={selectedListId}
                onValueChange={setSelectedListId}
              />
              <Text style={styles.subtitle}>Proportions :</Text>
              <ServingsControl
                servings={serving}
                onIncrease={increaseServings}
                onDecrease={decreaseServings}
              />

              <Text style={styles.subtitle}>Eléments à ajouter à la liste</Text>

              <TouchableOpacity style={styles.button} onPress={() => toggleAll()}>
                  <Text style={styles.buttonText}>{selectedIngredients.length === items.length ? 'Tout désélectionner' : 'Tout sélectionner'}</Text>
              </TouchableOpacity>

              <FlatList
                scrollEnabled={false}
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
            </View>
          </View>
        </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  cardContainer: {
    backgroundColor: '#fff', 
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  titlePage: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  content: {
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
    marginVertical: 6,
    borderWidth: 2,
    borderColor: 'rgb(180, 180, 230)',
  },
  buttonText: {
    color: 'rgb(180, 180, 230)',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginVertical : 6
  },
  ingredientSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical : 6
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
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(180, 180, 230)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize : 16
  },
  saveButton: {
    backgroundColor: 'rgb(100, 149, 237)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize : 16
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  disabledButtonText: {
    color: '#888',
  },
});
