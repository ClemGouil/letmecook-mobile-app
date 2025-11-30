import React, { useState } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, FlatList, Dimensions } from "react-native";
import { Picker } from '@react-native-picker/picker';

import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import ServingsControl from '../components/ServingsControl'

import { useRecipe } from '../hooks/useRecipe'
import { useGroup } from '../hooks/useGroup';

const SelectRecipeModal = ({ visible, availableMealTypes, onSubmit, onCancel }) => {

  React.useEffect(() => {
  if (visible) {
    setSelectedRecipe(null);
    setSelectedServing(0);
    setRecipeSelected(false);
    setSearch('');
    setMealType("Petit-déjeuner");
    setActiveTab('privateRecipes');
    setSubActiveTab(groups[0]?.id);
  }
}, [visible]);

  const [search, setSearch] = React.useState('');

  const { privateRecipes, groupRecipes, loadGroupRecipes} = useRecipe();
  const { groups} = useGroup();

  const [activeTab, setActiveTab] = useState('privateRecipes');
  const [subActiveTab, setSubActiveTab] = useState(null);

  const [mealType, setMealType] = useState(availableMealTypes[0]);
  
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

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedServing, setSelectedServing] = useState(0);
  const [recipeSelected, setRecipeSelected] = useState();

  const selectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setSelectedServing(recipe.servings);
  };

  const increaseServings = () => {
    setSelectedServing( selectedServing + 1);
  };

  const decreaseServings = () => {
    setSelectedServing(( selectedServing > 1)? selectedServing - 1 : selectedServing);
  };

  const handleCancel = () => {
    setSelectedRecipe();
    setRecipeSelected(false);
    setSelectedServing(0);
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
                        onPress={() => selectRecipe(item)}
                        isSelected={selectedRecipe != null && selectedRecipe.id === item.id}
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
                          onPress={() => selectRecipe(item.recipe)}
                          isSelected={selectedRecipe != null && selectedRecipe.id === item.recipe.id}
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
              <TouchableOpacity style={styles.saveButton} onPress={() => setRecipeSelected(true)} disabled={selectedRecipe == null}>
                <Text style={styles.saveText}>Valider</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {selectedRecipe != null && recipeSelected && (
          <>
            <Text style={styles.title}>{selectedRecipe.name}</Text>
            <Text style={styles.subtitle}>Sélectionner la quantité :</Text>
            <View style={styles.selectedContainer}>
              <ServingsControl
                servings={selectedServing}
                onIncrease={() => increaseServings()}
                onDecrease={() => decreaseServings()}
              />
            </View>
            <Text style={styles.subtitle}>Sélectionner le type de repas :</Text>
            <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={mealType}
                  onValueChange={(value) => setMealType(value)}
                  style={styles.picker}
                >
                  {availableMealTypes.map((u) => (
                    <Picker.Item key={u} label={u} value={u} />
                  ))}
                </Picker>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.saveButton} onPress={() => onSubmit(selectedRecipe, selectedServing, mealType)} disabled={selectedRecipe == null || selectedRecipe == 0 || mealType == null}>
                <Text style={styles.saveText}>Ajouter</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 15,
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
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: 'rgb(180, 180, 230)',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  }
});

export default SelectRecipeModal;