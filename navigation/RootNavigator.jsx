import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import BottomTabNavigator from './BottomTabNav';
import { useUser } from '../hooks/useUser';
import ProfileScreen from '../screens/ProfileScreen';
import GroupScreen from '../screens/GroupScreen';
import NotificationScreen from '../screens/NotificationScreen';
import { View, ActivityIndicator } from "react-native";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="rgb(180, 180, 230)" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
         <>
          <Stack.Screen name="AppTabs" component={BottomTabNavigator} />
          <Stack.Screen name="Profil" component={ProfileScreen}/>
          <Stack.Screen name="Notifs" component={NotificationScreen}/>
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