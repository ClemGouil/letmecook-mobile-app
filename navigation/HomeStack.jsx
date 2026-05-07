import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import AddIngredientToListScreen from '../screens/AddIngredientToListScreen';

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RecipeDetail"
        component={RecipeDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddIngredientToList"
        component={AddIngredientToListScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}