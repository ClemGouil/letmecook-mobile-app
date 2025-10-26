import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import RootNavigator from './navigation/RootNavigator';
import { UserProvider } from './contexts/UserContext';
import { RecipeProvider } from './contexts/RecipeContext';

export default function App() {
  return (
    <UserProvider>
      <RecipeProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </RecipeProvider>
    </UserProvider>
  );
}
