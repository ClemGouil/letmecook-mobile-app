import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Chipset from './Chipset';

import IngredientSelector from '../components/IngredientSelector';
import CategorySelector from '../components/CategorySelector';
import { useRecipe } from '../hooks/useRecipe';

const RecipeFilter = ({ onFiltersChange, onOpenChange }) => {

  const { categories } = useRecipe();

  const [activeFilter, setActiveFilter] = useState(null);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const categoryTypes = [ 'Ingrédients', ... Array.from(
    new Set(categories.map(recipe => recipe.typeName))
  )]

  const handleActiveFilter = () => {
    setActiveFilter(true);
    onOpenChange?.(true);
  };

  const handleCloseFilters = () => {
    setActiveFilter(false);
    onOpenChange?.(false);
  };

  const handleApplyFilters = () => {
    if (onFiltersChange) {
      onFiltersChange({
        selectedIngredients,
        selectedCategories,
      });
    }

    setActiveFilter(false);
    onOpenChange?.(false);
  };

  const handleResetFilters = () => {
    const emptyFilters = {
      selectedIngredients: [],
      selectedCategories: [],
    };

    setSelectedCategories([]);
    setSelectedIngredients([]);

    if (onFiltersChange) {
      onFiltersChange(emptyFilters);
    }
  };

  const categoryCounts = useMemo(() => {
    const categoryById = new Map(
      categories.map(category => [category.id, category])
    );

    return selectedCategories.reduce((counts, selectedCategory) => {
      const category = categoryById.get(selectedCategory.id);

      if (category?.typeName) {
        counts[category.typeName] =
          (counts[category.typeName] || 0) + 1;
      }

      return counts;
    }, {});
  }, [categories, selectedCategories]);

  return (
    <View style={styles.container}>
      {!activeFilter && (
        <Chipset
          items={categoryTypes}
          onSelect={handleActiveFilter}
          style={styles.chipSet}
          horizontal={true}
          counts={{
            'Ingrédients': selectedIngredients.length,
            ...categoryCounts
          }}
        />
      )}
      {activeFilter && (
        <View style={styles.filterMenu}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>
              Filtres avancés
            </Text>
            <View style={styles.filterActions}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleResetFilters}
              >
                <Text style={styles.resetButtonText}>
                  Réinitialiser
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseFilters}
              >
                <Text style={styles.closeButtonText}>
                  Fermer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.categoryContainer}>
            <View style={styles.categorySection}>
              <Text style={styles.categoryTitle}>Ingrédients :</Text>
              <IngredientSelector
                selectedIngredients={selectedIngredients}
                onChange={setSelectedIngredients}
              />
            </View>
            <View style={styles.categorySection}>
              <CategorySelector
                selectedCategories={selectedCategories}
                onChange={setSelectedCategories}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
            <Text style={styles.applyButtonText}>
              Appliquer
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  filterMenu: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgb(180, 180, 230)',
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  filterActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resetButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#eeeeff',
  },
  resetButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgb(180, 180, 230)',
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgb(180, 180, 230)',
  },
  closeButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
  },
  categorySection: {
    margin: 4,
  },
  categoryContainer: {
    width: '100%',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  applyButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 9,
    backgroundColor: 'rgb(120, 120, 190)',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default RecipeFilter;