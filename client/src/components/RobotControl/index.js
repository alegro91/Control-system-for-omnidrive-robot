import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import {
  storeData,
  getData,
  removeData,
  clearData,
  getAllKeys,
} from "../../utils/CacheStorage";
import { useNavigation } from "@react-navigation/native";

import Joystick from "../Joystick";
import { FontAwesome } from "@expo/vector-icons/FontAwesome";
import { FontAwesome5 } from "@expo/vector-icons";

/* Command strings to make the robot perform the specified commands. */
const moveForwardCMDString = "";
const moveBackwardCMDString = "";
const turnRightCMDString = "";
const turnLeftCMDString = "";

const RobotControl = ({ route }) => {
  const robot = route?.params?.robot || null;
  const robotIP = route?.params?.robotIP || null;
  const onDisconnect = route?.params?.onDisconnect || (() => {});

  const [connected, setConnected] = useState(robotIP !== null);
  const [robotAddress, setRobotAddress] = useState("");

  /*
  useEffect(() => {
    const getRobotIP = async () => {
      const ip = await getData("robotIP");
      if (ip !== null) {
        setRobotIP(ip);
      }
    };
    getRobotIP();
  }, []);
  */
  useEffect(() => {
    setRobotAddress(robotIP);
    console.log("RobotControl useEffect");
    console.log("robotIP: " + robotIP);
    console.log("initialRobotIP: " + robotAddress);
  }); // Have to find a way to make this only run once

  const [steeringType, setSteeringType] = useState("front");
  const [driveMode, setDriveMode] = useState("manual");
  const [speed, setSpeed] = useState(0);

  const navigation = useNavigation();

  const [disconnectModalVisible, setDisconnectModalVisible] = useState(false);

  const showDisconnectModal = () => {
    setDisconnectModalVisible(true);
  };

  const handleCancelDisconnect = () => {
    setDisconnectModalVisible(false);
  };

  const handleSteeringTypePress = (type) => {
    setSteeringType(type);
  };

  const handleActualDisconnect = () => {
    console.log("Disconnecting from robot");
    setRobotAddress(null);
    setDisconnectModalVisible(false);
    onDisconnect();
    setConnected(false);
  };

  return (
    <>
      {robotAddress ? (
        <>
          <View style={styles.robotControlContainer}>
            <Text style={styles.ipText}>Connected to: {robotAddress}</Text>
            <Joystick
              robotIp={robotIP}
              steeringType={steeringType}
              driveMode={driveMode}
            />
            <View style={styles.steeringTypeContainer}>
              {["Front", "Mid", "Rear", "Pivoting", "Parallel"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={{
                    backgroundColor:
                      steeringType === type.toLowerCase() ? "blue" : "grey",
                    padding: 10,
                    borderRadius: 5,
                    margin: 5,
                  }}
                  onPress={() => handleSteeringTypePress(type.toLowerCase())}
                >
                  <Text style={styles.steeringTypeText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Drive to"
                onPress={() => setDriveMode("driveTo")}
              />
              <Button
                title="Disconnect"
                onPress={() => {
                  showDisconnectModal();
                }}
              />
            </View>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={disconnectModalVisible}
            onRequestClose={() => {
              setDisconnectModalVisible(false);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  Are you sure you want to disconnect?
                </Text>
                <View style={styles.modalButtons}>
                  <Button title="Cancel" onPress={handleCancelDisconnect} />
                  <Button title="Yes" onPress={handleActualDisconnect} />
                </View>
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <View style={styles.robotControlContainer}>
          <Text style={styles.ipText}>Not connected to a robot</Text>
          <View style={styles.buttonContainer}>
            <Button
              title="Connect"
              onPress={() => navigation.navigate("NetworkScanner")}
            />
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  robotControlContainer: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  ipText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  steeringTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
  },
  steeringTypeText: {
    color: "white",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  robotCommandContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
});

export default RobotControl;
