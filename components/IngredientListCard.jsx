import React, { useState } from 'react';
import { View, Text, StyleSheet, Image , TouchableOpacity} from 'react-native';
import { Checkbox } from 'react-native-paper';

const IngredientListCard = ({ ingredient, quantity, unit, checked, onToggleChecked, onPress }) => {

  return (
    <TouchableOpacity  style={styles.card} onPress={onPress}>
      <Image source={{ uri: ingredient.imageUrl }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={[
            styles.nameQuantityText,
            checked && { textDecorationLine: 'line-through', color: '#999' }
          ]}>
          {ingredient.name} - <Text style={styles.quantityText}>{quantity} {unit.symbol}</Text>
        </Text>
      </View>
      <Checkbox
        status={checked ? 'checked' : 'unchecked'}
        onPress={onToggleChecked}
      />
    </TouchableOpacity>
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
  }
});
export default IngredientListCard;