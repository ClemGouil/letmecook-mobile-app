import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Chipset from './Chipset';

import { useRecipe } from '../hooks/useRecipe';

const CategorySelector = ({selectedCategories = [], onChange, requiredMealType = true }) => {

  const { categories } = useRecipe();

  const groupedByType = categories.reduce((acc, category) => {
    if (!acc[category.typeName]) {
      acc[category.typeName] = [];
    }

    acc[category.typeName].push({
      id : category.id,
      name : category.name,
      type : category.type
      }
    );
    return acc;
  }, {});

  const handlePressCategory = (category) => {
    const isSelected = selectedCategories.some(
      selected => selected.id === category.id
    );

    if (isSelected) {
      if (category.type === 'MEAL_TYPE' && requiredMealType) {
        return;
      }
      onChange?.(
        selectedCategories.filter(
          selected => selected.id !== category.id
        )
      );
    } else {
      const newSelection = selectedCategories.filter(
        selected => selected.type !== category.type 
      );
      onChange?.([
        ...newSelection,
        category,
      ]);
    }
  };

  return (
    <View style={styles.container}>
      {Object.entries(groupedByType).map(([type, categories]) => (
        <View key={type} style={styles.categorySection}>
          <Text style={styles.categoryTitle}>
            {type} :
          </Text>

          <Chipset
            items={categories}
            selectedItems={selectedCategories}
            onSelect={handlePressCategory}
            style={styles.chipSet}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  categorySection: {
    //margin: 4,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
});

export default CategorySelector;