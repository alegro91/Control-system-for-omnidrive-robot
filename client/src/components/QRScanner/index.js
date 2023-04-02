import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import RobotControl from "../RobotControl";
/**
 *
 * @param {navigation} navigation - navigation object from react-navigation to navigate to other screens
 * @returns QRScanner component with a button to scan a QR code and a button to go back to the start screen (StartScreen)
 */
const QRScanner = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(true); // state to keep track of whether a QR code has been scanned
  const [robotIp, setRobotIp] = useState("localhost:5656/robot_1"); // state to keep track of the IP address of the robot
  /**
   * This function will request permission to use the camera.
   * It will set the hasPermission state to true if permission is granted.
   * It will set the hasPermission state to false if permission is denied.
   * It will set the hasPermission state to null if permission is not yet granted or denied.
   * It will be called when the component is mounted.
   */
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  /**
   * This function will be called when a QR code is scanned.
   * It will set the scanned state to true.
   * It will alert the user with the type and data of the scanned QR code.
   * @param {type} type - type of the scanned QR code
   * @param {data} data - data of the scanned QR code
   */
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);

    const regex = /^localhost:5656\/(.*)$/; // regex to extract the IP address from the QR code
    const match = data.match(regex);

    if (match && match[1]) {
      setRobotIp(match[1]);
    } else {
      alert("Invalid QR code", "The scanned QR code is not valid.");
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  if (robotIp && scanned) {
    return (
      <RobotControl
        robotIp={robotIp}
        onDisconnect={() => {
          setRobotIp("");
          setScanned(false);
        }}
      ></RobotControl>
    );
  }

  /**
   * This is the JSX returned by the QRScanner component.
   */
  return (
    <View style={styles.container}>
      {scanned ? (
        <Button
          title={"Tap to Scan Again"}
          onPress={() => setScanned(false)}
          style={styles.button}
        />
      ) : (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}
    </View>
  );
};

/**
 * This is the stylesheet for the QRScanner component.
 *
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    alignSelf: "center",
  },
  closeButton: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  button: {
    margin: 20,
  },
});

export default QRScanner;
