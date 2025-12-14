import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useNotif } from '../hooks/useNotif'

import HomeStack from '../navigation/HomeStack';
import RecipeStack from '../navigation/RecipeStack';
import PlanningStack from '../navigation/PlanningStack';
import ShoppingListStack from '../navigation/ShoppingListStack';
import InventoryScreen from '../screens/InventoryScreen';

function HeaderRight() {

  const navigation = useNavigation();

  const { unreadCount } = useNotif();

  return (
    <View style={{ flexDirection: 'row', marginRight: 10 }}>
      <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => navigation.navigate('Notifs')}>
        <View>
          <Icon name="notifications-outline" size={25} color="#000" />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
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
      <Tab.Screen
        name="Accueil"
        component={HomeStack}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('Accueil', { screen: 'HomeMain' });
          },
        })}
      />
      <Tab.Screen
        name="Recettes"
        component={RecipeStack}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('Recettes', { screen: 'RecipeMain' });
          },
        })}
      />
      <Tab.Screen
        name="Planning"
        component={PlanningStack}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('Planning', { screen: 'MealPlanning' });
          },
        })}
      />
      <Tab.Screen
        name="ListeDeCourse"
        component={ShoppingListStack}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('ListeDeCourse', { screen: 'ShoppingListMain' });
          },
        })}
      />
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
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'rgb(180, 180, 230)',
    borderRadius: 10,
    paddingHorizontal: 5,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'black',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
