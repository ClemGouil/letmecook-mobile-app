import * as React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StyleSheet} from 'react-native';

import RootNavigator from './navigation/RootNavigator';
import { UserProvider } from './contexts/UserContext';
import { RecipeProvider } from './contexts/RecipeContext';
import { InventoryProvider } from './contexts/InventoryContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  return (
    <UserProvider>
      <RecipeProvider>
        <InventoryProvider>
          <LinearGradient
                  colors={['rgb(252, 228, 252)', 'rgb(218, 228, 255)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.container}
                >
            <NavigationContainer  
                theme={MyTheme}>
              <RootNavigator />
            </NavigationContainer>
          </LinearGradient>
        </InventoryProvider>
      </RecipeProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};
