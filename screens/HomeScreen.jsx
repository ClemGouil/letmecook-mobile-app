import * as React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, FlatList, Image, Dimensions, TextInput } from 'react-native';
import { useRecipe } from '../hooks/useRecipe'
import { useUser } from '../hooks/useUser';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';

export default function HomeScreen() {

  const RECIPE_PUBLIC_LOAD_SIZE = 10;

  const navigation = useNavigation();

  const { publicRecipes, searchIngredients,  loadPublicRecipes} = useRecipe();
  const { user} = useUser();

  const [search, setSearch] = React.useState('');
  const [ingredientSearch, setIngredientSearch] = React.useState('');
  const [suggestions, setSuggestions] = React.useState([]);
  const [selectedIngredients, setSelectedIngredients] = React.useState([]);

  const [loading, setLoading] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);

  const ingredientIds = React.useMemo(
    () => selectedIngredients.map(i => i.id),
    [selectedIngredients]
  );

  React.useEffect(() => {
    if (!user?.id) return;
    setOffset(0);
    setHasMore(true);
    loadPublicRecipes( user.id, search.length >= 2 ? search : null, RECIPE_PUBLIC_LOAD_SIZE, 0, ingredientIds, false).then((recipes) => {
      setHasMore(recipes.length === RECIPE_PUBLIC_LOAD_SIZE);
    });
  }, [search, ingredientIds]);


  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (ingredientSearch.length >= 1) {
        searchIngredients(ingredientSearch, 5).then(setSuggestions);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [ingredientSearch]);

  const refreshRecipes = async () => {
    
    setRefreshing(true);
    setOffset(0);
    setHasMore(true);
    try {
      const recipes = await loadPublicRecipes(
        user.id,
        search,
        RECIPE_PUBLIC_LOAD_SIZE,
        0,
        ingredientIds,
        false
      );

      setHasMore(recipes.length === RECIPE_PUBLIC_LOAD_SIZE);
    } finally {
      setRefreshing(false);
    }
  };

  const loadMoreRecipes = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const newOffset = offset + RECIPE_PUBLIC_LOAD_SIZE;

      const recipes = await loadPublicRecipes(
        user.id,
        search,
        RECIPE_PUBLIC_LOAD_SIZE,
        newOffset,
        ingredientIds,
        true
      );

      setOffset(newOffset);
      setHasMore(recipes.length === RECIPE_PUBLIC_LOAD_SIZE);
    } finally {
      setLoadingMore(false);
    }
  };

  const addIngredient = (ingredient) => {
    setSelectedIngredients(prev => {
      if (prev.some(i => i.id === ingredient.id)) return prev;

      return [...prev, {
        id: ingredient.id,
        name: ingredient.name
      }];
    });
  };

  const removeIngredient = (id) => {
    setSelectedIngredients(selectedIngredients.filter(i => i.id !== id));
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
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
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
              data={suggestions}
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
            <View key={ingr.id} style={styles.chip}>
              <Text>{ingr.name}</Text>
              <TouchableOpacity onPress={() => removeIngredient(ingr.id)}>
                <Text style={styles.removeButton}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {publicRecipes.length === 0 ? (
            <Text style={styles.emptyText}>Aucune recette trouvée</Text>
          ) : (
            <FlatList
              data={publicRecipes}
              keyExtractor={(recipe) => recipe.id.toString()}
              renderItem={({ item }) => (
                  <RecipeCard
                    recipe={item}
                    onPress={() => handlePressRecipe(item, false, true)}
                    width={CARD_WIDTH}
                  />)
              }
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              refreshing={refreshing}
              onRefresh={refreshRecipes}
              onEndReached={loadMoreRecipes}
              onEndReachedThreshold={0.5}
            />
          )}
      </View>
    </SafeAreaView>
  );
}

const CARD_MARGIN = 4;
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
    paddingBottom: 40,
  },
  row: {
    justifyContent: 'space-between',
    paddingBottom: 8,
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