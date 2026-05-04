/**
 * Image Gallery — assessment app (Redux, Apollo, native bridge, Reanimated).
 *
 * @format
 */

import { ApolloProvider } from '@apollo/client/react';
import React from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { apolloClient } from './src/apollo/client';
import { RootNavigator } from './src/navigation/RootNavigator';
import { store } from './src/store';

function App() {
  const isDark = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <Provider store={store}>
          <ApolloProvider client={apolloClient}>
            <StatusBar
              barStyle={isDark ? 'light-content' : 'dark-content'}
              backgroundColor="#000"
            />
            <RootNavigator />
          </ApolloProvider>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default App;
