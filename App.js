import * as React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StyleSheet} from 'react-native';

import RootNavigator from './navigation/RootNavigator';
import { UserProvider } from './contexts/UserContext';
import { RecipeProvider } from './contexts/RecipeContext';
import { InventoryProvider } from './contexts/InventoryContext';
import { ShoppingListProvider } from './contexts/ShoppingListContext';
import { MealPlanningProvider } from './contexts/MealPlanningContext';
import { ImageProvider } from './contexts/ImageContext';
import { LinearGradient } from 'expo-linear-gradient';
import { GroupProvider } from './contexts/GroupContext';
import { ContextProvider } from './contexts/ContextContext';
import { NotifProvider } from './contexts/NotifContext';
import { ReviewProvider } from './contexts/ReviewContext';

export default function App() {
  return (
    <UserProvider>
      <GroupProvider>
        <ContextProvider>
          <NotifProvider>
              <ImageProvider>
                <RecipeProvider>
                  <InventoryProvider>
                    <ShoppingListProvider>
                      <MealPlanningProvider>
                        <ReviewProvider>
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
                        </ReviewProvider>
                      </MealPlanningProvider>
                    </ShoppingListProvider>
                  </InventoryProvider>
                </RecipeProvider>
              </ImageProvider>
          </NotifProvider>
        </ContextProvider>
      </GroupProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 0,
  },
});

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};
