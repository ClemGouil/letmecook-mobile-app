import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const InventoryItemCard = ({ item, onEdit, onDelete }) => (
  <View style={styles.card}>
    <View style={styles.actions}>
      <TouchableOpacity style={styles.actionButton} onPress={() => onEdit(item)} title="Modifier">
        <Icon name="edit" size={20} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton} onPress={() => onDelete(item)} title="Supprimer">
        <Icon name="delete" size={20} color="#333" />
      </TouchableOpacity>
    </View>

    <View style={styles.imageContainer}>
      <Image
        source={item.ingredient.imageUrl}
        style={styles.ingredientImage}
        accessibilityLabel={item.ingredient.name}
      />
    </View>

    <Text style={styles.ingredientInfo}>{item.ingredient.name}</Text>
    <Text style={styles.ingredientInfo}>
      {item.quantity} {item.unit.symbol}
    </Text>
  </View>
);

const CARD_MARGIN = 6;
const CARD_WIDTH = (Dimensions.get('window').width / 2) - (CARD_MARGIN * 3);

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    padding: 10,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  imageContainer: {
    height: 80,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ingredientImage: {
    width: 80,
    height: 65,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  ingredientInfo: {
    fontSize: 10,
    color: '#5c3d1f',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
  },
  actions: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'column',
    gap: 4,
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default InventoryItemCard;