import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions, Image } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { useUser } from '../hooks/useUser';
import { SafeAreaView } from 'react-native-safe-area-context';

import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import ServingsControl from '../components/ServingsControl'

import { useRecipe } from '../hooks/useRecipe'
import { useGroup } from '../hooks/useGroup';
import { useMealPlanning } from '../hooks/useMealPlanning';

export default function SelectRecipeToAddScreen({ route, navigation }) {

  React.useEffect(() => {
    setSelectedRecipe(null);
    setSelectedServing(0);
    setRecipeSelected(false);
    setSearch('');
    setActiveTab('privateRecipes');
    setSubActiveTab(groups[0]?.id);
  }, []);

  React.useEffect(() => {
    if (availableMealTypes?.length > 0) {
        setMealType(availableMealTypes[0]);
    }
  }, [availableMealTypes]);

  const {
    selectedDay,
    takenMealTypes,
    availableMealTypes,
  } = route.params || {};

  const { user } = useUser();

  const [search, setSearch] = React.useState('');

  const { privateRecipes, groupRecipes, loadGroupRecipes} = useRecipe();
  const { groups} = useGroup();
  const { addMealPlanning } = useMealPlanning();

  const [activeTab, setActiveTab] = useState('privateRecipes');
  const [subActiveTab, setSubActiveTab] = useState(null);

  const [mealType, setMealType] = useState(availableMealTypes[0]);
  
  React.useEffect(() => {
    if (activeTab === "groupRecipes" && subActiveTab) {
      loadGroupRecipes(subActiveTab);
    }
  }, [activeTab, subActiveTab]);

  const filteredRecipes = (privateRecipes || []).filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const filteredGroupRecipes = (groupRecipes  || []).filter((r) => {
    if (!r?.recipe?.name) return false;
    return r.recipe.name.toLowerCase().includes(search.toLowerCase());
  });

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedServing, setSelectedServing] = useState(0);
  const [recipeSelected, setRecipeSelected] = useState(false);

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
    setActiveTab('privateRecipes');
    setSubActiveTab(groups[0]?.id);
    navigation.goBack();
  };

  const getReverseMealType = (mt) => {
    const mealtype = { 'Petit-déjeuner' : 'BREAKFAST', 'Déjeuner' : 'LUNCH' , 'Dîner' : 'DINNER' }
    return mealtype[mt];
  };

  const  handleAddPlanning = async () => {
    try {
      await addMealPlanning({
        userId: user.id,
        recipeId: selectedRecipe.id,
        servings: selectedServing,
        mealType: getReverseMealType(mealType),
        date: selectedDay,
    });
    navigation.navigate('MealPlanning');
    } catch (err) {
      console.error('Erreur lors de l ajout du planning :', err);
    }
  };

  return (

  <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
    <View style={styles.container}>
        {!recipeSelected && (
          <>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
                <Icon name="arrow-back" size={20} color="#fff" />
                <Text style={styles.backButtonText}>Retour</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.saveButton, selectedRecipe == null && styles.disabledButton]} onPress={() => setRecipeSelected(true)} disabled={selectedRecipe == null}>
                <Text style={[styles.saveButtonText, selectedRecipe == null && styles.disabledButtonText]}>Valider</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.headerRow}>
              <Text style={styles.titlePage}>Sélectionner la recette :</Text>
              <View style={{ height: 60 }} />
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
                        const isSelected = selectedRecipe?.id == item.id

                        return (
                          <View style={isSelected && styles.selectedWrapper}>
                            <RecipeCard
                              recipe={item}
                              onPress={() => selectRecipe(item)}
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
                        const isSelected = selectedRecipe?.id == item.recipe.id

                        return (
                          <View style={isSelected && styles.selectedWrapper}>
                            <RecipeCard
                              recipe={item.recipe}
                              onPress={() => selectRecipe(item.recipe)}
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

        {selectedRecipe != null && recipeSelected && (
          <>

            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.backButton} onPress={() => setRecipeSelected(false)}>
                <Icon name="arrow-back" size={20} color="#fff" />
                <Text style={styles.backButtonText}>Retour</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.saveButton, (selectedRecipe == null || selectedRecipe == 0 || mealType == null) && styles.disabledButton]} onPress={handleAddPlanning} disabled={selectedRecipe == null || selectedRecipe == 0 || mealType == null}>
                <Text style={[styles.saveButtonText, (selectedRecipe == null || selectedRecipe == 0 || mealType == null) && styles.disabledButtonText]}>Ajouter</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.cardContainer}>
              <Text style={styles.title}>{selectedRecipe.name}</Text>
              <View style={styles.imageContainer}>
                <Image
                  source={
                    selectedRecipe.imageUrl
                      ? { uri: selectedRecipe.imageUrl }
                      : require('../assets/default.png')
                  }
                  style={styles.image}
                />
              </View>

              <Text style={styles.sectionTitle}>Proportions :</Text>
              <ServingsControl
                servings={selectedServing}
                onIncrease={increaseServings}
                onDecrease={decreaseServings}
              />

              <Text style={styles.sectionTitle}>Type de repas :</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={mealType}
                  onValueChange={(value) => setMealType(value)}
                >
                  {availableMealTypes?.map((u) => (
                    <Picker.Item key={u} label={u} value={u} />
                  ))}
                </Picker>
              </View>
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(180, 180, 230)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize : 16
  },
  saveButton: {
    backgroundColor: 'rgb(100, 149, 237)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize : 16
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  disabledButtonText: {
    color: '#888',
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
  cardContainer: {
    backgroundColor: '#fff', 
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
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
    height: 200,
    resizeMode: 'contain',
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'rgb(180,180,230)',
    borderRadius: 8,
    overflow: 'hidden',
  }
});