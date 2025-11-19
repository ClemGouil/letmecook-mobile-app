import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import BottomTabNavigator from './BottomTabNav';
import { useUser } from '../hooks/useUser';
import ProfileScreen from '../screens/ProfileScreen';
import GroupScreen from '../screens/GroupScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    
  const { user } = useUser();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
         <>
          <Stack.Screen name="AppTabs" component={BottomTabNavigator} />
          <Stack.Screen name="Profil" component={ProfileScreen}/>
          <Stack.Screen name="Groups" component={GroupScreen}/>
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}