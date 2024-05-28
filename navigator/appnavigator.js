import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/home';
import Player from '../screens/player';
import Playlist from '../screens/playlist';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the desired icon library

const Tab = createBottomTabNavigator();

const Appnavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home'; // Home icon name
                    } else if (route.name === 'Search') {
                        iconName = focused ? 'search' : 'search'; // Player icon name
                    } else if (route.name === 'My Music') {
                        iconName = focused ? 'list' : 'list-alt'; // Playlist icon name
                    }

                    // Return the icon component with the appropriate name
                    return <Icon name={iconName} size={size} color={color} />;
                },tabBarStyle: { backgroundColor: '#232534',borderTopColor:'#45475b',borderTopWidth:1.5 },tabBarActiveTintColor: 'white',tabBarInactiveTintColor: 'gray',        
              })}
            >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Search" component={Player} />
            <Tab.Screen name="My Music" component={Playlist} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({})

export default Appnavigator;
