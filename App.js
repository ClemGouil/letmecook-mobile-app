import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import BottomTabNavigator from './navigation/BottomTabNav';

export default function App() {
  return (
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  );
}
