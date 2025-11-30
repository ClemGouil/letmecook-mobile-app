import * as React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, FlatList, Image, Dimensions, TextInput } from 'react-native';
import { useRecipe } from '../hooks/useRecipe'
import { useUser } from '../hooks/useUser';
import { useNavigation } from '@react-navigation/native';

import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';

export default function HomeScreen() {

  const navigation = useNavigation();

  const { publicRecipes, ingredients} = useRecipe();
  const { user} = useUser();

  const [search, setSearch] = React.useState('');
  const [ingredientSearch, setIngredientSearch] = React.useState('');
  const [selectedIngredients, setSelectedIngredients] = React.useState([]);

  const filteredRecipes = React.useMemo(() => {
    return publicRecipes.filter((r) => {
      const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
      const matchesIngredients =
        selectedIngredients.length === 0 ||
        selectedIngredients.some((ingr) => r.ingredients.some(i => i.ingredient.name.toLowerCase().includes(ingr.toLowerCase())));
      return matchesSearch && matchesIngredients;
    });
  }, [search, selectedIngredients, publicRecipes]);

  const filteredIngredients = ingredients.filter((i) => {
    const matchesSearch = i.name.toLowerCase().includes(ingredientSearch.toLowerCase());
    return matchesSearch;
  });

  const addIngredient = (ingredient) => {
    if (!selectedIngredients.includes(ingredient.name)) {
      setSelectedIngredients([...selectedIngredients, ingredient.name]);
    }
  };

  const removeIngredient = (ingredient) => {
    setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient));
  };

  const handlePressRecipe = (item, isGroup, isPublic) => {
    const currentUserId = user.id;

    const isOwner = isGroup 
      ? item.recipe.ownerId === currentUserId 
      : item.ownerId === currentUserId;

    navigation.navigate('RecipeDetail', {
      recipeId: isGroup ? item.recipe.id : item.id,
      isOwner,
      isGroupRecipe: isGroup,
      isPublic,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar search={search} setSearch={setSearch} />
      </View>
      <View style={styles.ingredientSearchContainer}>
        <TextInput
          style={styles.ingredientInput}
          placeholder="Rechercher par ingrédient..."
          value={ingredientSearch}
          onChangeText={setIngredientSearch}
        />
        {ingredientSearch.length > 0 && (
          <FlatList
            data={filteredIngredients}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.ingredientItem}
                onPress={() => {
                  addIngredient(item);
                  setIngredientSearch('');
                }}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
            style={styles.ingredientList}
          />
        )}
      </View>

      <View style={styles.selectedIngredientsContainer}>
        {selectedIngredients.map((ingr) => (
          <View key={ingr} style={styles.chip}>
            <Text>{ingr}</Text>
            <TouchableOpacity onPress={() => removeIngredient(ingr)}>
              <Text style={styles.removeButton}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {filteredRecipes.length === 0 ? (
          <Text style={styles.emptyText}>Aucune recette trouvée</Text>
        ) : (
          <FlatList
            data={filteredRecipes}
            keyExtractor={(recipe) => recipe.id.toString()}
            renderItem={({ item }) => (
              <RecipeCard
                recipe={item}
                onPress={() => handlePressRecipe(item, false, true)}
                width={CARD_WIDTH}
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
  emptyText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 40,
    fontSize: 16,
  },
  ingredientSearchContainer: {
    paddingHorizontal: 10,
  },
  ingredientInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderColor: "rgb(180, 180, 230)",
  },
  ingredientList: {
    marginTop: 5,
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  ingredientItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedIngredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(205, 205, 255)',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    margin: 4,
  },
  removeButton: {
    marginLeft: 8,
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
});