import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ShoppingListCard = ({ shoppingList, onPress, onDelete }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{shoppingList.name}</Text>
          <Text style={styles.date}>Crée le {shoppingList.createdAt}</Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Icon name="trash-outline" size={20} color="rgb(180, 180, 230)" />
        </TouchableOpacity>
      </View>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#555',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderWidth: 2,
    borderColor: 'rgb(180, 180, 230)',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ShoppingListCard;