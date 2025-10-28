import * as React from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { useNavigation} from '@react-navigation/native';
import { useShoppingList } from '../hooks/useShoppingList';

import SearchBar from '../components/SearchBar';
import ShoppingListCard from '../components/ShoppingListCard';
import FloatingButton  from '../components/FloatingButton';

export default function ShoppingListScreen() {

  const navigation = useNavigation();

  const [search, setSearch] = React.useState('');

  const { shoppingLists} = useShoppingList();

  const filteredShoppingLists = shoppingLists.filter((sl) => {
    const matchesSearch = sl.name.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const handlePressShoppingList = (list) => {
    navigation.navigate('ShoppingListDetail', { shoppingListId: list.id });
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
      <FloatingButton/>
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