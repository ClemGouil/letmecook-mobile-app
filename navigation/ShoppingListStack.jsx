import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ShoppingListScreen from '../screens/ShoppingListScreen';
import ShoppingListDetailScreen from '../screens/ShoppingListDetailScreen';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

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