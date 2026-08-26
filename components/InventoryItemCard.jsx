import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SquareButton from './SquareButton';

const InventoryItemCard = ({ item, onEdit, onDelete }) => (
  <TouchableOpacity
      style={styles.card}
      onPress={() => onEdit(item)}
      activeOpacity={0.7}
    >
    <View style={styles.actions}>
      {/* <SquareButton iconName='create-outline' onPress={() => onEdit(item)} iconSize={18} size={30}/> */}
      <SquareButton onPress={() => onDelete(item)} iconSize={18} size={30}/>
    </View>

    <View style={styles.imageContainer}>
      <Image
        source={{ uri: item.ingredient.imageUrl}}
        style={styles.ingredientImage}
        accessibilityLabel={item.ingredient.name}
      />
    </View>

    <Text style={styles.ingredientInfo}>{item.ingredient.name}</Text>
    <Text style={styles.ingredientInfo}>
      {item.quantity} {item.unit.symbol}
    </Text>
  </TouchableOpacity>
);

const CARD_MARGIN = 8;
const CARD_WIDTH = (Dimensions.get('window').width / 2) - (CARD_MARGIN * 3);

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderColor: 'rgb(180, 180, 230)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
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
    borderColor: "rgb(180, 180, 230)",
    borderWidth : 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InventoryItemCard;