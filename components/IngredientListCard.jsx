import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image , TouchableOpacity} from 'react-native';
import { Checkbox } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';

const IngredientListCard = ({ ingredient, recipes, quantity, unit, checked, mode, currentRecipe, onToggleChecked, onPress, onDelete}) => {

  const swipeableRef = useRef(null);

  const currentRecipeObj = recipes && recipes.length > 1 ? recipes.find(r => r.recipeName === currentRecipe) : null;

  const renderRightActions = (progress, dragX) => {
    return (
      <View style={styles.deleteAction}>
        <Icon name="trash-outline" size={24} color="#fff" />
        <Text style={styles.deleteText}>Supprimer</Text>
      </View>
    );
  };

  const renderLeftActions = (progress, dragX) => {
    return (
      <View style={styles.checkAction}>
        <Icon name="checkmark-outline" size={24} color="#fff" />
        <Text style={styles.checkText}>Valider</Text>
      </View>
    );
  };

  const handleSwipeOpen = (direction) => {
    if (direction === 'right') {
      onDelete?.();
    } else if (direction === 'left') {
      if (!checked) {
        onToggleChecked?.();
      }
      setTimeout(() => {
        swipeableRef.current?.close();
      }, 100);
    }
  };

  return (
    <>
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      onSwipeableOpen={handleSwipeOpen}
      overshootRight={false}
    >
      <TouchableOpacity style={styles.card} onPress={onPress}>
        <Image source={{ uri: ingredient.imageUrl }} style={styles.image} />

        <View style={styles.infoContainer}>
          <Text
            style={[
              styles.nameQuantityText,
              checked && { textDecorationLine: 'line-through', color: '#999' }
            ]}
          >
            {ingredient.name} -{" "}
            <Text style={styles.quantityText}>
              {quantity} {unit.symbol}
            </Text>
          </Text>
        </View>

        <Checkbox
          status={checked ? 'checked' : 'unchecked'}
          onPress={onToggleChecked}
        />
      </TouchableOpacity>
      </Swipeable>
      {mode == "category" && recipes && recipes.length > 0 && (
        <View style={styles.recipesContainer}>
          {recipes.map((recipe, index) => (
            <Text key={index} style={styles.recipeText}>
              {recipe.recipeName} - {recipe.quantity} {recipe.unitSymbol}
            </Text>
          ))}
        </View>
      )}
      {mode === "recipe" && currentRecipeObj && (
        <View style={styles.recipesContainer}>
          <Text style={styles.recipeText}>
           Pour cette recette : {currentRecipeObj.quantity} {currentRecipeObj.unitSymbol}
          </Text>
        </View>
      )}
    </>
    
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    marginVertical: 1
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 6,
    marginRight: 8,
  },
  infoContainer: {
    flex: 1,
  },
  nameQuantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  quantityText: {
    fontSize: 12,
    color: '#777',
  },
  recipesContainer: {
    marginTop: 8,
  },
  recipeText: {
    fontStyle: 'italic',
    fontSize: 12,
    color: 'gray',
  },
  deleteAction: {
    backgroundColor: '#ff4d4d',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginVertical: 1,
    paddingHorizontal: 20,
  },
  deleteText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  checkAction: {
  backgroundColor: '#4CAF50',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
  marginVertical: 1,
  paddingHorizontal: 20,
},

checkText: {
  color: '#fff',
  fontSize: 12,
  marginTop: 4,
  fontWeight: '600',
},
});
export default IngredientListCard;