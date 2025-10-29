import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRecipe } from '../hooks/useRecipe'

import ReusableModal from '../components/ReusableModal'
import EditItemForm from '../components/EditItemForm'
import * as ImagePicker from 'expo-image-picker';

export default function RecipeFormScreen({ route }) {

  const { privateRecipes, ingredients, units, addIngredientToRecipe, addInstructionToRecipe, uploadImage, updateRecipe} = useRecipe();
  const recipe = privateRecipes.find(r => r.id === route.params.recipeId);

  const [title, setTitle] = useState(recipe.name);
  const [category, setCategory] = useState(recipe.category);
  const [prepTime, setPrepTime] = useState(recipe.prepTime);
  const [cookTime, setCookTime] = useState(recipe.cookTime);
  const [servings, setServings] = useState(recipe.servings);
  const [imageUrl, setImageUrl] = useState(recipe.imageUrl);

  const [editingItem, setEditingItem] = React.useState(null);
  const [addingItem, setAddingItem] = React.useState(false);

  const [newInstructionText, setNewInstructionText] = useState("");
  const [addingInstruction, setAddingInstruction] = useState(false);

  React.useEffect(() => {
    console.log("recette recu :", recipe);
  }, [recipe]);
  
  const handleEdit = (item) => setEditingItem(item);

  const handleAddIngredient = async (item) => {
    console.log("Ajouter :", item);
    await addIngredientToRecipe({
      recipeId: recipe.id,
      ingredientId: item.ingredient.id,
      quantity: item.quantity,
      unitId: item.unit.id,
    });
    setAddingItem(false);
  };

  const handleEditIngredient = async (item) => {
    console.log("Update :", item);
    setEditingItem(null);
  };

  const handleAddInstruction = async () => {
    await addInstructionToRecipe({
      recipeId: recipe.id,
      stepNumber: recipe.instructions.length + 1,
      description: newInstructionText,
    });
    setNewInstructionText("");
    setAddingInstruction(false);
  };

  const handleEditInstruction = async (item) => {
    console.log("Update :", item);
  };

  const handleSaveRecipe = async () => {
    try {
      let finalImageUrl = imageUrl;

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
      };
      await updateRecipe(recipe.id, dto);
      alert("Recette mise à jour !");
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
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 20 }}>
      <View style={styles.cardContainer}>
        <Text style={styles.label}>Recette</Text>
        <Text style={styles.stepText}>Title</Text>
        <TextInput
          style={styles.input}
          onChangeText={setTitle}
          value={title}
        />
        <Text style={styles.stepText}>Catégorie</Text>
        <TextInput 
          style={styles.input} 
          value={category} 
          onChangeText={setCategory} 
          placeholder="Catégorie" 
        />
        <Text style={styles.stepText}>Temps de préparation</Text>
        <TextInput 
          style={styles.input} 
          value={prepTime} 
          onChangeText={setPrepTime} 
          placeholder="Temps de préparation" 
        />
        <Text style={styles.stepText}>Temps de cuisson</Text>
        <TextInput 
          style={styles.input} 
          value={cookTime} 
          onChangeText={setCookTime} 
          placeholder="Temps de cuisson" 
        />
        <Text style={styles.stepText}>Portions</Text>
        <TextInput 
          style={styles.input} 
          value={servings.toString()} 
          onChangeText={text => setServings(Number(text))} 
          placeholder="Portions" 
        />
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <TouchableOpacity style={styles.addButton} onPress={pickImage}>
          <Text style={styles.addButtonText}>Changez l'image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton} onPress={handleSaveRecipe}>
          <Text style={styles.addButtonText}>Sauvegarder</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <Text style={styles.label}>Ingrédients</Text>
        <FlatList
              scrollEnabled={false}
              data={recipe.ingredients}
              keyExtractor={(item) => item.ingredientId}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.ingredientItem} onPress={() => handleEdit(item)}>
                  <Image source={item.ingredient.imageUrl} style={styles.ingredientImage} />
                  <Text style={styles.ingredientText}>
                    {item.ingredient.name} - {item.quantity} {item.unit.symbol}
                  </Text>
                </TouchableOpacity>
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
              data={recipe.instructions}
              keyExtractor={(item) => item.stepNumber.toString()}
              renderItem={({ item }) => (
                <View style={styles.instructionItem}>
                  <Text style={styles.stepText}>Étape {item.stepNumber}</Text>
                  <TextInput
                    style={styles.input}
                    multiline
                    value={item.description}
                  />
                </View>
              )}
            />

          {addingInstruction && (
            <View style={styles.newInstructionContainer}>
              <Text style={styles.stepText}>Étape {recipe.instructions.length + 1}</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Nouvelle instruction..."
                multiline
                value={newInstructionText}
                onChangeText={setNewInstructionText}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddInstruction}
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
            <EditItemForm
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
        <EditItemForm
          item={null}
          unitsList={units}
          ingredientsList= {ingredients}
          onSave={handleAddIngredient}
          onCancel={() => setAddingItem(false)}
        />
      </ReusableModal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    margin: 5,
  },
  cardContainer: {
    backgroundColor: '#fff', 
    borderRadius: 12,
    paddingHorizontal: 30,
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
    marginBottom: 16,
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
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  ingredientImage: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 4,
  },
  ingredientText: {
    fontSize: 16,
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
  marginTop: 2,
},
addButtonText: {
  color: 'rgb(180, 180, 230)',
  fontWeight: 'bold',
  marginLeft: 8,
},
});