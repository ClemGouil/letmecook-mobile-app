import * as React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, FlatList, Image, Dimensions, TextInput } from 'react-native';
import { useRecipe } from '../hooks/useRecipe'
import { useNavigation} from '@react-navigation/native';

import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';

export default function RecipesScreen() {

  const navigation = useNavigation();

  const { privateRecipes } = useRecipe();

  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    console.log("Recettes :", privateRecipes);
  }, [privateRecipes]);

  const filteredRecipes = privateRecipes.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const handlePressRecipe = (recipeId) => {
    navigation.navigate('RecipeDetail', { recipeId : recipeId });
  };

  return (
    <View style={styles.container}>

      <View style={styles.searchContainer}>
        <SearchBar search={search} setSearch= {setSearch}/>
      </View>

      {filteredRecipes.length === 0 ? (
        <Text style={styles.emptyText}>Aucune recette trouvées</Text>
      ) : (
        <FlatList
          data={filteredRecipes}
          keyExtractor={(recipe) => recipe.id.toString()}
          renderItem={({ item }) => (
              <RecipeCard
                recipe={item}
                onPress={() => handlePressRecipe(item.id)}
              />
              )}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const CARD_MARGIN = 6;
const CARD_WIDTH = (Dimensions.get('window').width / 2) - (CARD_MARGIN * 3);

const styles = StyleSheet.create({
  container: {
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
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: CARD_WIDTH,
  },
  image: {
    width: '100%',
    height: 120,
  },
  textContainer: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 40,
    fontSize: 16,
  },
});