import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { useUser } from '../hooks/useUser';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import RecipeSelector from '../components/RecipeSelector';
import FloatingButton from '../components/FloatingButton';

export default function RecipesScreen() {

  const navigation = useNavigation();
  const { user } = useUser();

  const screenTitle = 'Mes recettes';

  const handlePressRecipe = (item, isGroup) => {
    if (!user) return;

    const currentUserId = user.id;

    const isOwner = isGroup
      ? item.recipe.ownerId === currentUserId
      : item.ownerId === currentUserId;

    navigation.navigate('RecipeDetail', {
      recipeId: isGroup ? item.recipe.id : item.id,
      groupId: isGroup ? item.groupId : null,
      isOwner,
      isGroupRecipe: isGroup,
    });
  };

  const handlePressFolder = (folder) => {
    navigation.navigate('FolderDetail', {
      folder,
    });
  };

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      edges={['top', 'left', 'right']}
    >
      <View style={styles.container}>

        <View style={styles.headerRow}>
          <Text style={styles.titlePage}>
            {screenTitle}
          </Text>

          <View style={{ height: 60 }} />
        </View>

        <RecipeSelector
          onRecipePress={handlePressRecipe}
          onFolderPress={handlePressFolder}
        />

        <FloatingButton
          onPress={() => navigation.navigate('RecipeForm')}
        />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  titlePage: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
});