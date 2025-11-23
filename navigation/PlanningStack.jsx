import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MealPlanningScreen from '../screens/MealPlanningScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import RecipeFormScreen from '../screens/RecipeFormScreen';

const Stack = createStackNavigator();

export default function PlanningStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MealPlanning"
        component={MealPlanningScreen}
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