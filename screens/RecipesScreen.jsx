import * as React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, FlatList, Image, Dimensions, TextInput } from 'react-native';
import { useRecipe } from '../hooks/useRecipe'
import { useNavigation} from '@react-navigation/native';

export default function RecipesScreen() {

  const navigation = useNavigation();

  const { privateRecipes } = useRecipe();

  const [search, setSearch] = React.useState('');

  const filteredRecipes = privateRecipes.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const renderRecipeCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
    >
      <Image
        source={item.imageUrl}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Rechercher une recette..."
            value={search}
            onChangeText={setSearch}
            style={styles.input}
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.searchButton}>
            <Image source={require('../assets/loupe.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {filteredRecipes.length === 0 ? (
        <Text style={styles.emptyText}>Aucune recette trouvées</Text>
      ) : (
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRecipeCard}
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
    backgroundColor: '#fff',
    padding: 8,
  },
  searchContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 40,
    width: '90%',
    height: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: 'rgb(205, 205, 255)',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 16,
    height: 16,
    tintColor: '#333',
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