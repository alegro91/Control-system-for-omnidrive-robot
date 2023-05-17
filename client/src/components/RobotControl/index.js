import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
  Switch,
  FlatList,
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

import FilteredLocationsModal from "../FilteredLocationsModal";
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
import useRobots from "../../socket/useRobots";

import axios from "axios";

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
  const [slowMode, setSlowMode] = useState(false);

  const { robots, locations, goToLocation, goToLocationStatus } = useRobots();

  const [showModal, setShowModal] = useState(false);

  const [isGotoButtonPressed, setIsGotoButtonPressed] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleGotoButtonPress = async (item) => {
    goToLocation(robotIP, item);
    console.log("Going to location:", item + " " + robotIP);
    setIsGotoButtonPressed(true);
    console.log("Going to location:", item);
    // perform your POST request
    setStatusMessage({
      type: goToLocationStatus.type,
      text: goToLocationStatus.text,
    });
  };

  useEffect(() => {
    let cooldownTimeout;
    if (isGotoButtonPressed) {
      cooldownTimeout = setTimeout(() => {
        setIsGotoButtonPressed(false);
      }, 5000); // 5 second cooldown
    }

    return () => {
      clearTimeout(cooldownTimeout);
    };
  }, [isGotoButtonPressed]);

  const handlePress = () => {
    setShowModal(true);
  };

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

  const renderItem = ({ item }) => <Text>{item.name}</Text>;

  return (
    <>
      <Notification
        header={"Connected to robot!"}
        message={`You are now connected to ${robotIP}`}
        visible={robotIP && robots.length > 0 ? true : false}
      />
      <Notification
        header={"Not connected to robot"}
        message={"Please connect to a robot to control it."}
        visible={robotIP && robots.length > 1 ? false : true}
        color={"#F05555"}
      />
      {robotIP && robots.length > 0 ? (
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
                  <Button title="Distance" onPress={connect} />
                )}
                <Text
                  style={{
                    textAlign: "center",
                  }}
                >
                  {status}
                </Text>
                <Joystick
                  robotIp={robotIP}
                  steeringType={steeringType}
                  driveMode={driveMode}
                  slowMode={slowMode}
                />
                <View
                  style={{
                    position: "relative",
                    top: 0,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                    }}
                  >
                    Slow mode
                  </Text>
                  <Switch
                    style={{
                      alignSelf: "center",
                    }}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={
                      driveMode === "slowMode" ? "#f5dd4b" : "#f4f3f4"
                    }
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => {
                      console.log("Slow mode set to:", !slowMode);
                      setSlowMode(!slowMode);
                    }}
                    value={slowMode}
                  />
                </View>
              </View>
            ) : (
              <>
                <View
                  style={{
                    top: 40,
                    paddingBottom: 40,
                  }}
                >
                  {distance !== null && status === "connected" ? (
                    <Text
                      style={{
                        textAlign: "center",
                      }}
                    >
                      Approximate distance to device {distance.toFixed(2)}{" "}
                      meters
                    </Text>
                  ) : (
                    <Button title="Distance" onPress={connect} />
                  )}
                  <Text
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {status}
                  </Text>

                  <JoystickNative
                    robotIp={robotIP}
                    steeringType={steeringType}
                    driveMode={driveMode}
                    slowMode={slowMode}
                  />
                  <View
                    style={{
                      position: "relative",
                      top: 0,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                      }}
                    >
                      Slow mode
                    </Text>
                    <Switch
                      style={{
                        alignSelf: "center",
                      }}
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={
                        driveMode === "slowMode" ? "#f5dd4b" : "#f4f3f4"
                      }
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={() => setSlowMode(!slowMode)}
                      value={slowMode}
                    />
                  </View>
                </View>
              </>
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
                onPress={() => {
                  handlePress();
                }}
              />
              <Button
                title="Disconnect"
                onPress={() => {
                  showDisconnectModal();
                }}
              />
            </View>
          </View>
          <FilteredLocationsModal
            showModal={showModal}
            setShowModal={setShowModal}
            cooldown={isGotoButtonPressed}
            locations={locations[0]}
            message={goToLocationStatus}
            handleLocationPress={(item) => {
              handleGotoButtonPress(item);
            }}
          />

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
    position: "relative",
    top: 30,
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
    position: "relative",
    top: 50,
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
