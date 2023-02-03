import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import StartScreen from "./src/screens/StartScreen";
import Button from "./src/components/Button";

export default function App() {
  const [count, setCount] = useState(0);
  const onPress = () => setCount((prevCount) => prevCount + 1);

  return (
    <View style={styles.container}>
      <View style={styles.countContainer}>{/*<Text>Ok: {count}</Text>*/}</View>
      <Button
        onPress={() => setCount(count + 1)}
        title="Network Scan"
        style={styles.button}
      />
      <Button
        onPress={() => setCount(count + 1)}
        title="QR Scan"
        style={styles.button}
      />
    </View>
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
