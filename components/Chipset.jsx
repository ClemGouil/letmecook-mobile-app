import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList,} from 'react-native';

const Chipset = ({ items, selectedItems, onSelect, style, horizontal = false, counts = {}, disabled = false }) => {

  const isSelected = (item) => {
    if (Array.isArray(selectedItems)) {
      if (typeof item === 'object') { 
        return selectedItems.some( selected => selected.id === item.id ); 
      }
      return selectedItems.includes(item);
    }
    if (typeof item === 'object') { 
      return selectedItems?.id === item.id; 
    }

    return selectedItems === item;
  };

  const renderChip = ({ item, index }) => {
    const selected = isSelected(item);

    const count = typeof item === 'object'
      ? counts[item.id] || 0
      : counts[item] || 0;
    return (
      <TouchableOpacity
        key={typeof item === 'object' ? item.id : `${item}-${index}`}
        style={[
          styles.chip,
          count > 0 && styles.chipWithCount,
          selected && styles.chipSelected,
        ]}
        onPress={disabled ? undefined : () => onSelect?.(item)}
        disabled={disabled}
      >
        <View style={styles.chipContent}>
          <Text
            style={[
              styles.chipText,
              count > 0 && styles.chipTextWithCount,
              selected && styles.chipTextSelected,
            ]}
          >
            {typeof item === 'object' ? item.name : item}
          </Text>
            {counts[item] > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>
                  {counts[item]}
                </Text>
              </View>
            )}
        </View>
      </TouchableOpacity>
    );
  };

  if (horizontal) {
    return (
      <FlatList
        data={items}
        renderItem={renderChip}
        keyExtractor={(item, index) => `${typeof item === 'object' ? item.id : item}-${index}` }
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
        style={[styles.horizontalListContainer, style]}
      />
    );
  }

  return (
    <View style={[styles.container, style]}>
      {items.map((item, index) => (
        renderChip({ item, index })
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  horizontalList: {
    paddingHorizontal: 4,
  },
  horizontalListContainer: {
    flexGrow: 0,
  },
  chip: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgb(180, 180, 230)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    margin: 4,
  },
  chipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  chipSelected: {
    backgroundColor: 'rgb(180, 180, 230)',
  },
  countBadge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(180, 180, 230)',
  },
  countBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  chipText: {
    fontSize: 12,
    color: 'rgb(180, 180, 230)',
  },
  chipTextSelected: {
    color: 'white',
  },
  chipWithCount: {
    backgroundColor: 'rgb(225, 225, 250)',
    borderColor: 'rgb(150, 150, 210)',
  },
  chipTextWithCount: {
    color: 'rgb(120, 120, 190)',
    fontWeight: '700',
  },
});

export default Chipset;