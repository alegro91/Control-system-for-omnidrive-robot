import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Text,
  Animated,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SolwrImage from "../../../assets/SOLWR_black.svg";
import { Snackbar, ActivityIndicator } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

const Login = ({ setAuthenticated }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setSnackbarVisible(false);

    // Simulating login request with a delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const isValidPassword = await validatePasswordWithMongoDB(password);

    if (isValidPassword) {
      setLoading(false);
      showSnackbar("Login successful", "green");
      setTimeout(() => {
        setAuthenticated(true);
      }, 2000);
    } else {
      setLoading(false);
      showSnackbar("Invalid password", "red");
    }
  };

  const showSnackbar = (message, color) => {
    setSnackbarMessage(message);
    setSnackbarColor(color);
    setSnackbarVisible(true);
  };

  const validatePasswordWithMongoDB = async (password) => {
    // Replace with your MongoDB validation logic
    try {
      // Simulating MongoDB request with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Perform password validation against MongoDB here
      if (password === "admin") {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error validating password with MongoDB:", error);
      return false;
    }
  };

  const appVersion = "1.0.0b";

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Image source={SolwrImage} style={styles.image} />
        <TextInput
          testID="password-input"
          style={styles.input}
          secureTextEntry
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          testID="login-button"
          title="Login"
          onPress={handleLogin}
          style={styles.submitButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" testID="activity-indicator" />
          ) : (
            <Text style={{ textAlign: "center", color: "white" }}>Login</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.appVersionText}>{`Version: ${appVersion}`}</Text>

        <Snackbar
          testID="snackbar"
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={2000}
          style={{ backgroundColor: snackbarColor }}
          action={{
            label: "Close",
            onPress: () => setSnackbarVisible(false),
            style: { color: "white" },
          }}
        >
          <View style={styles.snackbarContent}>
            {snackbarColor === "green" ? (
              <MaterialIcons
                name="check-circle"
                size={20}
                color="white"
                style={styles.snackbarIcon}
              />
            ) : (
              <MaterialIcons
                name="error"
                size={20}
                color="white"
                style={styles.snackbarIcon}
              />
            )}
            <Text style={styles.snackbarText}>{snackbarMessage}</Text>
          </View>
        </Snackbar>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    resizeMode: "contain",
    height: 200,
    width: 200,
  },
  input: {
    width: 250,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  submitButton: {
    width: 250,
    height: 40,
    backgroundColor: "blue",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  appVersionText: {
    color: "lightgray",
    fontSize: 12,
    marginTop: 10,
  },
  snackbarContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  snackbarIcon: {
    marginRight: 8,
  },
  snackbarText: {
    color: "white",
  },
});

export default Login;
