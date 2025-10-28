import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import { useShoppingList } from '../hooks/useShoppingList';

import IngredientListCard  from '../components/IngredientListCard';
import ReusableModal from '../components/ReusableModal';
import EditItemForm from '../components/EditItemForm';

export default function ShoppingListDetailScreen({ route }) {

  const { shoppingLists, units, updateIngredientToShoppingList} = useShoppingList();

  const shoppingList = shoppingLists.find(sl => sl.id === route.params.shoppingListId);

  const [editingItem, setEditingItem] = React.useState(null);

  const handleEdit = (item) => setEditingItem(item);

  const categories = Object.entries(
    shoppingList.items.reduce((acc, item) => {
      const category = item.ingredient.category || 'Autres';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {})
  );

  const handleToggleChecked = async (item) => {
    const updatedItem = { ...item, checked: !item.checked };
    console.log("Update :", updatedItem);
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
    console.log("Update :", updatedItem);
    await updateIngredientToShoppingList({
      shoppingListId: shoppingList.id,
      ingredientId: updatedItem.ingredient.id,
      quantity: updatedItem.quantity,
      unitId: updatedItem.unit.id,
      checked: updatedItem.checked ?? false
    });
    setEditingItem(null);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={([category]) => category}
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
                />
                {index !== items.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
        <ReusableModal
            visible={!!editingItem}
            onClose={() => setEditingItem(null)}
        >
            {editingItem && (
            <EditItemForm
                item={editingItem}
                unitsList={units}
                onSave={handleSave}
                onCancel={() => setEditingItem(null)}
            />
            )}
      </ReusableModal>
    </View>
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
});
