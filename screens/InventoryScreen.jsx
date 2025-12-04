import * as React from 'react';
import { Text, View, StyleSheet, FlatList, Keyboard, TouchableOpacity } from 'react-native';
import { useInventory } from '../hooks/useInventory';
import { useUser } from '../hooks/useUser'
import { useAppContext } from '../hooks/useAppContext';

import SearchBar from '../components/SearchBar';
import InventoryItemCard from '../components/InventoryItemCard';
import EditAddItemForm from '../components/EditAddItemForm';
import ReusableModal from '../components/ReusableModal';
import FloatingButton  from '../components/FloatingButton';
import ContextSelector from '../components/ContextSelector';

export default function InventoryScreen() {

  const [search, setSearch] = React.useState('');

  const { user} = useUser();
  const { currentContext } = useAppContext();

  const screenTitle = !currentContext
  ? "Inventaire"
  : currentContext.type === "user"
    ? "Mon Inventaire"
    : `Inventaire de ${currentContext.name}`;

  const { inventory, units, ingredients, updateItem, addItem, deleteItem } = useInventory();

  const [editingItem, setEditingItem] = React.useState(null);
  const [addingItem, setAddingItem] = React.useState(false);

  const filteredInventoryItems = inventory?.items?.filter((i) =>
    i.ingredient.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleEdit = (item) => setEditingItem(item);

  const handleDelete = async (item) => {
    try {
      await deleteItem(item.id);
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  const handleSave = async (updatedItem) => {
    await updateItem(updatedItem.id, {
      inventoryId: inventory.id,
      quantity: updatedItem.quantity,
      unitId: updatedItem.unit.id,
      ingredientId: updatedItem.ingredient.id
    });
    setEditingItem(null);
  };

  const handleAdd = async (item) => {
    await addItem({
      inventoryId: inventory.id,
      ingredientId: item.ingredient.id,
      quantity: item.quantity || 0,
      unitId: item.unit.id,
      updaterId: user.id
    });
    setAddingItem(false);
  };

  return (
    <View style={styles.container}>

      <View style={styles.headerRow}>
        <Text style={styles.title}>{screenTitle}</Text>
        <ContextSelector />
      </View>

      <View style={styles.searchContainer}>
        <SearchBar search={search} setSearch={setSearch} />
      </View>

      {filteredInventoryItems.length === 0 ? (
        <Text style={styles.emptyText}>Aucun ingrédient trouvé</Text>
      ) : (
        <>
          <FlatList
            data={filteredInventoryItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <InventoryItemCard
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
          <Text style={styles.countText}>
            {filteredInventoryItems.length} ingrédients trouvés
          </Text>
        </>
      )}
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
    marginTop: 10,
    flex: 1,
    padding: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  searchContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  list: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 40,
    fontSize: 16,
  },
  countText: {
    fontSize: 14,
    color: '#333',
    marginVertical: 8,
    textAlign: 'center',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  bottomSheet: {
    backgroundColor: 'Transparent',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 8,
    maxHeight: '80%',
  },
  dragBarContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  dragBar: {
    width: 60,
    height: 6,
    backgroundColor: '#ccc',
    borderRadius: 3,
  },
});
