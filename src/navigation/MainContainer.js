import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens

import HomeScreen from './screens/HomeScreen.js';
import AlertsScreen from './screens/AlertsScreen.js';
import MapScreen from './screens/MapScreen.js';
import QRScanner from '../components/QRScanner/index.js';

//Screen names

const homeName = "Home";
const mapName = "Map";
const qRscannerName = "QRScanner"
const alertsName = "Alerts"

const Tab = createBottomTabNavigator();

function MainContainer() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let routeName = route.name;

            if (routeName === homeName) {
              iconName = focused ? 'home' : 'home-outline';
            }
            else if (route.name === alertsName) {
                iconName = focused ? 'notifications' : 'notifications-outline';
            }
            else if (route.name === mapName) {
                iconName = focused ? 'map' : 'map-outline';
            }
            else if (route.name === qRscannerName) {
                iconName = focused ? 'qr-code' : 'qr-code-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },

        })}
        tabBarOptions={{
          activeTintColor: "yellowgreen",
          inactiveTintColor: "black",
          labelStyle: { paddingBottom: 10, fontSize: 10 },
          style: {
                //Doesent work, wth?
                backgroundColor: 'blue',
                height: '12%', // Increase the height to 12% of the screen
                paddingBottom: 10, // Increase the padding
                paddingTop: 10, // Increase the padding
              },
        }}>

        <Tab.Screen name={homeName} component={HomeScreen} />
        <Tab.Screen name={alertsName} component={AlertsScreen} />
        <Tab.Screen name={mapName} component={MapScreen} />
        <Tab.Screen name={qRscannerName} component={QRScanner} />

      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default MainContainer;