import * as React from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { useNavigation} from '@react-navigation/native';
import { useShoppingList } from '../hooks/useShoppingList';
import { useUser } from '../hooks/useUser'

import SearchBar from '../components/SearchBar';
import ShoppingListCard from '../components/ShoppingListCard';
import FloatingButton  from '../components/FloatingButton';
import ReusableModal from '../components/ReusableModal';
import ShoppingListForm from '../components/ShoppingListForm';

export default function ShoppingListScreen() {

  const navigation = useNavigation();

  const { user} = useUser();

  const [search, setSearch] = React.useState('');
  const [addingShoppingList, setAddingShoppingList] = React.useState(false);

  const { shoppingLists, addShoppingList } = useShoppingList();

  const filteredShoppingLists = shoppingLists.filter((sl) => {
    const matchesSearch = sl.name.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const handlePressShoppingList = (list) => {
    navigation.navigate('ShoppingListDetail', { shoppingListId: list.id });
  };

  const handleAdd = async (name) => {
    console.log(name);
    try {
      const newList = await addShoppingList(
        { name,
          userId: user.id,
          items: [],
        });
      setAddingShoppingList(false);
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
        <ShoppingListForm
          onSubmit={handleAdd}
          onCancel={() => setAddingShoppingList(false)}
        />
      </ReusableModal>
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
  }
});