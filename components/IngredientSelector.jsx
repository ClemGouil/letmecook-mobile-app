import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Switch, StyleSheet } from 'react-native';
import ServingsControl from '../components/ServingsControl'

const IngredientSelector = ({ title, items, selectedIngredients, serving, toggleAll, isSelected, toggleSelection, getScaledQuantity, onIncrease, onDecrease }) => {

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Proportions :</Text>
      <ServingsControl
        servings={serving}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
      />
      <Text style={styles.subtitle}>{title}</Text>

      <TouchableOpacity style={styles.button} onPress={() => toggleAll()}>
          <Text style={styles.buttonText}>{selectedIngredients.length === items.length ? 'Tout désélectionner' : 'Tout sélectionner'}</Text>
      </TouchableOpacity>

      <FlatList
        scrollEnabled={false}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.ingredientSection}>
            <Switch
              value={isSelected(item)}
              onValueChange={(checked) => toggleSelection(item, checked)}
            />
            <View style={styles.checkboxContent}>
              <Image source={{ uri: item.ingredient.imageUrl }} style={styles.image} />
              <Text>
                {item.ingredient.name} - {getScaledQuantity(item.quantity)} {item.unit.symbol}
              </Text>
            </View>
          </View>
        )}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //marginVertical: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 6,
    borderWidth: 2,
    borderColor: 'rgb(180, 180, 230)',
  },
  buttonText: {
    color: 'rgb(180, 180, 230)',
    fontWeight: 'bold',
  },
  ingredientSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  checkboxContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 12,
    borderRadius: 4,
  },
});

export default IngredientSelector;