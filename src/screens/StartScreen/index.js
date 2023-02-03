import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "../../components/Button";
import styles from "./styles";

const StartScreen = () => (
  <View style={styles.container}>
    <Button
      onPress={() => console.log("Scan network for robots")}
      title="Scan network for robots"
      style={buttonStyle.button}
      textStyle={buttonStyle.buttonText}
    />
    <Button
      onPress={() => console.log("Scan robot with QR code")}
      title="Scan robot with QR code"
      style={buttonStyle.button}
      textStyle={buttonStyle.buttonText}
    />
  </View>
);

const buttonStyle = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 20,
    margin: 20,
  },
  buttonText: {
    fontFamily: "Trebuchet MS', sans-serif",
    fontSize: 16,
  },
});

export default StartScreen;
