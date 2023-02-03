import "react-native-gesture-handler";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import StartScreen from "./src/screens/StartScreen";
import Button from "./src/components/Button";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import QRScanner from "./src/components/QRScanner/QRScanner";
import NetworkScanner from "./src/components/NetworkScanner/NetworkScanner";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          name="Main"
          component={StartScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="QRScanner" component={QRScanner} />
        <Stack.Screen name="NetworkScanner" component={NetworkScanner} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
  },
  countContainer: {
    alignItems: "center",
    padding: 10,
  },
});
