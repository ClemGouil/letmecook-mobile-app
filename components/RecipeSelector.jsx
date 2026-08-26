import React, { useEffect, useState } from 'react';
import {Text, View, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';

import { useRecipe } from '../hooks/useRecipe';
import { useGroup } from '../hooks/useGroup';
import { useFolder } from '../hooks/useFolder';
import { useUser } from '../hooks/useUser';
import { useNavigation } from '@react-navigation/native';

import SearchBar from './SearchBar';
import RecipeCard from './RecipeCard';
import ChooseNameModal from './ChooseNameModal';

export default function RecipeSelector({ onRecipePress, singleSelectionMode = false, selectedRecipeId, multipleSelectionMode = false, selectedRecipes = [], onSelectionChange, hideFolders= false, onFolderPress}) {

  const navigation = useNavigation();

  const { privateRecipes, groupRecipes, loadGroupRecipes } = useRecipe();
  const { groups } = useGroup();
  const { folders, addFolder } = useFolder();
  const { user } = useUser();

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('privateRecipes');
  const [subActiveTab, setSubActiveTab] = useState(null);

  const [showAddFolder, setShowAddFolder] = React.useState(false);

  useEffect(() => {
    if (groups.length > 0 && !subActiveTab) {
      setSubActiveTab(groups[0].id);
    }
  }, [groups]);

  useEffect(() => {
    if (activeTab !== 'groupRecipes') return;
    if (!subActiveTab) return;

    loadGroupRecipes(subActiveTab);
  }, [activeTab, subActiveTab]);

  const filteredRecipes = privateRecipes.filter((recipe) => {
    if (!recipe?.name) return false;

    return recipe.name
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const filteredGroupRecipes = groupRecipes.filter((item) => {
    if (!item?.recipe?.name) return false;

    return item.recipe.name
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const getOwnerById = (groupMembers, ownerId) => {
    const member = groupMembers?.find(
      member => member.user.id === ownerId
    );

    return member ? member.user : null;
  };

  const handleRecipePress = (item, isGroup) => {
    const recipe = isGroup ? item.recipe : item;

    if (!multipleSelectionMode) {
      onRecipePress?.(item, isGroup);
      return;
    }

    const exists = selectedRecipes.some(
      selected => selected.recipeId === recipe.id
    );

    if (exists) {
      onSelectionChange?.(
        selectedRecipes.filter(
          selected => selected.recipeId !== recipe.id
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
  };

  const handleAddFolder = async (name) => {
    try {
      const createdFolder = await addFolder({
        name,
        userId: user.id,
      });

      setShowAddFolder(false);

      navigation.navigate('FolderDetail', {
        folder: createdFolder,
      });

    } catch (err) {
      console.error(
        'Erreur lors de la création du dossier :',
        err
      );
    }
  };

  const renderListHeader = () => (
    <>
      {activeTab === 'privateRecipes' && !hideFolders && (
        <>
          <View style={styles.sectionContainer}>

            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>
                Dossiers
              </Text>
            </View>

            <View style={styles.foldersContainer}>
              <FlatList
                horizontal
                data={folders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.folderCard}
                    onPress={() => onFolderPress?.(item)}
                  >
                    <Text style={styles.folderCardText}>
                      {item.name}
                    </Text>

                    <Text style={styles.folderCount}>
                      {item.recipeCount} recettes
                    </Text>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
                ListFooterComponent={() => (
                  <TouchableOpacity
                    style={styles.folderButton}
                    onPress={() => setShowAddFolder(true)}
                  >
                    <Text style={styles.folderButtonText}>
                      + Ajouter un dossier
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>
                Recettes
              </Text>
            </View>

          </View>
        </>
      )}

      {activeTab === 'groupRecipes' && (
        <>
          <View style={styles.subtabsCard}>
            {groups?.map((group) => (
              <TouchableOpacity
                key={group.id}
                style={[
                  styles.tabButton,
                  subActiveTab === group.id &&
                    styles.activeTab,
                ]}
                onPress={() => setSubActiveTab(group.id)}
              >
                <Text
                  style={[
                    styles.tabText,
                    subActiveTab === group.id &&
                      styles.activeTabText,
                  ]}
                >
                  {group.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>
              Recettes
            </Text>
          </View>
        </>
      )}
    </>
  );

  const renderEmptyComponent = () => (
    <Text style={styles.emptyText}>
      Aucune recette trouvée
    </Text>
  );

  return (
    <View style={styles.container}>

      <View style={styles.searchContainer}>
        <SearchBar
          search={search}
          setSearch={setSearch}
        />
      </View>

      <View
        style={[
          styles.tabsCard,
          activeTab === 'privateRecipes'
            ? { marginBottom: 16 }
            : { marginBottom: 2 },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'privateRecipes' &&
              styles.activeTab,
          ]}
          onPress={() => setActiveTab('privateRecipes')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'privateRecipes' &&
                styles.activeTabText,
            ]}
          >
            Mes Recettes
          </Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'groupRecipes' &&
              styles.activeTab,
          ]}
          onPress={() => setActiveTab('groupRecipes')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'groupRecipes' &&
                styles.activeTabText,
            ]}
          >
            Recettes de groupe
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={
          activeTab === 'privateRecipes'
            ? filteredRecipes
            : filteredGroupRecipes
        }
        keyExtractor={(item) =>
          activeTab === 'privateRecipes'
            ? `private-${item.id}`
            : `group-${item.recipe.id}`
        }
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyComponent}
        renderItem={({ item }) => {

          if (activeTab === 'privateRecipes') {

            const isSelected =
              (multipleSelectionMode &&
                selectedRecipes.some(
                  selected => selected.recipeId === item.id
                )) ||
              (singleSelectionMode && selectedRecipeId === item.id);

            return (
              <View style={[
                isSelected && styles.selectedWrapper,
              ]}>
              <RecipeCard
                recipe={item}
                onPress={() => handleRecipePress(item, false)}
                width={CARD_WIDTH}
                
              />
              <ChooseNameModal
                visible={showAddFolder}
                title="Nom du dossier :"
                placeholder="Mes Desserts"
                onSubmit={handleAddFolder}
                onCancel={() => setShowAddFolder(false)}
              />
            </View>
            );
          }

          const group = groups.find(
            group => group.id === item.groupId
          );

          const owner = group
            ? getOwnerById(
                group.members,
                item.recipe.ownerId
              )
            : null;

          const isSelected =
            (multipleSelectionMode &&
              selectedRecipes.some(
                selected => selected.recipeId === item.recipe.id
              )) ||
            (singleSelectionMode &&
              selectedRecipeId === item.recipe.id);

          return (
          <View style={[
            isSelected && styles.selectedWrapper,
          ]}>
            <RecipeCard
              recipe={item.recipe}
              onPress={() => handleRecipePress(item, true)}
              width={CARD_WIDTH}
              isGroup={true}
              owner={owner}
            />
          </View>
          );
        }}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

    </View>
  );
}

const CARD_MARGIN = 5;

const CARD_WIDTH =
  (Dimensions.get('window').width / 2) -
  (CARD_MARGIN * 3);

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  tabsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: 'rgb(180, 180, 230)',
  },
  separator: {
    width: 1,
    height: '60%',
    backgroundColor: '#ccc',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: 'rgb(180, 180, 230)',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgb(180, 180, 230)',
  },
  subtabsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: 'rgb(180, 180, 230)',
  },
  sectionContainer: {
    marginBottom: 4,
  },
  sectionTitleContainer: {
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  foldersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  folderCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderColor: 'rgb(180, 180, 230)',
    borderWidth: 1,
    borderRadius: 12,
    marginRight: 12,
    width: 140,
    alignItems: 'flex-start',
  },
  folderCardText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  folderCount: {
    fontSize: 14,
    color: '#555',
  },
  folderButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderColor: 'rgb(180, 180, 230)',
    borderWidth: 1,
    borderRadius: 12,
    width: 140,
    minHeight: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  folderButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgb(180, 180, 230)',
    textAlign: 'center',
  },
  selectedWrapper: {
    borderWidth: 3,
    borderColor: 'rgb(180, 180, 230)',
    borderRadius: 20,
  },
});