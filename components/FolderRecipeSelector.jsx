import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import { useFolder } from '../hooks/useFolder';

import SearchBar from './SearchBar';
import RecipeCard from './RecipeCard';
import BackButton from './BackButton';
import SaveButton from './SaveButton';

import Icon from 'react-native-vector-icons/Ionicons';

export default function FolderRecipeSelector({
  folder,
  singleSelectionMode = false,
  multipleSelectionMode = false,
  selectedRecipeId,
  selectedRecipes = [],
  onRecipePress,
  onSelectionChange,
  onBack,
}) {
  const { loadRecipesOfFolder } = useFolder();

  const [search, setSearch] = useState('');
  const [recipes, setRecipes] = useState([]);

  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const RECIPE_FOLDER_LOAD_SIZE = 10;

  const loadRecipes = async (newOffset = 0, reset = false) => {
    if (loading && !reset) return;

    try {
      setLoading(true);

      const result = await loadRecipesOfFolder(
        folder.id,
        search,
        RECIPE_FOLDER_LOAD_SIZE,
        newOffset
      );

      if (reset) {
        setRecipes(result);
      } else {
        setRecipes(prev => [...prev, ...result]);
      }

      setOffset(newOffset);

      setHasMore(
        result.length >= RECIPE_FOLDER_LOAD_SIZE
      );

    } catch (err) {
      console.error(
        'Erreur lors du chargement des recettes du dossier :',
        err
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setOffset(0);
    setHasMore(true);

    loadRecipes(0, true);
  }, [search, folder.id]);

  const loadMoreRecipes = () => {
    if (loading || !hasMore) return;

    loadRecipes(
      offset + RECIPE_FOLDER_LOAD_SIZE
    );
  };

  const handleRecipePress = (recipe) => {

    if (singleSelectionMode) {
      onRecipePress?.(recipe, false);
      return;
    }

    if (multipleSelectionMode) {
      const exists = selectedRecipes.some(
        selected =>
          selected.recipeId === recipe.id
      );
      if (exists) {
        onSelectionChange?.(
          selectedRecipes.filter(
            selected =>
              selected.recipeId !== recipe.id
          )
        );
        return;
      }
      onSelectionChange?.([
        ...selectedRecipes,
        {
          recipeId: recipe.id,
          imageUrl: recipe.imageUrl,
          name: recipe.name,
          serving: recipe.servings,
          ingredients: recipe.ingredients,
        },
      ]);
    }
  };

  const renderRecipe = ({ item }) => {

    const isSelected =
      (singleSelectionMode &&
        selectedRecipeId === item.id) ||
      (multipleSelectionMode &&
        selectedRecipes.some(
          selected =>
            selected.recipeId === item.id
        ));

    return (
      <View
        style={[
          isSelected &&
            styles.selectedWrapper,
        ]}
      >
        <RecipeCard
          recipe={item}
          width={CARD_WIDTH}
          onPress={() =>
            handleRecipePress(item)
          }
        />
      </View>
    );
  };

  const renderEmpty = () => {

    if (loading) {
      return null;
    }

    return (
      <View style={styles.emptyContainer}>

        <Icon
          name="folder-open-outline"
          size={42}
          color="rgb(180, 180, 230)"
        />

        <Text style={styles.emptyTitle}>
          Aucune recette
        </Text>

        <Text style={styles.emptyText}>
          Ce dossier ne contient aucune recette.
        </Text>

      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>

        <View style={styles.sideButton}>
          <BackButton
            onPress={onBack}
            iconSize={18}
            dim={38}
          />
        </View>

        <View style={styles.titleContainer}>
          <Text
            style={styles.title}
            numberOfLines={1}
          >
            {folder.name}
          </Text>
          <Text style={styles.count}>
            {folder.recipeCount ?? recipes.length} recettes
          </Text>
        </View>
        <View style={styles.sideButtonRight} />
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          search={search}
          setSearch={setSearch}
        />
      </View>

      <FlatList
        data={recipes}
        keyExtractor={(item) =>
          `folder-recipe-selector-${item.id}`
        }
        renderItem={renderRecipe}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
        onEndReached={loadMoreRecipes}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && recipes.length > 0 ? (
            <View style={styles.loadingContainer}>

              <ActivityIndicator
                size="small"
                color="rgb(180, 180, 230)"
              />

            </View>
          ) : null
        }
      />

      {multipleSelectionMode && (
        <View style={styles.bottomButtonContainer}>

          <SaveButton
            title={
              selectedRecipes.length > 0
                ? `Ajouter (${selectedRecipes.length})`
                : 'Ajouter'
            }
            onPress={onBack}
            disabled={
              selectedRecipes.length === 0
            }
          />

        </View>
      )}

    </View>
  );
}

const CARD_MARGIN = 4;

const CARD_WIDTH = (Dimensions.get('window').width / 2) - (CARD_MARGIN * 3);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    minHeight: 52,
  },
  sideButton: {
    width: 42,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sideButtonRight: {
    width: 42,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  count: {
    marginTop: 2,
    fontSize: 14,
    color: '#777',
  },
  searchContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  list: {
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  selectedWrapper: {
    borderWidth: 3,
    borderColor: 'rgb(180, 180, 230)',
    borderRadius: 20,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyText: {
    marginTop: 6,
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});