import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";

import { useShoppingList } from '../hooks/useShoppingList';
import { SafeAreaView } from 'react-native-safe-area-context';

import RecipeSelector from '../components/RecipeSelector';
import FolderRecipeSelector from '../components/FolderRecipeSelector';
import IngredientSelector from '../components/IngredientSelector';
import BackButton from '../components/BackButton';
import SaveButton from '../components/SaveButton';

export default function GenerateFromRecipeScreen({ navigation }) {

  const { generateShoppingListFromRecipes } = useShoppingList();

  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [recipeSelected, setRecipeSelected] = useState(false);

  const [folderSelectorVisible, setFolderSelectorVisible] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const [servings, setServings] = useState({});
  const [selectedIngredients, setSelectedIngredients] = useState({});

  useEffect(() => {
    setServings(prev => {
      const next = {};

      selectedRecipes.forEach(recipe => {
        next[recipe.recipeId] =
          prev[recipe.recipeId] ?? recipe.serving;
      });

      return next;
    });

    setSelectedIngredients(prev => {
      const next = {};

      selectedRecipes.forEach(recipe => {
        next[recipe.recipeId] =
          prev[recipe.recipeId] ??
          (recipe.ingredients || []).map(item => item.ingredient.id);
      });

      return next;
    });
  }, [selectedRecipes]);

  const handleCancel = () => {
    setSelectedRecipes([]);
    setRecipeSelected(false);
    navigation.goBack();
  };

  const toggleAll = (recipeId) => {
    const allIds = selectedRecipes.find(r => r.recipeId === recipeId).ingredients.map(i => i.ingredient.id);
    const currentSelected = selectedIngredients[recipeId] || [];
    const allSelected = allIds.every(id => currentSelected.includes(id));
    setSelectedIngredients(prev => ({
      ...prev,
      [recipeId]: allSelected ? [] : allIds,
    }));
  };

  const isSelected = (recipeId, item) => {
    return (selectedIngredients[recipeId] || []).includes(item.ingredient.id);
  };

  const toggleSelection = (recipeId, itemId, checked) => {
    const current = selectedIngredients[recipeId] || [];
    if (checked) {
      setSelectedIngredients(prev => ({
        ...prev,
        [recipeId]: [...current, itemId],
      }));
    } else {
      setSelectedIngredients(prev => ({
        ...prev,
        [recipeId]: current.filter(id => id !== itemId),
      }));
    }
  };

  const increaseServings = (recipeId) => {
    setServings(prev => ({ ...prev, [recipeId]: prev[recipeId] + 1 }));
  };

  const decreaseServings = (recipeId) => {
    setServings(prev => ({ ...prev, [recipeId]: Math.max(1, prev[recipeId] - 1) }));
  };

  const getScaledQuantity = (originalQuantity, recipeId) => {
    const currentServings = servings[recipeId] || 1;
    const recipe = selectedRecipes.find(r => r.recipeId === recipeId);
    if (!recipe) return originalQuantity;
    const originalServings = recipe.serving;
    const ratio = currentServings / originalServings;
    return Math.round(originalQuantity * ratio * 100) / 100;
  }

  const handleGenerate = async () => {
    const dto = selectedRecipes.map(recipe => ({
      recipeId: recipe.recipeId,
      serving: servings[recipe.recipeId],
      ingredientIds: selectedIngredients[recipe.recipeId] || [],
    }));
    try {
      const newList =
        await generateShoppingListFromRecipes(
          dto
        );
      navigation.replace('ShoppingListDetail', {
        shoppingListId: newList.id,
      });
    } catch (err) {
      console.error(
        'Erreur lors de la création de la liste :',
        err
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {!recipeSelected && (
          <>
            <View style={styles.headerButtons}>
              <BackButton onPress={handleCancel} />
              <Text style={styles.titlePage}>
                Sélectionner des recettes
              </Text>
              <View style={styles.headerSpacer} />
            </View>

            {folderSelectorVisible ? (

              <FolderRecipeSelector
                folder={selectedFolder}
                multipleSelectionMode={true}
                selectedRecipes={selectedRecipes}
                onSelectionChange={setSelectedRecipes}

                onBack={() => {
                  setFolderSelectorVisible(false);
                  setSelectedFolder(null);
                }}
              />
            ) : (
              <RecipeSelector
                multipleSelectionMode={true}
                selectedRecipes={selectedRecipes}
                onSelectionChange={setSelectedRecipes}
                onFolderPress={(folder) => {
                  setSelectedFolder(folder);
                  setFolderSelectorVisible(true);
                }}
              />
            )}

            <View style={styles.bottomButtonContainer}>
              <SaveButton
                title={
                  selectedRecipes.length > 0
                    ? `Générer (${selectedRecipes.length})`
                    : 'Générer'
                }
                onPress={() => setRecipeSelected(true)}
                disabled={
                  selectedRecipes.length === 0
                }
              />
            </View>
          </>
        )}

        {selectedRecipes.length > 0 && recipeSelected && (

          <ScrollView
            style={styles.selectedContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerButtons}>
              <BackButton onPress={() => setRecipeSelected(false)}/>
              <Text style={styles.titlePage}>
                Choisir les quantités
              </Text>
              <SaveButton
                onPress={handleGenerate}
                title="Générer"
                disabled={
                  selectedRecipes.length === 0
                }
              />
            </View>
            {selectedRecipes.map(recipe => (
              <View key={recipe.recipeId} style={styles.cardContainer}>
              <View style={styles.headerRow}>
                <Image
                  source={
                    recipe.imageUrl
                      ? { uri: recipe.imageUrl }
                      : require('../assets/loupe.png')
                  }
                  style={styles.image}
                />
                <Text style={styles.title}>{recipe.name}</Text>
              </View>
              <IngredientSelector 
                title={"Eléments à ajouter à la liste"}
                items={recipe.ingredients}
                selectedIngredients={selectedIngredients[recipe.recipeId] || []}
                serving={servings[recipe.recipeId]}
                toggleAll={() => toggleAll(recipe.recipeId)}
                isSelected={(item) => isSelected(recipe.recipeId, item)}
                toggleSelection={(item, checked) => toggleSelection(recipe.recipeId, item.ingredient.id, checked)}
                getScaledQuantity={(originalQuantity) => getScaledQuantity(originalQuantity, recipe.recipeId)}
                onIncrease={() => increaseServings(recipe.recipeId)}
                onDecrease={() => decreaseServings(recipe.recipeId)}
              />
            </View>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  headerButtons: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerSpacer: {
    width: 42,
  },
  titlePage: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  selectedContainer: {
    paddingBottom: 20,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical : 10,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flexShrink: 1,
  },
});