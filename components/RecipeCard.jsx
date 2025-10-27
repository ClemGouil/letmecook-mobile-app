import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RecipeCard = ({ recipe, onPress }) => (
  <TouchableOpacity
      style={styles.card}
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

const CARD_MARGIN = 6;
const CARD_WIDTH = (Dimensions.get('window').width / 2) - (CARD_MARGIN * 3);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: CARD_WIDTH,
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