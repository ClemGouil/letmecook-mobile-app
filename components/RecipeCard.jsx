import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const RecipeCard = ({ recipe, onPress, isSelected, width, isGroup, owner }) => {

  return (
    <TouchableOpacity
      style={[styles.card, { width }]}
      onPress={onPress}
    >
      <View style={styles.overlayBadge}>
        {recipe.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{recipe.category}</Text>
          </View>
        )}
      </View>
      <Image
        source={
          recipe.imageUrl
            ? { uri: recipe.imageUrl }
            : require('../assets/default.png')
        }
        style={styles.image}
      />

      {isGroup && owner && (
        <View style={styles.topRightBadge}>
          <Icon name="people-outline" size={16} color="rgb(180, 180, 230)" />
          <Image
            source={{ uri: owner.profilePhotoUrl || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
            style={styles.ownerAvatar}
          />
        </View>
      )}

      <View style={styles.overlay}>
        <Text style={styles.title}>{recipe.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(114, 111, 111, 0.7)',
  },
  overlayBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
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
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
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