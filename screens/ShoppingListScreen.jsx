import React, { useState } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation} from '@react-navigation/native';
import { useShoppingList } from '../hooks/useShoppingList';
import { useUser } from '../hooks/useUser'

import SearchBar from '../components/SearchBar';
import ShoppingListCard from '../components/ShoppingListCard';
import FloatingButton  from '../components/FloatingButton';
import ReusableModal from '../components/ReusableModal';
import ChooseNameModal from '../components/ChooseNameModal';
import GenerateFromRecipeModal from '../components/GenerateFromRecipeModal';

export default function ShoppingListScreen() {

  const navigation = useNavigation();

  const { user} = useUser();

  const [search, setSearch] = React.useState('');
  const [addingShoppingList, setAddingShoppingList] = React.useState(false);

  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalGenerateFromRecipe, setShowModalGenerateFromRecipe] = useState(false);

  const { shoppingLists, addShoppingList, updateShoppingList, deleteShoppingList, generateShoppingListFromRecipes } = useShoppingList();

  const filteredShoppingLists = shoppingLists.filter((sl) => {
    const matchesSearch = sl.name.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const handlePressShoppingList = (list) => {
    navigation.navigate('ShoppingListDetail', { shoppingListId: list.id });
  };

  const handleAdd = async (name) => {
    try {
      const newList = await addShoppingList(
        { name,
          userId: user.id,
          items: [],
        });
      setAddingShoppingList(false);
      setShowModalAdd(false)
      navigation.navigate('ShoppingListDetail', { shoppingListId: newList.id });
    } catch (err) {
      console.error('Erreur lors de la création de la liste :', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteShoppingList(id);
    } catch (err) {
      console.error('Erreur lors de la suppression de la liste :', err);
    }
  };

  const handleGenerateFromRecipe = async (selectedRecipes) => {
    try {
      const newList = await generateShoppingListFromRecipes(selectedRecipes, user.id)
      setShowModalGenerateFromRecipe(false);
      navigation.navigate('ShoppingListDetail', { shoppingListId: newList.id });
    } catch (err) {
      console.error('Erreur lors de la création de la liste :', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar search={search} setSearch= {setSearch}/>
      </View>

      {filteredShoppingLists.length === 0 ? (
        <Text style={styles.emptyText}>Aucune liste de course trouvées</Text>
      ) : (
        <>
          <FlatList
            data={filteredShoppingLists}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ShoppingListCard
                shoppingList={item}
                onPress={() => handlePressShoppingList(item)}
                onDelete={() => handleDelete(item.id)}
              />
              )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
          <Text style={styles.countText}>{filteredShoppingLists.length} liste de course trouvées</Text>
        </>
      )}
      <FloatingButton onPress={() => setAddingShoppingList(true)}/>

      <ReusableModal
        visible={addingShoppingList}
        onClose={() => setAddingShoppingList(false)}
      >
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => {setShowModalAdd(true); setAddingShoppingList(false);}}>
              <Text style={styles.buttonText}>Créer une nouvelle liste de course</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {setShowModalGenerateFromRecipe(true); setAddingShoppingList(false);}}>
              <Text style={styles.buttonText}>Générer une liste de course à partir de recettes</Text>
          </TouchableOpacity>
      </View>
      </ReusableModal>

      <ChooseNameModal
        visible={showModalAdd}
        title={"Nom de la liste de course :"}
        placeholder={"Course du week-end"} 
        onSubmit={handleAdd}
        onCancel={() => {setShowModalAdd(false)}}
      />

      <GenerateFromRecipeModal
        visible={showModalGenerateFromRecipe}
        onSubmit={handleGenerateFromRecipe}
        onCancel={() => {setShowModalGenerateFromRecipe(false)}}
      />
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    marginTop:20,
    flex: 1,
    padding: 8,
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
  buttonRow: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 2,
    marginHorizontal: 2,
    width: '90%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgb(180, 180, 230)',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgb(180, 180, 230)',
    textAlign: 'center',
  },
});