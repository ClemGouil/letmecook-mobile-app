import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ShoppingListScreen from '../screens/ShoppingListScreen';
import ShoppingListDetailScreen from '../screens/ShoppingListDetailScreen';

const Stack = createStackNavigator();

export default function ShoppingListStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ShoppingListMain"
        component={ShoppingListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ShoppingListDetail"
        component={ShoppingListDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}