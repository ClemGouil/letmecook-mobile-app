import * as React from 'react';
import { TextInput, View, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function SearchBar({ search, setSearch }) {
  return (
    <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Rechercher ..."
            value={search}
            onChangeText={setSearch}
            style={styles.input}
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.searchButton}>
            <Image source={require('../assets/loupe.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 40,
    width: '90%',
    height: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: 'rgb(205, 205, 255)',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 16,
    height: 16,
    tintColor: '#333',
  }
  });