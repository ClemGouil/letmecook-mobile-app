import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, FlatList, Image, Dimensions, TextInput } from 'react-native';
import { useRecipe } from '../hooks/useRecipe'
import { useGroup } from '../hooks/useGroup';
import { useUser } from '../hooks/useUser'
import { useNavigation} from '@react-navigation/native';

import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';

export default function RecipesScreen() {

  const navigation = useNavigation();
  const { user } = useUser();

  const { privateRecipes, groupRecipes, loadGroupRecipes} = useRecipe();
  const { groups} = useGroup();

  const [search, setSearch] = React.useState('');
  const [activeTab, setActiveTab] = useState('privateRecipes');
  const [subActiveTab, setSubActiveTab] = useState(groups[0].id);

  React.useEffect(() => {
    console.log("Recettes :", privateRecipes);
  }, [privateRecipes]);

  React.useEffect(() => {
    if (activeTab === "groupRecipes" && subActiveTab) {
      loadGroupRecipes(subActiveTab);
      console.log(groupRecipes)
    }
  }, [activeTab, subActiveTab]);

  const filteredRecipes = privateRecipes.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const filteredGroupRecipes = groupRecipes.filter((r) => {
    if (!r?.recipe?.name) return false;
    return r.recipe.name.toLowerCase().includes(search.toLowerCase());
  });

  const handlePressRecipe = (item, isGroup) => {
    const currentUserId = user.id;

    const isOwner = isGroup 
      ? item.recipe.ownerId === currentUserId 
      : item.ownerId === currentUserId;

    navigation.navigate('RecipeDetail', {
      recipeId: isGroup ? item.recipe.id : item.id,
      isOwner,
      isGroupRecipe: isGroup
    });
  };

  return (
    <View style={styles.container}>

      <View style={styles.searchContainer}>
        <SearchBar search={search} setSearch={setSearch} />
      </View>

      <View style={[styles.tabsCard, activeTab === 'privateRecipes' ? { marginBottom: 16 } : { marginBottom: 2 }]}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'privateRecipes' && styles.activeTab]}
          onPress={() => setActiveTab('privateRecipes')}
        >
          <Text style={[styles.tabText, activeTab === 'privateRecipes' && styles.activeTabText]}>Mes Recettes</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'groupRecipes' && styles.activeTab]}
          onPress={() => setActiveTab('groupRecipes')}
        >
          <Text style={[styles.tabText, activeTab === 'groupRecipes' && styles.activeTabText]}>Recette de groupe</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'privateRecipes' && (
        <>
          {filteredRecipes.length === 0 ? (
            <Text style={styles.emptyText}>Aucune recette trouvée</Text>
          ) : (
            <FlatList
              data={filteredRecipes}
              keyExtractor={(recipe) => recipe.id.toString()}
              renderItem={({ item }) => (
                <RecipeCard
                  recipe={item}
                  onPress={() => handlePressRecipe(item, false)}
                  width={CARD_WIDTH}
                />
              )}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}

      {activeTab === 'groupRecipes' && (
        <>
          <View style={styles.subtabsCard}>
            {groups.map((group) => (
              <TouchableOpacity
                key={group.id}
                style={[styles.tabButton, subActiveTab === group.id && styles.activeTab]}
                onPress={() => setSubActiveTab(group.id)}
              >
                <Text style={[styles.tabText, subActiveTab === group.id && styles.activeTabText]}>
                  {group.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {filteredGroupRecipes.length === 0 ? (
              <Text style={styles.emptyText}>Aucune recette trouvée</Text>
            ) : (
              <FlatList
                data={filteredGroupRecipes}
                keyExtractor={(recipe) => recipe.id.toString()}
                renderItem={({ item }) => (
                  <RecipeCard
                    recipe={item.recipe}
                    onPress={() => handlePressRecipe(item, true)}
                    width={CARD_WIDTH}
                  />
                )}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
              />
            )
          }
        </>
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
  tabsCard: {
    flexDirection: 'row',
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth : 1,
    borderColor : 'rgb(180, 180, 230)',
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
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth : 1,
    borderColor : 'rgb(180, 180, 230)',
  }
});