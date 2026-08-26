import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useUser } from '../hooks/useUser';
import { SafeAreaView } from 'react-native-safe-area-context';

import ServingsControl from '../components/ServingsControl'
import BackButton from '../components/BackButton';
import SaveButton from '../components/SaveButton';
import RecipeSelector from '../components/RecipeSelector';
import FolderRecipeSelector from '../components/FolderRecipeSelector';

import { useMealPlanning } from '../hooks/useMealPlanning';

export default function SelectRecipeToAddScreen({ route, navigation }) {

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
  const { addMealPlanning } = useMealPlanning();
  const [mealType, setMealType] = useState(availableMealTypes[0]);

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedServing, setSelectedServing] = useState(0);
  const [recipeSelected, setRecipeSelected] = useState(false);

  const [folderSelectorVisible, setFolderSelectorVisible] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);

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

  <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
        {!recipeSelected && (
          <>
            <View style={styles.headerButtons}>
                <BackButton onPress={handleCancel}/>
                <Text style={styles.titlePage}>Sélectionner une recette </Text>
                <SaveButton onPress={() => setRecipeSelected(true)} title = "Valider" disabled={selectedRecipe == null} />
            </View>

            {folderSelectorVisible ? (
               <FolderRecipeSelector 
                folder={selectedFolder}
                singleSelectionMode={true}
                selectedRecipeId={selectedRecipe?.id}
                onRecipePress={(recipe) => { 
                  selectRecipe(recipe);
                }} 
                onBack={() => { 
                  setFolderSelectorVisible(false);
                }} 
              />
            ) : (
              <RecipeSelector  
                onRecipePress={(item, isGroup) => {  
                  const recipe = isGroup ? item.recipe : item;  
                  selectRecipe(recipe);  
                }}  
                selectedRecipeId={selectedRecipe?.id}  
                singleSelectionMode={true}
                onFolderPress={(folder) => {
                  setSelectedFolder(folder);
                  setFolderSelectorVisible(true);
                }}
              />
            )}
          </>
        )}

        {selectedRecipe != null && recipeSelected && (
          <>

            <View style={styles.headerButtons}>
              <BackButton onPress={() => setRecipeSelected(false)}/>
                <Text style={styles.titlePage}>Choisir la quantité </Text>
              <SaveButton onPress={handleAddPlanning} title = "Ajouter" disabled={(selectedRecipe == null || selectedRecipe == 0 || mealType == null)} />
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

const CARD_MARGIN = 4;
const CARD_WIDTH = ((Dimensions.get('window').width)/ 2) - (CARD_MARGIN * 3);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  titlePage: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  headerButtons: {
    paddingVertical : 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'rgb(180,180,230)',
    borderRadius: 8,
    overflow: 'hidden',
  }
});