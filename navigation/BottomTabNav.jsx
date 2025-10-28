import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import RecipesScreen from '../screens/RecipesScreen';
import PlanningScreen from '../screens/PlanningScreen';
import ShoppingListStack from '../navigation/ShoppingListStack';
import InventoryScreen from '../screens/InventoryScreen';

function HeaderRight() {

  const navigation = useNavigation();

  return (
    <View style={{ flexDirection: 'row', marginRight: 10 }}>
      <TouchableOpacity style={{ marginHorizontal: 10 }}>
        <Icon name="notifications-outline" size={25} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => navigation.navigate('Profil')}>
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
        headerStyle: styles.header,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#000000ff', 
        tabBarInactiveTintColor: '#3b3b3b',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Accueil') {
            iconName = 'home-outline';
          } else if (route.name === 'Recettes') {
            iconName = 'book-outline';
          } else if (route.name === 'Planning') {
            iconName = 'calendar-outline';
          } else if (route.name === 'ListeDeCourse') {
            iconName = 'cart-outline';
          } else if (route.name === 'Inventaire') {
            iconName = 'cube-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Accueil" component={HomeScreen} />
      <Tab.Screen name="Recettes" component={RecipesScreen} />
      <Tab.Screen name="Planning" component={PlanningScreen} />
      <Tab.Screen name="ListeDeCourse" component={ShoppingListStack} />
      <Tab.Screen name="Inventaire" component={InventoryScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#858585',
  },
  tabBar: {
    backgroundColor: '#858585',
  },
});
