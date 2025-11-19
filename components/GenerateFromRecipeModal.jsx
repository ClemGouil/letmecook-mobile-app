import React, { useState } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, FlatList, Dimensions } from "react-native";

import { useRecipe } from '../hooks/useRecipe'
import { useGroup } from '../hooks/useGroup';

import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import ServingsControl from '../components/ServingsControl'

const GenerateFromRecipeModal = ({ visible, onSubmit, onCancel }) => {

  const [search, setSearch] = React.useState('');

  const { privateRecipes, groupRecipes, loadGroupRecipes} = useRecipe();
  const { groups} = useGroup();

  const [activeTab, setActiveTab] = useState('privateRecipes');
  const [subActiveTab, setSubActiveTab] = useState(null);

  React.useEffect(() => {
    if (groups.length > 0 && !subActiveTab) {
      setSubActiveTab(groups[0].id);
    }
  }, [groups]);

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

  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [recipeSelected, setRecipeSelected] = useState([]);

  const toggleSelect = (recipe) => {
    setSelectedRecipes((prev) => {
      const exists = prev.find(r => r.recipeId === recipe.id);
      if (exists) {
        return prev.filter(r => r.recipeId !== recipe.id);
      } else {
        return [...prev, { recipeId: recipe.id, name: recipe.name, portions: recipe.servings }];
      }
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
    onCancel();
    setActiveTab('privateRecipes');
    setSubActiveTab(groups[0].id);
  };

  return (

  <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCancel}
    >
    <View style={styles.modalBackground}>
      <View style={styles.modalContainer}>
        {!recipeSelected && (
          <>
            <Text style={styles.title}>Selectionner des recettes :</Text>

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
                        onPress={() => toggleSelect(item)}
                        isSelected={selectedRecipes.some(r => r.recipeId === item.id)}
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
                          onPress={() => toggleSelect(item.recipe)}
                          isSelected={selectedRecipes.some(r => r.recipeId === item.recipe.id)}
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

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.saveButton} onPress={() => setRecipeSelected(true)} disabled={selectedRecipes.length === 0}>
                <Text style={styles.saveText}>Valider</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {selectedRecipes.length > 0 && recipeSelected && (
          <>
            <Text style={styles.title}>Selectionner les quantités :</Text>
            <View style={styles.selectedContainer}>
              {selectedRecipes.map((recipe, index) => (
                <View key={recipe.recipeId} style={styles.recipeItem}>
                  <Text>{recipe.name}</Text>
                  <ServingsControl
                    servings={recipe.portions}
                    onIncrease={() => increaseServings(recipe)}
                    onDecrease={() => decreaseServings(recipe)}
                  />
                </View>
              ))}
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.saveButton} onPress={() => onSubmit(selectedRecipes)} disabled={selectedRecipes.length === 0}>
                <Text style={styles.saveText}>Générer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setRecipeSelected(false)}>
                <Text style={styles.cancelText}>Retour</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

    </View>
    </View>
  </Modal>
  );
};

const CARD_MARGIN = 6;
const CARD_WIDTH = ((Dimensions.get('window').width * 0.9 )/ 2) - (CARD_MARGIN * 3);

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', 
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3f51b5',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ccc',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelText: {
    color: '#333',
    fontWeight: '600',
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

export default GenerateFromRecipeModal;