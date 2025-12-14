import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const RecipeCard = ({ recipe, onPress, isSelected, width, isGroup, owner }) => {

  return (
    <TouchableOpacity
      style={[styles.card, { width }, isSelected && styles.selectedCard]}
      onPress={onPress}
    >
      <Image
        source={{ uri: recipe.imageUrl }}
        style={styles.image}
      />

      {isGroup && owner && (
        <View style={styles.topRightBadge}>
          <Icon name="people-outline" size={16} color="rgb(180, 180, 230)" />
          <Image
            source={{ uri: owner.profilePhotoUrl }}
            style={styles.ownerAvatar}
          />
        </View>
      )}

      <View style={styles.overlay}>
        <Text style={styles.title}>{recipe.name}</Text>
        {recipe.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{recipe.category}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
    backgroundColor: '#000',
  },
  selectedCard: {
    borderWidth: 3,
    borderColor: 'rgb(180, 180, 230)',
  },
  image: {
    width: '100%',
    height: 180,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginTop: 4,
  },
  categoryText: {
    color: 'rgb(180, 180, 230)',
    fontSize: 12,
    fontWeight: '600',
  },
  topRightBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 16,
  },
  ownerAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: 4,
  },
});

export default RecipeCard;