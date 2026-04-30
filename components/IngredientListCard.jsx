import React, { useState } from 'react';
import { View, Text, StyleSheet, Image , TouchableOpacity} from 'react-native';
import { Checkbox } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';

const IngredientListCard = ({ ingredient, quantity, unit, checked, onToggleChecked, onPress, onDelete}) => {

  const renderRightActions = (progress, dragX) => {
    return (
      <View style={styles.deleteAction}>
        <Icon name="trash-outline" size={24} color="#fff" />
        <Text style={styles.deleteText}>Supprimer</Text>
      </View>
    );
  };

  const handleSwipeOpen = (direction) => {
    if (direction === 'right') {
      onDelete?.();
    }
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      onSwipeableOpen={handleSwipeOpen}
      overshootRight={false}
    >
      <TouchableOpacity style={styles.card} onPress={onPress}>
        <Image source={{ uri: ingredient.imageUrl }} style={styles.image} />

        <View style={styles.infoContainer}>
          <Text
            style={[
              styles.nameQuantityText,
              checked && { textDecorationLine: 'line-through', color: '#999' }
            ]}
          >
            {ingredient.name} -{" "}
            <Text style={styles.quantityText}>
              {quantity} {unit.symbol}
            </Text>
          </Text>
        </View>

        <Checkbox
          status={checked ? 'checked' : 'unchecked'}
          onPress={onToggleChecked}
        />
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    marginVertical: 1
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 6,
    marginRight: 8,
  },
  infoContainer: {
    flex: 1,
  },
  nameQuantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  quantityText: {
    fontSize: 12,
    color: '#777',
  },
  deleteAction: {
    backgroundColor: '#ff4d4d',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginVertical: 1,
    paddingHorizontal: 20,
  },
  deleteText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
});
export default IngredientListCard;