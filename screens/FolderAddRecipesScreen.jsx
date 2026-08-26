import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Image, ScrollView } from "react-native";
import { useFolder } from '../hooks/useFolder';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecipeSelector from '../components/RecipeSelector';
import BackButton from '../components/BackButton';
import SaveButton from '../components/SaveButton';

export default function FolderAddRecipesScreen ({ route, navigation }) {

  const { folder } = route.params;

  const { loadRecipesOfFolder, addRecipeToFolder, removeRecipeFromFolder } = useFolder();

  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [initialRecipes, setInitialRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadExistingRecipes = async () => {
      try {
        const recipes = await loadRecipesOfFolder(
          folder.id,
          null,
          folder.recipeCount,
          0
        );

        const formattedRecipes = recipes.map(recipe => ({
          recipeId: recipe.id,
          imageUrl: recipe.imageUrl,
          name: recipe.name,
          portions: recipe.servings,
        }));

        setInitialRecipes(formattedRecipes);
        setSelectedRecipes(formattedRecipes);
      } catch (err) {
        console.error(
          'Erreur lors du chargement des recettes du dossier :',
          err
        );
      }
    };

    loadExistingRecipes();
  }, []);

  const handleCancel = () => {
    setSelectedRecipes([]);
    navigation.goBack();
  };

  const handleAddAndRemoveRecipes  = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const initialIds = initialRecipes.map(
        recipe => recipe.recipeId
      );

      const selectedIds = selectedRecipes.map(
        recipe => recipe.recipeId
      );

      const recipesToAdd = selectedIds.filter(
        recipeId => !initialIds.includes(recipeId)
      );

      const recipesToRemove = initialIds.filter(
        recipeId => !selectedIds.includes(recipeId)
      );

      await Promise.all([
        ...recipesToAdd.map(recipeId =>
          addRecipeToFolder(folder.id, recipeId)
        ),

        ...recipesToRemove.map(recipeId =>
          removeRecipeFromFolder(folder.id, recipeId)
        ),
      ]);

      navigation.goBack();

    } catch (err) {
      console.error(
        'Erreur lors de la modification des recettes du dossier :',
        err
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>

        <View style={styles.headerButtons}>
            <BackButton onPress={handleCancel}/>
            <Text style={styles.titlePage}>Sélectionner des recettes</Text>
            <SaveButton
              onPress={handleAddAndRemoveRecipes}
              title="Valider"
              disabled={loading}
            />         
        </View>

        <RecipeSelector
          multipleSelectionMode={true}
          selectedRecipes={selectedRecipes}
          onSelectionChange={setSelectedRecipes}
          hideFolders={true}
      />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  headerButtons: {
    paddingVertical : 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  titlePage: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
});