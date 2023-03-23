import React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NetworkScanner from "../../components/NetworkScanner/index.js";
import QRScanner from "../../components/QRScanner";
import styles from "./styles";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const StartScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <NavigationContainer independent={true}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "NetworkScanner") {
                iconName = focused ? "list-outline" : "list-sharp";
              } else if (route.name === "QRScanner") {
                iconName = focused ? "ios-qr-code-outline" : "ios-qr-code";
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: "blue",
            inactiveTintColor: "gray",
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
      </NavigationContainer>
    </View>
  );
};

export default StartScreen;
