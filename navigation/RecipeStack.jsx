import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import RecipesScreen from '../screens/RecipesScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import RecipeFormScreen from '../screens/RecipeFormScreen';

const Stack = createStackNavigator();

export default function RecipeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RecipeMain"
        component={RecipesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RecipeDetail"
        component={RecipeDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RecipeForm"
        component={RecipeFormScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}