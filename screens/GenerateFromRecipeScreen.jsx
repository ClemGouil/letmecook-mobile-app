import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions, Image, ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { useRecipe } from '../hooks/useRecipe'
import { useGroup } from '../hooks/useGroup';
import { useShoppingList } from '../hooks/useShoppingList';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import ServingsControl from '../components/ServingsControl'
import BackButton from '../components/BackButton';
import SaveButton from '../components/SaveButton';

export default function GenerateFromRecipeScreen({ navigation }) {

  React.useEffect(() => {
      setSearch('');
      setSelectedRecipes([]);
      setRecipeSelected(false);
      setActiveTab('privateRecipes');
      setSubActiveTab(groups[0]?.id);
  }, [groups]);

  const [search, setSearch] = React.useState('');

  const { privateRecipes, groupRecipes, loadGroupRecipes} = useRecipe();
  const { generateShoppingListFromRecipes } = useShoppingList();
  const { groups} = useGroup();

  const [activeTab, setActiveTab] = useState('privateRecipes');
  const [subActiveTab, setSubActiveTab] = useState(null);

  React.useEffect(() => {
    if (groups.length > 0 && !subActiveTab) {
      setSubActiveTab(groups[0].id);
    }
  }, [groups]);
  
  React.useEffect(() => {
    if (activeTab === "groupRecipes" && subActiveTab) {
      loadGroupRecipes(subActiveTab);
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

  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [recipeSelected, setRecipeSelected] = useState(false);

  const toggleSelect = (recipe) => {

    setSelectedRecipes((prev) => {
      const exists = prev.some(r => r.recipeId === recipe.id);

      if (exists) {
        return prev.filter(r => r.recipeId !== recipe.id);
      }

      return [
        ...prev,
        {
          recipeId: recipe.id,
          imageUrl: recipe.imageUrl,
          name: recipe.name,
          portions: recipe.servings
        }
      ];
    });
  };

  const increaseServings = (recipe) => {
    setSelectedRecipes(prev => prev.map(r => {
      if (r.recipeId === recipe.recipeId) {
        return { ...r, portions: r.portions + 1 };
      }
      return r;
    }));
  };

  const decreaseServings = (recipe) => {
    setSelectedRecipes(prev => prev.map(r => {
      if (r.recipeId === recipe.recipeId && r.portions > 1) {
        return { ...r, portions: r.portions - 1 };
      }
      return r;
    }));
  };

  const handleCancel = () => {
    setSelectedRecipes([]);
    setRecipeSelected(false);
    setSearch('');
    setActiveTab('privateRecipes');
    setSubActiveTab(groups[0].id);
    navigation.goBack();
  };

  const handleGenerate  = async () => {
    try {
      const newList = await generateShoppingListFromRecipes(selectedRecipes)
      navigation.navigate('ShoppingListDetail', { shoppingListId: newList.id });
    } catch (err) {
      console.error('Erreur lors de la création de la liste :', err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {!recipeSelected && (
          <>  
            <View style={styles.headerButtons}>
              <BackButton onPress={handleCancel}/>
              <Text style={styles.titlePage}>Sélectionner des recettes</Text>
              <SaveButton onPress={() => setRecipeSelected(true)} title = "Valider" disabled={selectedRecipes.length === 0} />         
            </View>

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
                      keyExtractor={(item) => `private-${item.id}`}
                      renderItem={({ item }) => {
                        const isSelected = selectedRecipes.some(
                          r => r.recipeId === item.id
                        );

                        return (
                          <View style={isSelected && styles.selectedWrapper}>
                            <RecipeCard
                              recipe={item}
                              onPress={() => toggleSelect(item)}
                              width={CARD_WIDTH}
                            />
                          </View>
                        );
                      }}
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
                      keyExtractor={(item) => `group-${item.recipe.id}`}
                      renderItem={({ item }) => {
                        const isSelected = selectedRecipes.some(
                          r => r.recipeId === item.recipe.id
                        );

                        return (
                          <View style={isSelected && styles.selectedWrapper}>
                            <RecipeCard
                              recipe={item.recipe}
                              onPress={() => toggleSelect(item.recipe)}
                              width={CARD_WIDTH}
                            />
                          </View>
                        );
                      }}
                      numColumns={2}
                      columnWrapperStyle={styles.row}
                      contentContainerStyle={styles.list}
                      showsVerticalScrollIndicator={false}
                      />
                  )
                  }
              </>
              )}
          </>
        )}

        {selectedRecipes.length > 0 && recipeSelected && (
          <>
            <ScrollView style={styles.selectedContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.headerButtons}>
                <BackButton onPress={() => setRecipeSelected(false)}/>
                  <Text style={styles.titlePage}>Choisir les quantités </Text>
                <SaveButton onPress={handleGenerate} title = "Générer" disabled={selectedRecipes.length === 0} />
              </View>
              {selectedRecipes.map((recipe, index) => (

                <View key={recipe.recipeId} style={styles.cardContainer}>
                  <Text style={styles.title}>{recipe.name}</Text>
                  <View style={styles.imageContainer}>
                    <Image
                      source={
                        recipe.imageUrl
                          ? { uri: recipe.imageUrl }
                          : require('../assets/default.png')
                      }
                      style={styles.image}
                    />
                  </View>
                  <Text style={styles.sectionTitle}>Proportions : </Text>
                  <ServingsControl
                      servings={recipe.portions}
                      onIncrease={() => increaseServings(recipe)}
                      onDecrease={() => decreaseServings(recipe)}
                  />
                </View>
              ))}
            </ScrollView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const CARD_MARGIN = 6;
const CARD_WIDTH = ((Dimensions.get('window').width)/ 2) - (CARD_MARGIN * 3);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  fixedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingHorizontal: 12,
    paddingVertical: 10,

    backgroundColor: '#fff',

    borderBottomWidth: 1,
    borderBottomColor: '#eee',

    zIndex: 100,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  titlePage: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
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
  headerButtons: {
    paddingVertical : 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
  },
  selectedWrapper: {
    borderWidth: 3,
    borderColor: 'rgb(180, 180, 230)',
    borderRadius: 20,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    color: '#333',
  },
});