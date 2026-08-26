import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFolder } from '../hooks/useFolder';

import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import BackButton from '../components/BackButton';
import ChooseNameModal from '../components/ChooseNameModal';
import FloatingButton from '../components/FloatingButton';
import ReusableModal from '../components/ReusableModal';

import Icon from 'react-native-vector-icons/Ionicons';

export default function FolderDetailScreen({ route, navigation }) {

  const { folder, singleSelectionMode = false, multipleSelectionMode = false } = route.params || {};

  const { loadRecipesOfFolder, updateFolder, deleteFolder } = useFolder();

  const [search, setSearch] = useState('');
  const [recipes, setRecipes] = useState([]);

  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [showAddFolder, setShowAddFolder] = React.useState(false);
  const [showModalFolder, setShowModalFolder] = React.useState(false);
  const [folderName, setFolderName] = useState(folder.name);

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

      if (result.length < RECIPE_FOLDER_LOAD_SIZE) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      console.error(
        'Erreur lors du chargement des recettes du dossier :',
        err
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setOffset(0);
      setHasMore(true);

      loadRecipes(0, true);
    }, [search])
  );

  const loadMoreRecipes = () => {
    if (loading || !hasMore) return;

    loadRecipes(offset + RECIPE_FOLDER_LOAD_SIZE);
  };

  const handleRecipePress = (recipe) => {
    navigation.navigate('RecipeDetail', {
      recipeId: recipe.id,
    });
  };

  const handleMenuPress = () => {
    setShowModalFolder(true);
  };

  const handleEditFolder = async (name) => {
    try {
      await updateFolder(
        folder.id,
        name
      );
      setShowAddFolder(false);
      setFolderName(name);
    
    } catch (err) {
      console.error(
        'Erreur lors du chargement des recettes du dossier :',
        err
      );
    }
  };

  const handleDeleteFolder = async () => {
    try {
      await deleteFolder(folder.id);
      setShowModalFolder(false);
      navigation.goBack();

    } catch (err) {
      console.error(
        'Erreur lors de la suppression du dossier :',
        err
      );
    }
  };

  const renderRecipe = ({ item }) => {
    return (
      <RecipeCard
        recipe={item}
        width={CARD_WIDTH}
        onPress={() => handleRecipePress(item)}
      />
    );
  };

  const renderEmpty = () => {
    if (loading) return null;

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
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>

        <View style={styles.header}>

          <View style={styles.sideButton}>
            <BackButton
              onPress={() => navigation.goBack()}
              iconSize={18}
              dim={38}
            />
          </View>

          <View style={styles.titleContainer}>
            <Text
              style={styles.title}
              numberOfLines={1}
            >
              {folderName}
            </Text>

            <Text style={styles.count}>
              {folder.recipeCount ?? recipes.length} recettes
            </Text>
          </View>

          <View style={styles.sideButtonRight}>
            {!singleSelectionMode && !multipleSelectionMode && (
              <TouchableOpacity
                style={styles.menuButton}
                onPress={handleMenuPress}
              >
                <Icon
                  name="ellipsis-vertical"
                  size={24}
                  color="#333"
                />
              </TouchableOpacity>
            )}
          </View>

        </View>

        <View style={styles.searchContainer}>
          <SearchBar
            search={search}
            setSearch={setSearch}
          />
        </View>

        <FlatList
          data={recipes}
          keyExtractor={(item) => `folder-recipe-${item.id}`}
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
        {!singleSelectionMode && !multipleSelectionMode && (
          <FloatingButton
            onPress={() =>
              navigation.navigate('FolderAddRecipes', {
                folder: folder,
              })
            }
          />
          )}
        <ReusableModal
          visible={showModalFolder}
          onClose={() => setShowModalFolder(false)}
        >
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={() => {setShowModalFolder(false); setShowAddFolder(true);}}>
                <Text style={styles.buttonText}>Modifier le dossier</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleDeleteFolder}>
                <Text style={styles.buttonText}>Supprimer le dossier</Text>
            </TouchableOpacity>
        </View>
        </ReusableModal>
        <ChooseNameModal
          visible={showAddFolder}
          title={"Nom du folder :"}
          initialValue={folderName}
          placeholder="Mes Desserts"
          onSubmit={handleEditFolder}
          onCancel={() => setShowAddFolder(false)}
        />

      </View>
    </SafeAreaView>
  );
}

const CARD_MARGIN = 4;

const CARD_WIDTH =
  (Dimensions.get('window').width / 2) -
  (CARD_MARGIN * 3);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
    minHeight: 52,
  },
  sideButton: {
    width: 42,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sideButtonRight: {
    width: 42,
    alignItems: 'flex-end',
    justifyContent: 'center',
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
  menuButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  list: {
    paddingBottom: 40,
  },
  row: {
    justifyContent: 'space-between',
    paddingBottom: 8,
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
  buttonRow: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 2,
    width: '90%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgb(180, 180, 230)',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgb(180, 180, 230)',
    textAlign: 'center',
  },
});