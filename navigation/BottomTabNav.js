import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text, View, TouchableOpacity } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import RecipesScreen from '../screens/RecipesScreen';
import PlanningScreen from '../screens/PlanningScreen';
import ShoppingListScreen from '../screens/ShoppingListScreen';
import InventoryScreen from '../screens/InventoryScreen';

function HeaderRight() {
  return (
    <View style={{ flexDirection: 'row', marginRight: 10 }}>
      <TouchableOpacity style={{ marginHorizontal: 10 }}>
        <Icon name="notifications-outline" size={25} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity style={{ marginHorizontal: 10 }}>
        <Icon name="person-circle-outline" size={25} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerRight: () => <HeaderRight />,
        headerTitle: "LetMeCook",
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Recipes') {
            iconName = 'book-outline';
          } else if (route.name === 'Planning') {
            iconName = 'calendar-outline';
          } else if (route.name === 'ShoppingList') {
            iconName = 'cart-outline';
          } else if (route.name === 'Inventory') {
            iconName = 'cube-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Recipes" component={RecipesScreen} />
      <Tab.Screen name="Planning" component={PlanningScreen} />
      <Tab.Screen name="ShoppingList" component={ShoppingListScreen} />
      <Tab.Screen name="Inventory" component={InventoryScreen} />
    </Tab.Navigator>
  );
}
