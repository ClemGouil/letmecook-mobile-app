import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import { useShoppingList } from '../hooks/useShoppingList';
import { useUser } from '../hooks/useUser';
import { useInventory } from '../hooks/useInventory';
import { useAppContext } from "../hooks/useAppContext";
import { useNavigation} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import IngredientListCard  from '../components/IngredientListCard';
import ReusableModal from '../components/ReusableModal';
import EditAddItemForm from '../components/EditAddItemForm';
import FloatingButton  from '../components/FloatingButton';
import BackButton from '../components/BackButton';

export default function ShoppingListDetailScreen({ route }) {

  const { shoppingLists, units, searchIngredients, addIngredientToShoppingList, updateIngredientToShoppingList, deleteIngredientToShoppingList} = useShoppingList();
  const { inventory, feedFromShoppingList} = useInventory();
  const navigation = useNavigation();

  const shoppingList = shoppingLists.find(sl => sl.id === route.params.shoppingListId);

  const items = shoppingList?.items ?? [];

  const { user} = useUser();
  const { currentContext } = useAppContext();

  const [editingItem, setEditingItem] = React.useState(null);
  const [addingItem, setAddingItem] = React.useState(false);

  const [ingredientQuery, setIngredientQuery] = React.useState('');
  const [ingredientResults, setIngredientResults] = React.useState([]);

  const handleEdit = (item) => setEditingItem(item);

  const categories = Object.entries(
    items.reduce((acc, item) => {
      const category = item.ingredient.category || 'Autres';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {})
  );

  React.useEffect(() => {
    const timeout = setTimeout(async () => {
      if (ingredientQuery.length >= 2) {
        const res = await searchIngredients(ingredientQuery);
        setIngredientResults(res);
      } else {
        const res = await searchIngredients(null, 3);
        setIngredientResults(res);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [ingredientQuery]);

  const handleToggleChecked = async (item) => {
    const updatedItem = { ...item, checked: !item.checked };
    await updateIngredientToShoppingList({
      shoppingListId: shoppingList.id,
      ingredientId: updatedItem.ingredient.id,
      quantity: updatedItem.quantity,
      unitId: updatedItem.unit.id,
      checked: updatedItem.checked
    });
    setEditingItem(null);
  };

  const handleSave = async (updatedItem) => {
    await updateIngredientToShoppingList({
      shoppingListId: shoppingList.id,
      ingredientId: updatedItem.ingredient.id,
      quantity: updatedItem.quantity,
      unitId: updatedItem.unit.id,
      checked: updatedItem.checked ?? false
    });
    setEditingItem(null);
  };

  const handleAdd = async (item) => {
    await addIngredientToShoppingList({
      shoppingListId: shoppingList.id,
      ingredientId: item.ingredient.id,
      quantity: item.quantity || 0,
      unitId: item.unit.id,
      updaterId: user.id
    });
    setAddingItem(false);
  };

  const handleDelete = async (item) => {
    try {
      await deleteIngredientToShoppingList(
        shoppingList.id,
        item.id
      );
    } catch (err) {
      console.error("Erreur suppression ingrédient :", err);
    }
  };

  const handleAddInventory = async () => {
    const userId = currentContext.type === "user" ? currentContext.id : null;
    const groupId = currentContext.type === "group" ? currentContext.id : null;
    await feedFromShoppingList(
      shoppingList.id,
      userId,
      groupId
    );
    navigation.navigate('ShoppingListMain');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()}/>
          <Text style={styles.headerTitle}>{shoppingList.name}</Text>
        </View>
        <FlatList
          data={categories}
          keyExtractor={([category]) => category}
          contentContainerStyle={{ paddingBottom: 60 }}
          renderItem={({ item: [category, items] }) => (
            <View style={styles.categoryCard}>
              <Text style={styles.categoryTitle}>{category}</Text>
              {items.map((item, index) => (
                <View key={item.ingredient.id + index}>
                  <IngredientListCard
                    ingredient={item.ingredient}
                    quantity={item.quantity}
                    unit={item.unit}
                    checked={item.checked}
                    onToggleChecked={() => handleToggleChecked(item)}
                    onPress={() => handleEdit(item)}
                    onDelete={() => handleDelete(item)}
                  />
                  {index !== items.length - 1 && <View style={styles.separator} />}
                </View>
              ))}
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
        <FloatingButton onPress={() => setAddingItem(true)}/>
        <FloatingButton iconName = "cube-outline" label = "Valider l'achat" position='left' onPress={() => handleAddInventory()}/>

        <ReusableModal
            visible={!!editingItem}
            onClose={() => setEditingItem(null)}
        >
            {editingItem && (
            <EditAddItemForm
                item={editingItem}
                unitsList={units}
                onSave={handleSave}
                onCancel={() => setEditingItem(null)}
            />
            )}
        </ReusableModal>

        <ReusableModal
            visible={addingItem}
            onClose={() => setAddingItem(false)}
          >
            <EditAddItemForm
              item={null}
              unitsList={units}
              ingredientsList= {ingredientResults}
              onSearchIngredient={setIngredientQuery}
              onSave={handleAdd}
              onCancel={() => setAddingItem(false)}
            />
        </ReusableModal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
    position: 'relative'
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 6,
  },
  ingredientCard: {
    paddingVertical: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  headerTitle: {
    flexShrink: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    letterSpacing: 0.4,
    marginLeft: 12,
  },
});
