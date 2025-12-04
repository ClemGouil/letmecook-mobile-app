import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import { useShoppingList } from '../hooks/useShoppingList';
import { useUser } from '../hooks/useUser'

import IngredientListCard  from '../components/IngredientListCard';
import ReusableModal from '../components/ReusableModal';
import EditAddItemForm from '../components/EditAddItemForm';
import FloatingButton  from '../components/FloatingButton';

export default function ShoppingListDetailScreen({ route }) {

  const { shoppingLists, units, ingredients, addIngredientToShoppingList, updateIngredientToShoppingList} = useShoppingList();

  const shoppingList = shoppingLists.find(sl => sl.id === route.params.shoppingListId);

  const items = shoppingList?.items ?? [];

  const { user} = useUser();

  const [editingItem, setEditingItem] = React.useState(null);
  const [addingItem, setAddingItem] = React.useState(false);

  const handleEdit = (item) => setEditingItem(item);

  const categories = Object.entries(
    items.reduce((acc, item) => {
      const category = item.ingredient.category || 'Autres';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {})
  );

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{shoppingList.name}</Text>
      </View>
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
      <FloatingButton onPress={() => setAddingItem(true)}/>

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
            ingredientsList= {ingredients}
            onSave={handleAdd}
            onCancel={() => setAddingItem(false)}
          />
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
  header: {
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: "700",
    color: "#222",
    letterSpacing: 0.5,
  },
});
