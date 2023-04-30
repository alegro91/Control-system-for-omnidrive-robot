import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
} from "react-native";
import {
  storeData,
  getData,
  removeData,
  clearData,
  getAllKeys,
} from "../../utils/CacheStorage";
import { Button, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

import Notification from "../Notification";
import Joystick from "../Joystick";
import { FontAwesome } from "@expo/vector-icons/FontAwesome";
import { FontAwesome5 } from "@expo/vector-icons";

import { useDispatch, useSelector } from "react-redux";
import { store } from "../../redux/store";
import { persistStore } from "redux-persist";
import { disconnectRobot } from "../../redux/robotSlice";
import JoystickNative from "../JoystickNative";
import useBluetoothDistance from "../../hooks/useBluetoothDistance";

/* Command strings to make the robot perform the specified commands. */
const moveForwardCMDString = "";
const moveBackwardCMDString = "";
const turnRightCMDString = "";
const turnLeftCMDString = "";

const RobotControl = ({ route }) => {
  const onDisconnect = route?.params?.onDisconnect || (() => {});
  const robotIP = useSelector((state) => state.robot.robotIP);
  const dispatch = useDispatch();
  const [steeringType, setSteeringType] = useState("front");
  const [driveMode, setDriveMode] = useState("manual");
  const [speed, setSpeed] = useState(0);

  const { distance, status, connect, disconnect } = useBluetoothDistance();
  const isWeb = Platform.OS === "web";

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

    // Redux action to disconnect from robot
    dispatch(disconnectRobot());
    persistStore(store, null, () => {
      console.log("Persisted store");
    });

    setDisconnectModalVisible(false);
    onDisconnect();
  };

  return (
    <>
      <Notification
        header={"Connected to robot!"}
        message={`You are now connected to ${robotIP}`}
        visible={robotIP ? true : false}
      />
      <Notification
        header={"Not connected to robot"}
        message={"Please connect to a robot to control it."}
        visible={robotIP ? false : true}
        color={"#F05555"}
      />
      {robotIP ? (
        <>
          <View style={styles.robotControlContainer}>
            {/*<Text style={styles.ipText}>Connected to: {robotIP}</Text>*/}
            {isWeb ? (
              <View>
                {distance !== null && status === "connected" ? (
                  <Text
                    style={{
                      textAlign: "center",
                    }}
                  >
                    Approximate distance to device {distance.toFixed(2)} meters
                  </Text>
                ) : (
                  <Button title="Connect" onPress={connect} />
                )}
                <Text> {status} </Text>
                <Joystick
                  robotIp={robotIP}
                  steeringType={steeringType}
                  driveMode={driveMode}
                />
              </View>
            ) : (
              <JoystickNative
                robotIp={robotIP}
                steeringType={steeringType}
                driveMode={driveMode}
              />
            )}

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
          <Button
            icon={
              <Icon
                name="return-up-back-outline"
                type="ionicon"
                size={32}
                color="black"
              />
            }
            buttonStyle={{
              backgroundColor: "#fff",
              width: 200,
              height: 50,
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              marginBottom: 10,
            }}
            titleStyle={{
              color: "black",
              paddingLeft: 10,
            }}
            onPress={() => {
              navigation.navigate("NetworkScanner");
            }}
            title=""
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  robotControlContainer: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ddd",
  },
  ipText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  connectButton: {
    backgroundColor: "#1E90FF",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
  },
  connectButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
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
