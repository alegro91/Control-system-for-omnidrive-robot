import React from "react";
import { View } from "react-native";
import Button from "../../components/Button";
import styles from "./styles";

const StartScreen = () => {
  <View style={styles.container}>
    <Button onPress={() => console.log("Button 1 pressed")} title="Button 1" />
    <Button onPress={() => console.log("Button 2 pressed")} title="Button 2" />
  </View>;
};

export default StartScreen;
