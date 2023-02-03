import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styles from "./styles";

const Button = ({ onPress, title, style }) => (
  <TouchableOpacity onPress={onPress} style={styles.button}>
    <Text style={[styles.buttonText, style]}>{title}</Text>
  </TouchableOpacity>
);

export default Button;
