import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { useUser } from '../hooks/useUser'
import { useRecipe } from '../hooks/useRecipe'
import { useGroup } from '../hooks/useGroup';
import { useShoppingList } from '../hooks/useShoppingList';
import { useNavigation} from '@react-navigation/native';
import AddIngredientToListModal  from '../components/AddIngredientToListModal';
import SelectGroupForm from '../components/SelectGroupForm';
import ReusableModal from '../components/ReusableModal';

export default function RecipeDetailScreen({ route }) {

  const navigation = useNavigation();
  const { user } = useUser();
  const { groups} = useGroup();

  const { publicRecipes, privateRecipes, groupRecipes, addRecipe, addIngredientToRecipe, addInstructionToRecipe, deleteRecipe ,shareRecipeWithGroup, unshareRecipeFromGroup} = useRecipe();
  const recipe = privateRecipes.find(r => r.id === route.params.recipeId) || groupRecipes.find(r => r.recipe.id === route.params.recipeId)?.recipe || publicRecipes.find(r => r.id === route.params.recipeId) ;

  if (!recipe) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Recette introuvable</Text>
      </View>
    );
  }

  const isGroupRecipe = route.params.isGroupRecipe;
  const isOwner = route.params.isOwner;
  const isPublic = route.params.isPublic;
  const groupId = route.params.groupId;

  const { shoppingLists, addRecipeToShoppingList} = useShoppingList();

  const [activeTab, setActiveTab] = useState('ingredients');
  const [servings, setServings] = useState(recipe.servings);
  const [showModal, setShowModal] = useState(false);
  const [showGroupSelector, setShowGroupSelector] = useState(false);

  const getScaledQuantity = (originalQuantity) => {
    const ratio = servings / recipe.servings;
    return Math.round(originalQuantity * ratio * 100) / 100;
  };

  const getTotalTime = () => {
    const total = Number(recipe.prepTime) + Number(recipe.cookTime);
    const hours = Math.floor(total / 60);
    const minutes = total % 60;

    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}min`;
    if (hours > 0) return `${hours} h`;
    return `${minutes} min`;
  };

  const increaseServings = () => {
    setServings(prev => prev + 1);
  };

  const decreaseServings = () => {
    if (servings > 1) {
      setServings(prev => prev - 1);
    }
  };

  const handleEdit = (recipeId) => {
    navigation.navigate('RecipeForm', { recipeId : recipeId });
  };

  const  handleAddRecipeToShoppingList = async (result) => {
    if (!result) {
      setShowModal(false);
      return;
    }

    try {
      await addRecipeToShoppingList({
        shoppingListId: result.listId,
        recipeId: recipe.id,
        userId: user.id,
        ingredients: result.ingredients,
        newList: result.newList,
        serving : result.serving,
    });
      setShowModal(false);
    } catch (err) {
      console.error('Erreur lors de l ajout du planning :', err);
    }
  };

  const handleShare = async (recipeId, groupId) => {
    try {
      await shareRecipeWithGroup(
        groupId,
        recipeId, 
        user.id
      );
      navigation.navigate('RecipeMain');
    } catch (err) {
      console.error('Erreur lors du partage de la recette :', err);
    }
  };

  const handleUnshare = async (recipeId, groupId) => {
    try {
      await unshareRecipeFromGroup(
        groupId,
        recipeId, 
        user.id
      );
      navigation.navigate('RecipeMain');
    } catch (err) {
      console.error('Erreur lors du departage de la recette :', err);
    }
  };

  const handleClone = async (recipe) => {
    try {
      const dto = {
        name: recipe.name,
        category : recipe.category,
        prepTime : recipe.prepTime,
        cookTime : recipe.cookTime,
        servings : recipe.servings,
        imageUrl : recipe.imageUrl,
        ownerId :  user.id 
      };

      const created = await addRecipe(dto);
      const recipeId = created.id;
      
      for (const ing of recipe.ingredients) {
        await addIngredientToRecipe({
          recipeId,
          ingredientId: ing.ingredient.id,
          quantity: ing.quantity,
          unitId: ing.unit.id,
        });
      }

      for (const inst of recipe.instructions) {
        await addInstructionToRecipe({
          recipeId,
          stepNumber: inst.stepNumber,
          description: inst.description,
        });
      }

      navigation.navigate('RecipeDetail', {
        recipeId,
        groupId: null,
        isOwner : true,
        isGroupRecipe: false
      });
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour de la recette");
    }
    
  };

  const handleDelete = async (recipeId) => {
    try {
      await deleteRecipe(
        recipeId
      );
      navigation.navigate('RecipeMain');
    } catch (err) {
      console.error('Erreur lors du departage de la recette :', err);
    }
  };

  return (
    <>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 20 }}>
      <View style={styles.cardContainer}>
        <Text style={styles.title}>{recipe.name}</Text>
        <Image source={recipe.imageUrl} style={styles.image} />
        {!isGroupRecipe && isOwner && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit(recipe.id)}
            >
              <View style={styles.buttonContent}>
                <Icon name="create-outline" size={18} color="rgb(180, 180, 230)" />
                <Text style={styles.editButtonText}>Modifier</Text>
              </View>
            </TouchableOpacity>
        )}
        {!isGroupRecipe && isOwner && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setShowGroupSelector(true)}
          >
            <View style={styles.buttonContent}>
              <Icon name="share-social-outline" size={18} color="rgb(180, 180, 230)" />
              <Text style={styles.editButtonText}>Partager</Text>
            </View>
          </TouchableOpacity>
        )}
        {isGroupRecipe && isOwner && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleUnshare(recipe.id, groupId)}
          >
            <View style={styles.buttonContent}>
              <Icon name="remove-circle-outline" size={18} color="rgb(180, 180, 230)" />
              <Text style={styles.editButtonText}>Retirer du groupe</Text>
            </View>
          </TouchableOpacity>
        )}
        {isPublic && !isOwner && !isGroupRecipe && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleClone(recipe)}
          >
            <View style={styles.buttonContent}>
              <Icon name="copy-outline" size={18} color="rgb(180, 180, 230)" />
              <Text style={styles.editButtonText}>Cloner</Text>
            </View>
          </TouchableOpacity>
        )}
        {!isPublic && isOwner && !isGroupRecipe && ( 
          <TouchableOpacity style={styles.editButton} onPress={() => handleDelete(recipe.id)}>
            <View style={styles.buttonContent}>
            <Icon name="trash-outline" size={18} color="rgb(180, 180, 230)" />
            <Text style={styles.editButtonText}>Supprimer</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.timeContainer}>
        <View style={styles.timeSection}>
          <Text style={styles.timeLabel}>Préparation</Text>
          <Text style={styles.timeValue}>{recipe.prepTime} min</Text>
        </View>
        <View style={styles.separatorVertical} />
        <View style={styles.timeSection}>
          <Text style={styles.timeLabel}>Cuisson</Text>
          <Text style={styles.timeValue}>{recipe.cookTime} min</Text>
        </View>
        <View style={styles.separatorVertical} />
        <View style={styles.timeSection}>
          <Text style={styles.timeLabel}>Total</Text>
          <Text style={styles.timeValue}>{getTotalTime()}</Text>
        </View>
      </View>

      <View style={styles.cardContainer}>
        {/* Tabs */}
        <View style={styles.tabsCard}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'ingredients' && styles.activeTab]}
            onPress={() => setActiveTab('ingredients')}
          >
            <Text style={[styles.tabText, activeTab === 'ingredients' && styles.activeTabText]}>Ingrédients</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'instructions' && styles.activeTab]}
            onPress={() => setActiveTab('instructions')}
          >
            <Text style={[styles.tabText, activeTab === 'instructions' && styles.activeTabText]}>Instructions</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'ingredients' && (
          <>
          <View style={styles.servingsContainer}>
            <TouchableOpacity onPress={decreaseServings} style={styles.fabButton}>
              <Icon name="remove-circle-outline" size={24} color="rgb(180, 180, 230)" />
            </TouchableOpacity>
            <Text style={styles.servingsText}>{servings} personnes</Text>
            <TouchableOpacity onPress={increaseServings} style={styles.fabButton}>
              <Icon name="add-circle-outline" size={24} color="rgb(180, 180, 230)" />
            </TouchableOpacity>
          </View>
          <FlatList
            scrollEnabled={false}
            data={recipe.ingredients}
            keyExtractor={(item) => item.ingredientId}
            renderItem={({ item }) => (
              <View style={styles.ingredientItem}>
                <Image source={item.ingredient.imageUrl} style={styles.ingredientImage} />
                <Text style={styles.ingredientText}>
                  {item.ingredient.name} - {getScaledQuantity(item.quantity)} {item.unit.symbol}
                </Text>
              </View>
            )}
          />
          <TouchableOpacity style={styles.addToShoppingListButton} onPress={() => setShowModal(true)}>
            <Text style={styles.addToShoppingListButtonText}>Ajouter à une liste de course</Text>
          </TouchableOpacity>
          </>
        )}

        {activeTab === 'instructions' && (
          <FlatList
            scrollEnabled={false}
            data={recipe.instructions}
            keyExtractor={(item) => item.stepNumber.toString()}
            renderItem={({ item }) => (
              <View style={styles.instructionItem}>
                <Text style={styles.stepText}>Étape {item.stepNumber}</Text>
                <Text style={styles.instructionText}>{item.description}</Text>
              </View>
            )}
          />
        )}
      </View>
    </ScrollView>

    <AddIngredientToListModal
      visible={showModal}
      data={{
        items: recipe.ingredients,
        serving: servings,}
      }
      onClose={handleAddRecipeToShoppingList}
      shoppingLists={shoppingLists}
    />

    <ReusableModal
        visible={showGroupSelector}
        onClose={() => {setShowGroupSelector(false);}}
      >
        <SelectGroupForm
          groups={groups}
          onSave={(selectedGroupId) => { handleShare(recipe.id, selectedGroupId); setShowGroupSelector(false);}}
          onCancel={() => {setShowGroupSelector(false);}}
        />
    </ReusableModal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    borderRadius: 8,
    marginBottom: 16,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '600',
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
  timeContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff', 
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  timeSection: {
    alignItems: 'center',
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  separatorVertical: {
    width: 1,
    height: '60%',
    backgroundColor: '#ccc',
  },
  tabsCard: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
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
  instructionItem: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  stepText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 15,
    lineHeight: 20,
  },
  servingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  fabButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  servingsText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addToShoppingListButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 2,
    borderColor: 'rgb(180, 180, 230)',
  },
  addToShoppingListButtonText: {
    color: 'rgb(180, 180, 230)',
    fontWeight: 'bold',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  editButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 2,
    borderColor: 'rgb(180, 180, 230)',
  },
  editButtonText: {
    color: 'rgb(180, 180, 230)',
    fontWeight: 'bold',
  },
});