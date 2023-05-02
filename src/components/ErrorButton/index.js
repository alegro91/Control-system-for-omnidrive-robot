import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styles from "./styles";

const ErroButton = ({ onPress, title, style, textStyle }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.errorButton, { backgroundColor: "transparent" }, style]}
  >
    <Text style={[textStyle]}>{title}</Text>
  </TouchableOpacity>
);

export default Button;
