import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

// Screens

import NetworkScanner from "../../components/NetworkScanner";
import AlertsScreen from "../screens/AlertsScreen.js";
import MapScreen from "../screens/MapScreen.js";
import QRScanner from "../../components/QRScanner/index.js";

const Tab = createBottomTabNavigator();

function MainContainer() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let routeName = route.name;
            let customSize = focused ? 25 : 25; // Change size values as needed

            if (routeName === "NetworkScanner") {
              iconName = focused ? "list-sharp" : "list-outline";
            } else if (route.name === "Alerts") {
              iconName = focused ? "notifications" : "notifications-outline";
            } else if (route.name === "Map") {
              iconName = focused ? "map" : "map-outline";
            } else if (route.name === "QRScanner") {
              iconName = focused ? "ios-qr-code" : "ios-qr-code-outline";
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={customSize} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: "blue",
          inactiveTintColor: "gray",
          tabBarStyle: {
            paddingTop: 10, // Adjust padding as needed
            paddingBottom: 10, // Adjust padding as needed
          },
        }}
      >
        <Tab.Screen
          name="NetworkScanner"
          component={NetworkScanner}
          options={{ title: "Robot list", headerShown: false }}
        />
        <Tab.Screen
          name="Alerts"
          component={AlertsScreen}
          options={{ title: "Alerts", headerShown: false }}
        />
        <Tab.Screen
          name="Map"
          component={MapScreen}
          options={{ title: "Map", headerShown: false }}
        />
        <Tab.Screen
          name="QRScanner"
          component={QRScanner}
          options={{ title: "QR Scanner", headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default MainContainer;
