import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './WelcomeScreen';
import VideoListScreen from './VideoListScreen';
import VideoPlayerScreen from './VideoPlayerScreen';
import SearchMusic from './SearchMusic';
import PlayMusicScreen from './PlayMusicScreen';

const Stack = createStackNavigator();

const App = () => {
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#232534',borderBottomWidth:0.4 // Set the background color of the header
          },
          headerTintColor: 'white', // Set the text color of the header
        }}
      >
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }} // Hide the header for Welcome screen
        />
        <Stack.Screen name="VideoList" component={VideoListScreen} />
        <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
        <Stack.Screen name="SearchMusic" component={SearchMusic} />
        <Stack.Screen name="PlayMusic" component={PlayMusicScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
