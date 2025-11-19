import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RecipeCard = ({ recipe, onPress, isSelected, width  }) => (
  <TouchableOpacity
      style={[styles.card, { width }, isSelected && styles.selectedCard]}
      onPress={onPress}
    >
      <Image
        source={recipe.imageUrl}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{recipe.name}</Text>
      </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 16,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: 'rgb(180, 180, 230)',
  },
  image: {
    width: '100%',
    height: 120,
  },
  textContainer: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  }
});

export default RecipeCard;