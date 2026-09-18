import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';

import { useRecipe } from '../hooks/useRecipe';

const IngredientSelector = ({
  selectedIngredients = [],
  onChange,
  placeholder = "Rechercher par ingrédient...",
}) => {

  const { searchIngredients } = useRecipe();

  const [ingredientSearch, setIngredientSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (ingredientSearch.length >= 1) {
        searchIngredients(ingredientSearch, 5)
          .then(setSuggestions);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [ingredientSearch]);

  const addIngredient = (ingredient) => {
    if (selectedIngredients.some(i => i.id === ingredient.id)) {
      return;
    }

    onChange?.([
      ...selectedIngredients,
      {
        id: ingredient.id,
        name: ingredient.name,
      },
    ]);

    setIngredientSearch('');
    setSuggestions([]);
  };

  const removeIngredient = (id) => {
    onChange?.(
      selectedIngredients.filter(
        ingredient => ingredient.id !== id
      )
    );
  };

  return (
    <View style={styles.container}>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={ingredientSearch}
          onChangeText={setIngredientSearch}
        />

        {ingredientSearch.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.ingredientItem}
                onPress={() => addIngredient(item)}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
            style={styles.ingredientList}
            keyboardShouldPersistTaps="handled"
          />
        )}
      </View>

      {selectedIngredients.length > 0 && (
        <View style={styles.selectedContainer}>
          {selectedIngredients.map((ingredient) => (
            <View
              key={ingredient.id}
              style={styles.chip}
            >
              <Text>{ingredient.name}</Text>

              <TouchableOpacity
                onPress={() => removeIngredient(ingredient.id)}
              >
                <Text style={styles.removeButton}>
                  ×
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  searchContainer: {
    paddingHorizontal: 10,
  },

  input: {
    height: 40,
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderColor: 'rgb(180, 180, 230)',
  },

  ingredientList: {
    marginTop: 5,
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },

  ingredientItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  selectedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
    paddingHorizontal: 10,
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(205, 205, 255)',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    margin: 4,
  },

  removeButton: {
    marginLeft: 8,
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default IngredientSelector;