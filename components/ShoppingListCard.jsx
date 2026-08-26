import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import SquareButton from '../components/SquareButton';

const ShoppingListCard = ({ shoppingList, onPress, onDelete }) => {

  const formatDate = (date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (a, b) =>
      a.getDate() === b.getDate() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear();

    if (isSameDay(d, today)) return "Aujourd’hui";
    if (isSameDay(d, yesterday)) return "Hier";
    return 'le ' + new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{shoppingList.name}</Text>
          <Text style={styles.date}>{formatDate(shoppingList.createdAt)}</Text>
        </View>
        <SquareButton onPress={onDelete} iconSize={18} size={35}/>
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
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 10,
    color: '#555',
  },
});

export default ShoppingListCard;