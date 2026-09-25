import * as React from 'react';
import { Text, View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useRecipe } from '../hooks/useRecipe'
import { useUser } from '../hooks/useUser';
import { usePaginatedList } from '../hooks/usePaginatedList';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import RecipeFilter from '../components/RecipeFilter';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';

export default function HomeScreen() {

  const navigation = useNavigation();

  const { loadPublicRecipes} = useRecipe();
  const { user} = useUser();

  const [search, setSearch] = React.useState('');
  const [selectedIngredients, setSelectedIngredients] = React.useState([]);
  const [selectedCategories, setSelectedCategories] = React.useState([]);

  const [filtersOpen, setFiltersOpen] = React.useState(false);

  const ingredientIds = React.useMemo(
    () => selectedIngredients.map(i => i.id),
    [selectedIngredients]
  );

  const categoryIds = React.useMemo(
    () => selectedCategories.map(i => i.id),
    [selectedCategories]
  );
  
  const RECIPE_PUBLIC_LOAD_SIZE = 10;

  const loadRecipePage = React.useCallback(
    async (offset, limit) => {
      console.log('LOAD PAGE', { offset, limit });
      if (!user?.id) {
        return [];
      }

      const result = await loadPublicRecipes(
        user.id,
        search.length >= 2 ? search : null,
        limit,
        offset,
        ingredientIds,
        categoryIds,
      );

      return result;
    },
    [
      user?.id,
      search,
      ingredientIds,
      categoryIds,
      loadPublicRecipes,
    ]
  );

  const {
    items: publicRecipes,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    loadInitial,
    loadMore,
    refresh,
    reset,
  } = usePaginatedList({
    loadPage: loadRecipePage,
    pageSize: RECIPE_PUBLIC_LOAD_SIZE,
  });

  React.useEffect(() => {
    if (!user?.id) return;
    reset();
    loadInitial();
  }, [
    user?.id,
    search,
    ingredientIds,
    categoryIds,
    loadInitial,
    reset,
  ]);

  const handleFiltersChange = ({
    selectedIngredients,
    selectedCategories,
  }) => {
    setSelectedIngredients(selectedIngredients);
    setSelectedCategories(selectedCategories);
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
        
        <View style={styles.filterContainer}>
          <RecipeFilter
            onFiltersChange={handleFiltersChange}
            onOpenChange={setFiltersOpen}
          />
        </View>
        
        {filtersOpen ? null : (
          loading ? (
            <LoadingState />
          ) :
            publicRecipes.length === 0 ? (
              <EmptyState
                iconName="restaurant-outline"
                title="Aucune recette"
                message="Aucune recette ne correspond à votre recherche."
              />
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
                onRefresh={refresh}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                  loadingMore ? (
                    <LoadingState
                      fullScreen={false}
                      text={"Chargement..."}
                      size="small"
                    />
                  ) : null
                }
              />
             )
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
  filterContainer: {
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
});