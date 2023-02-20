import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Button from "../../components/Button";
import QRScanner from "../../components/QRScanner";
import styles from "./styles";

/**
 * @param {navigation}
 * @returns StartScreen component with two buttons to navigate to QRScanner and NetworkScanner
 */
const StartScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button
        onPress={() => {
          console.log("Scan network for robots");
          navigation.navigate("NetworkScanner");
        }}
        title="Scan network for robots"
        style={buttonStyle.button}
        textStyle={buttonStyle.buttonText}
      />
      <Button
        onPress={() => {
          console.log("QR scanner enabled");
          navigation.navigate("QRScanner");
        }}
        title="Scan robot with QR code"
        style={buttonStyle.button}
        textStyle={buttonStyle.buttonText}
      />
    </View>
  );
};

const buttonStyle = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 20,
    margin: 20,
  },
  buttonText: {
    fontSize: 16,
  },
});

export default StartScreen;
