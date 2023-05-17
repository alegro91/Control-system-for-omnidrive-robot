import React, { useState, useEffect } from "react";
import { TouchableOpacity, Text, View, StyleSheet, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { setAuthenticated, setUser } from "../../redux/robotSlice";
import SolwrImage from "../../../assets/SOLWR_black.svg";
import { Snackbar } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";

const ProfilePage = () => {
  const dispatch = useDispatch();

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const user = useSelector((state) => state.robot.user);

  const handleLogout = () => {
    setSnackbarVisible(true);
    setSnackbarMessage("Logging out...");

    setTimeout(() => {
      dispatch(setAuthenticated(false));
      dispatch(setUser(""));
    }, 2000);
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Image source={SolwrImage} style={styles.image} />
        <Text style={styles.text}>
          Logged in as, <Text style={{ fontWeight: "bold" }}>{user}</Text>
        </Text>
        <TouchableOpacity
          testID="logout-button"
          onPress={handleLogout}
          style={styles.submitButton}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={2000}
          style={styles.snackbar}
          action={{
            label: "Close",
            onPress: () => setSnackbarVisible(false),
            labelStyle: { color: "white" },
            style: { color: "white" },
          }}
        >
          <View style={styles.snackbarContent}>
            <MaterialIcons
              name="check-circle"
              size={20}
              color="white"
              style={styles.snackbarIcon}
            />
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
  submitButton: {
    width: 250,
    height: 40,
    backgroundColor: "#F05555",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  image: {
    resizeMode: "contain",
    height: 200,
    width: 200,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  snackbar: {
    backgroundColor: "rgba(0, 128, 0, 1)",
    alignItems: "center",
  },
  snackbarContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  snackbarIcon: {
    marginRight: 8,
  },
  snackbarText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default ProfilePage;
