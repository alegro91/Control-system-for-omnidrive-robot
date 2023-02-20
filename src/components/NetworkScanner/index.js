import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Button } from "react-native";

const NetworkScanner = ({ navigation }) => {
  const [devices, setDevices] = useState([]);
  const [scanned, setScanned] = useState(false);

  /*
   * Test data for now until I can get the network scanner working.
   * We should implement the set devices as its own model.
   */
  useEffect(() => {
    setDevices([
      {
        address: "192.168.1.1",
        port: "8890",
        name: "Test Device 1",
        id: "",
        type: "",
        model: "",
        manufacturer: "",
        mac: "93:93:93:93:93:93",
        ip: "",
        version: "",
      },
    ]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /*
   * This is the function that will scan the network for devices.
   * It will need to be called from the button press.
   */
  const handleScanned = () => {
    setScanned(true);
  };

  /**
   * This is the view that will be rendered.
   * It will show a button to scan the network.
   * Once the network has been scanned, it will show a list of devices.
   * The list of devices will be a list of buttons that will take you to the device page.
   * The device page will show the device information and allow you to control the device.
   */
  return (
    <>
      {scanned ? (
        <View style={styles.container}>
          {devices.map((device, index) => (
            <Text key={index}>
              {device.name} - MAC({device.mac})
            </Text>
          ))}
          <Button
            title={"Tap to Scan again"}
            onPress={() => handleScanned()}
            style={styles.button}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <Button
            title={"Tap to Scan"}
            onPress={() => handleScanned()}
            style={styles.button}
          />
        </View>
      )}
    </>
  );
};

/**
 * This is the style sheet for the view.
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
});

export default NetworkScanner;
