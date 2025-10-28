import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

const ShoppingListCard = ({ shoppingList, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{shoppingList.name}</Text>
      <Text style={styles.date}>Crée le {shoppingList.createdAt}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#555',
  }
});

export default ShoppingListCard;