import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { GalleryScreen } from '../screens/GalleryScreen';
import { ImageDetailScreen } from '../screens/ImageDetailScreen';
import { RegistrationScreen } from '../screens/RegistrationScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#000',
    card: '#000',
    primary: '#0a84ff',
    text: '#fff',
    border: '#3a3a3c',
  },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="Registration"
        screenOptions={{
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: '#000' },
        }}>
        <Stack.Screen
          name="Registration"
          component={RegistrationScreen}
          options={{ title: 'Sign up' }}
        />
        <Stack.Screen
          name="Gallery"
          component={GalleryScreen}
          options={{ title: 'Gallery', headerBackVisible: false }}
        />
        <Stack.Screen
          name="ImageDetail"
          component={ImageDetailScreen}
          options={{ title: 'Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
