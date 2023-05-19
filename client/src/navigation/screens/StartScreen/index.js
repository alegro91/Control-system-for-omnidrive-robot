import React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NetworkScanner from "../../../components/NetworkScanner/index.js";
import QRScanner from "../../../components/QRScanner/index.js";
import styles from "./styles.js";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

/**
 * Start screen with two tabs, one for scanning the network for robots and one for scanning a QR code
 * @param {Object} navigation - Navigation object
 * @returns  A view with two tabs for scanning the network and scanning a QR code
 */
const StartScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let customSize = focused ? 25 : 25; // Change size values as needed

            if (route.name === "NetworkScanner") {
              iconName = focused ? "list-outline" : "list-sharp";
            } else if (route.name === "QRScanner") {
              iconName = focused ? "ios-qr-code-outline" : "ios-qr-code";
            }

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
          options={{ title: "Scan network for robots", headerShown: false }}
        />
        <Tab.Screen
          name="QRScanner"
          component={QRScanner}
          options={{ title: "Scan robot with QR code", headerShown: false }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default StartScreen;
