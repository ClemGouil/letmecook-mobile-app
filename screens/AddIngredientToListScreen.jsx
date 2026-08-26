import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView} from 'react-native';
import CustomSelect from '../components/CustomSelect';
import ContextSelector from '../components/ContextSelector';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUser } from '../hooks/useUser';
import { useShoppingList } from '../hooks/useShoppingList';
import BackButton from '../components/BackButton';
import SaveButton from '../components/SaveButton';
import IngredientSelector from '../components/IngredientSelector';

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
        toggleAll()
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

          <View style={styles.cardContainer}>
            <View style={styles.headerButtons}>
              <BackButton onPress={() => navigation.goBack()}/>
                <Text style={styles.titlePage}>Ajout d'ingrédients à une liste</Text>
              <SaveButton onPress={handleAddRecipeToShoppingList} title = "Ajouter" disabled={selectedIngredients.length === 0} />
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
              <IngredientSelector 
                title={"Eléments à ajouter à la liste"}
                items={items}
                selectedIngredients={selectedIngredients}
                serving={serving}
                toggleAll={toggleAll}
                isSelected={isSelected}
                toggleSelection={toggleSelection}
                getScaledQuantity={getScaledQuantity}
                onIncrease={increaseServings}
                onDecrease={decreaseServings}
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
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    marginBottom: 14,
  },
  titlePage: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  content: {
  },
});
