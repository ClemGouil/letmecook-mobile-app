import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRecipe } from '../hooks/useRecipe'
import { useImage } from '../hooks/useImage'
import { useNavigation} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ReusableModal from '../components/ReusableModal'
import EditAddItemForm from '../components/EditAddItemForm'
import * as ImagePicker from 'expo-image-picker';
import ServingsControl from '../components/ServingsControl'
import { Slider } from 'react-native-elements';
import { useUser } from '../hooks/useUser';
import BackButton from '../components/BackButton';
import SaveButton from '../components/SaveButton';

export default function RecipeFormScreen({ route }) {

  const navigation = useNavigation();

  const { privateRecipes, units, searchIngredients, addRecipe, addIngredientToRecipe, deleteAllIngredientsFromRecipe, addInstructionToRecipe, deleteAllInstructionsFromRecipe, updateRecipe} = useRecipe();
  const {  uploadImage } = useImage();
  const { user } = useUser();

  const isNew = !route.params?.recipeId;
  const recipe = isNew
  ? {
      id: null,
      name: "",
      category: "",
      prepTime: 20,
      cookTime: 20,
      servings: 2,
      imageUrl: null,
      ingredients: [],
      instructions: [],
      isPublic: false
    }
  : privateRecipes.find(r => r.id === route.params.recipeId);

  const [title, setTitle] = useState(recipe.name);
  const [category, setCategory] = useState(recipe.category);
  const [prepTime, setPrepTime] = useState(recipe.prepTime);
  const [cookTime, setCookTime] = useState(recipe.cookTime);
  const [servings, setServings] = useState(recipe.servings);
  const [imageUrl, setImageUrl] = useState(recipe.imageUrl);
  const [isPublic, setIsPublic] = useState(recipe.isPublic);

  const [localIngredients, setLocalIngredients] = useState(recipe.ingredients ?? []);
  const [localInstructions, setLocalInstructions] = useState(recipe.instructions ?? []);

  const [editingItem, setEditingItem] = React.useState(null);
  const [addingItem, setAddingItem] = React.useState(false);

  const [newInstructionText, setNewInstructionText] = useState("");
  const [addingInstruction, setAddingInstruction] = useState(false);

  const [ingredientQuery, setIngredientQuery] = React.useState('');
  const [ingredientResults, setIngredientResults] = React.useState([]);

  React.useEffect(() => {
    const timeout = setTimeout(async () => {
      if (ingredientQuery.length >= 2) {
        const res = await searchIngredients(ingredientQuery);
        setIngredientResults(res);
      } else {
        const res = await searchIngredients(null, 3);
        setIngredientResults(res);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [ingredientQuery]);
  
  const handleEdit = (item) => setEditingItem(item);

  const handleSaveRecipe = async () => {
    try {
      let finalImageUrl = imageUrl;
      let recipeId = recipe?.id;

      if (imageUrl && imageUrl.startsWith("file://")) {
        finalImageUrl = await uploadImage(imageUrl);
      }
      const dto = {
        name: title,
        category,
        prepTime,
        cookTime,
        servings,
        imageUrl : finalImageUrl,
        ownerId: isNew ? user.id : recipe.ownerId,
        isPublic,
      };

      if (isNew) {
        const created = await addRecipe(dto);
        recipeId = created.id;
      } else {
        await updateRecipe(recipe.id, dto);
        await deleteAllIngredientsFromRecipe(recipe.id);
        await deleteAllInstructionsFromRecipe(recipe.id);
      }
      
      for (const ing of localIngredients) {
        await addIngredientToRecipe({
          recipeId,
          ingredientId: ing.ingredient.id,
          quantity: ing.quantity,
          unitId: ing.unit.id,
        });
      }

      for (let i = 0; i < localInstructions.length; i++) {
        const inst = localInstructions[i];
        await addInstructionToRecipe({
          recipeId,
          stepNumber: inst.stepNumber,
          description: inst.description,
        });
      }
      navigation.goBack();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour de la recette");
    }
  };

  const pickImage = async () => {
    // Demande la permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission refusée pour accéder aux images.');
      return;
    }

    // Ouvre la librairie
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const handleEditIngredient = (updatedItem) => {
    setLocalIngredients(prev =>
      prev.map(item =>
        item.id === updatedItem.id
          ? { ...item, quantity: updatedItem.quantity, unit: updatedItem.unit }
          : item
      )
    );
    setEditingItem(null);
  };

  const handleAddIngredient = (newItem) => {
    const tempId = `temp-${Date.now()}`;
    setLocalIngredients(prev => [
      ...prev,{ 
        ...newItem, 
        id: tempId 
      }
    ]);
    setAddingItem(false);
  };

  const handleDeleteIngredient = (id) => {
    setLocalIngredients(prev => prev.filter(item => item.id !== id));
  };

  const handleEditInstruction = (params) => {
    setLocalInstructions(prev =>
      prev.map(item =>
        item.id === params.id
          ? { ...item, description: params.description }
          : item
      )
    );
  };

  const handleAddInstruction = (params) => {
    const tempId = `temp-${Date.now()}`;
    setLocalInstructions(prev => [
      ...prev,
      { id: tempId, stepNumber: prev.length + 1, description: params.description}
    ]);
    setAddingInstruction(false);
    setNewInstructionText("");
  };

  const handleDeleteInstruction = (id) => {
    setLocalInstructions(prev => prev.filter(item => item.id !== id).map((item, index) => ({...item, stepNumber : index + 1 })));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 10 }}>

          <View style={styles.cardContainer}>
            <View style={styles.headerButtons}>
              <BackButton onPress={() => navigation.goBack()}/>
                <Text style={styles.titlePage}>{isNew ? "Créer une recette" : "Modifier la recette"}</Text>
              <SaveButton onPress={handleSaveRecipe} disabled={title.length == 0}/>
            </View>
            {/* <Text style={styles.label}>Recette</Text> */}
            <Text style={styles.subTitleText}>Title</Text>
            <TextInput
              style={styles.input}
              onChangeText={setTitle}
              value={title}
            />

            <Text style={styles.subTitleText}>Catégorie</Text>
            <TextInput 
              style={styles.input} 
              value={category} 
              onChangeText={setCategory} 
              placeholder="Catégorie" 
            />
            <Text style={styles.subTitleText}>Temps de préparation</Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                value={Number(prepTime)}
                onValueChange={setPrepTime}
                maximumValue={90}
                minimumValue={0}
                step={1}
                trackStyle={styles.sliderTrack}
                thumbStyle={styles.sliderThumb}
                minimumTrackTintColor="rgb(180, 180, 230)"
                maximumTrackTintColor="rgba(180,180,230,0.3)"
                thumbProps={{
                  children: (
                    <Icon
                      name="bicycle"
                      size={20}
                      color="white"
                      style={styles.iconStyle}
                    />
                  ),
                }}
              />
              <Text style={styles.valueText}>{prepTime} min</Text>
            </View>

            <Text style={styles.subTitleText}>Temps de cuisson</Text>
            <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              value={Number(cookTime)}
              onValueChange={setCookTime}
              maximumValue={90}
              minimumValue={0}
              step={1}
              trackStyle={styles.sliderTrack}
              thumbStyle={styles.sliderThumb}
              minimumTrackTintColor="rgb(180, 180, 230)"
                maximumTrackTintColor="rgba(180,180,230,0.3)"
              thumbProps={{
                children: (
                  <Icon
                    name="bicycle"
                    size={20}
                    color="white"
                    style={styles.iconStyle}
                  />
                ),
              }}
            />
            <Text style={styles.valueText}>{cookTime} min</Text>
            </View>
            
            <Text style={styles.subTitleText}>Portions</Text>
            
            <ServingsControl
              servings={servings}
              onIncrease={() => setServings(prev => prev + 1)}
              onDecrease={() => setServings(prev => Math.max(prev - 1, 1))}
            />
            <Text style={styles.subTitleText}>Publique</Text>
            
            <View style={styles.publicRow}>
              <Switch
                value={isPublic}
                onValueChange={setIsPublic}
              />
            </View>

            <Image 
              source={
              imageUrl
                ? { uri: imageUrl }
                : require('../assets/default.png')
              }
              style={styles.image} 
            />
            <TouchableOpacity style={styles.addButton} onPress={pickImage}>
              <Text style={styles.addButtonText}>Changez l'image</Text>
            </TouchableOpacity>

          </View>

          <View style={styles.cardContainer}>
            <Text style={styles.label}>Ingrédients</Text>
            <FlatList
                  scrollEnabled={false}
                  data={localIngredients}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.ingredientItem}>
                      <TouchableOpacity style={styles.ingredientInfo} onPress={() => handleEdit(item)}>
                        <Image source={{ uri: item.ingredient.imageUrl }} style={styles.ingredientImage} />
                        <Text style={styles.ingredientText}>
                          {item.ingredient.name} - {item.quantity} {item.unit.symbol}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteIngredient(item.id)}>
                        <Icon name="trash-outline" size={15} color="rgb(180, 180, 230)" />
                      </TouchableOpacity>
                    </View>
                  )}
                />
              <TouchableOpacity style={styles.addButton} onPress={() => setAddingItem(true)}>
              <Icon name="add-circle-outline" size={24} color="rgb(180, 180, 230)" />
                <Text style={styles.addButtonText}>ingrédient</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.cardContainer}>

              <Text style={styles.label}>Instructions</Text>
              <FlatList
                  scrollEnabled={false}
                  data={localInstructions}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.instructionItem}>
                      <View style={styles.instructionHeader}>
                      <Text style={styles.subTitleText}>Étape {item.stepNumber}</Text>
                      <TouchableOpacity  style={styles.deleteButton} onPress={() => handleDeleteInstruction(item.id)}>
                        <Icon name="trash-outline" size={15} color="rgb(180, 180, 230)" />
                      </TouchableOpacity>
                      </View>
                      <TextInput
                        style={styles.input}
                        multiline
                        value={item.description}
                        onChangeText={(text) => handleEditInstruction({ id: item.id, description: text })}
                      />
                    </View>
                  )}
                />

              {addingInstruction && (
                <View style={styles.newInstructionContainer}>
                  <Text style={styles.subTitleText}>Étape {localInstructions.length + 1}</Text>
                  
                  <TextInput
                    style={styles.input}
                    placeholder="Nouvelle instruction..."
                    multiline
                    value={newInstructionText}
                    onChangeText={setNewInstructionText}
                  />
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAddInstruction({ description: newInstructionText })}
                  >
                    <Text style={styles.addButtonText}>Valider</Text>
                  </TouchableOpacity>
                  </View> 
              )}

              {!addingInstruction && (
              <TouchableOpacity style={styles.addButton} onPress={() => setAddingInstruction(true)}>
                <Icon name="add-circle-outline" size={24} color="rgb(180, 180, 230)" />
                <Text style={styles.addButtonText}>instruction</Text>
              </TouchableOpacity>
              )}

            </View>
          <ReusableModal
                visible={!!editingItem}
                onClose={() => setEditingItem(null)}
            >
                {editingItem && (
                <EditAddItemForm
                    item={editingItem}
                    unitsList={units}
                    onSave={handleEditIngredient}
                    onCancel={() => setEditingItem(null)}
                />
                )}
          </ReusableModal>

          <ReusableModal
            visible={addingItem}
            onClose={() => setAddingItem(false)}
          >
            <EditAddItemForm
              item={null}
              unitsList={units}
              ingredientsList= {ingredientResults}
              onSearchIngredient={setIngredientQuery}
              onSave={handleAddIngredient}
              onCancel={() => setAddingItem(false)}
            />
          </ReusableModal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    margin: 3,
  },
  cardContainer: {
    backgroundColor: '#fff', 
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: 'rgb(180, 180, 230)',
    borderRadius: 8,
    padding: 8,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    borderRadius: 8,
    marginBottom: 16,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  ingredientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ingredientText: {
    fontSize: 16,
    marginLeft: 12,
    flexShrink: 1,
  },
  ingredientImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  instructionItem: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  instructionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  addButton: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgb(180, 180, 230)',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  addButtonText: {
    color: 'rgb(180, 180, 230)',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sliderTrack: {
    height: 5,
    backgroundColor: 'rgba(180, 180, 230, 0.3)',
  },
  sliderThumb: {
    height: 35,
    width: 35,
    backgroundColor: 'rgb(180, 180, 230)',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slider: {
    flex: 1,
  },
  valueText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10,
    minWidth: 50,
    textAlign: 'center',
    color: '#333',
  },
  subTitleText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
    color: '#555',
  },
  publicRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  deleteButton : {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: 'rgb(180, 180, 230)',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  titlePage: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
});