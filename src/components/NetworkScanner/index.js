import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ErrorButton,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Animated,
  Easing,
  Modal,
  Platform,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import ErrorModal from "../ErrorModal";
import ErrorNotification from "../ErrorNotification";
import Notification from "../Notification";

/**
 * NetworkScanner component that scans the network for robots and displays them in a list view,
 * with their current status and location.
 * @returns
 */
function NetworkScanner() {
  const [isLoading, setIsLoading] = useState(true); // Set loading to true on component mount

  /* Robot config */
  const ROBOT_IP = "192.168.100.95";
  const ROBOT_PORT = "7012";
  const ROBOT_COMMAND = "rpc/get_agv_data";

  /* Robot data */
  const [robotData, setRobotData] = useState([]);

  /* Error modal */
  const [selectedError, setSelectedError] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  /*
   * Fetch dummy robot data
   */
  /*
  useEffect(() => {
    setRobotData([
      {
        agv_id: "Robot 1",
        state: "Idle",
        battery_capacity: 100,
        location: "A1",
        errors: [
          { id: "1", errorMessage: "Error 1" },
          { id: "2", errorMessage: "Error 2" },
          { id: "3", errorMessage: "Error 3" },
          { id: "4", errorMessage: "Error 4" },
          { id: "5", errorMessage: "Error 5" },
          { id: "6", errorMessage: "Error 6" },
          { id: "7", errorMessage: "Error 7" },
          { id: "8", errorMessage: "Error 8" },
          { id: "9", errorMessage: "Error 9" },
        ],
      },
      {
        agv_id: "Robot 2",
        state: "Moving",
        battery_capacity: 50,
        location: "A2",
        errors: [],
      },
      {
        agv_id: "Robot 3",
        state: "Charging",
        battery_capacity: 0,
        location: "A3",
        errors: [],
      },
    ]);
  }, []);
*/
  // Test code to add/remove errors from Robot 1
  /*
  useEffect(() => {
    const intervalId = setInterval(() => {
      setRobotData((prevRobotData) => {
        // Find the index of Robot 1 in the robotData array
        const robot1Index = prevRobotData.findIndex(
          (robot) => robot.agv_id === "Robot 1"
        );

        // Create a new array with the same contents as the previous robotData array
        const newRobotData = [...prevRobotData];

        // If Robot 1 has errors, remove them. Otherwise, add errors
        if (prevRobotData[robot1Index].errors.length > 0) {
          newRobotData[robot1Index].errors = [];
        } else {
          newRobotData[robot1Index].errors = [
            { error: "Error 1" },
            { error: "Error 2" },
          ];
        }

        return newRobotData;
      });
    }, 3000);

    // Clear interval on unmount
    return () => clearInterval(intervalId);
  }, []); // Empty array as the second argument ensures that the effect only runs once on mount
*/

  /*
   * Fetch robots from the network and update the robotData state.
   */
  const fetchData = () => {
    const requestOptions = {
      method: "POST",
    };
    fetch(`http://${ROBOT_IP}:${ROBOT_PORT}/${ROBOT_COMMAND}`, requestOptions)
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        //Success
        setIsLoading(false);
        setRobotData(responseJson.Result);
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error

        //alert(error);
        setIsLoading(false);
        console.log("No robots found");
      });
  };

  // Fetch robots from the network on mount
  useEffect(() => {
    fetchData();
  }, []);

  /*
   * Render the list of robots
   */
  const renderItem = ({ item }) => {
    const batteryLevel = (battery_capacity) => {
      if (battery_capacity > 80) return "battery-full";
      if (battery_capacity > 60) return "battery-three-quarters";
      if (battery_capacity > 40) return "battery-half";
      if (battery_capacity > 20) return "battery-quarter";
      return "battery-empty";
    };

    const hasErrors = item.errors && item.errors.length > 0;

    return (
      <View>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
            padding: 20,
            marginTop: 40,
            width: "100%",
            borderWidth: hasErrors ? 2 : 0,
            backgroundColor: "#DBDBDB",
            borderColor: hasErrors ? "#F05555" : "#000",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <FontAwesome5
            name="robot"
            size={20}
            color={hasErrors ? "#F05555" : "#000"}
          />
          <View style={styles.robotContainer}>
            <Text
              style={{
                flex: 2,
                fontWeight: "700",
                color: hasErrors ? "#F05555" : "#000",
              }}
            >
              {item.agv_id}
            </Text>
            <Text style={styles.robotState}>{item.state}</Text>
          </View>

          <View
            style={{
              paddingRight: 20,
            }}
          >
            {hasErrors ? (
              <>
                <MaterialIcons
                  name="warning"
                  size={24}
                  color={hasErrors ? "#F05555" : "#000"}
                />
              </>
            ) : (
              <FontAwesome
                name={batteryLevel(item.battery_capacity)}
                size={20}
                color={"#000"}
              />
            )}
          </View>
          <View style={{}}>
            {hasErrors ? (
              <TouchableOpacity
                style={{
                  backgroundColor: "#F05555",
                  paddingHorizontal: 5,
                  paddingVertical: 3,
                  borderRadius: 6,
                  justifyContent: "center",
                  alignItems: "center",
                  width: 80,
                }}
                onPress={() => {
                  setSelectedError(item.errors);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.connectButtonText}>View Error</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: "#1E90FF",
                  paddingHorizontal: 5,
                  paddingVertical: 3,
                  borderRadius: 6,
                  justifyContent: "center",
                  alignItems: "center",
                  width: 80,
                }}
                onPress={() => {}}
              >
                <Text style={styles.connectButtonText}>Connect</Text>
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 10,
            }}
          >
            <Entypo name="location-pin" size={20} color="black" />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "400",
                textAlign: "center",
              }}
            >
              {item.location}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  /*
   * Render UI
   */
  return (
    <>
      <ErrorNotification robotData={robotData} />
      <Notification
        header={"Notification"}
        message={"Searching for robots..."}
        visible={isLoading}
      />
      <Notification
        header={"Notification"}
        message={"No robots found"}
        visible={!isLoading && robotData.length === 0}
      />
      <ErrorModal
        selectedError={selectedError}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : robotData.length > 0 ? (
          <FlatList
            data={robotData}
            renderItem={renderItem}
            keyExtractor={(item) => item.agv_id}
            style={{
              padding: 30,
              paddingTop: 150,
            }}
          />
        ) : (
          <View>
            <Button title="Search Again" onPress={fetchData} />
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  robotContainer: {
    display: "flex",
    flexDirection: "column",
    paddingLeft: 20,
    paddingRight: 20,
  },
  robotName: {
    flex: 2,
    fontWeight: "700",
  },
  robotState: {
    flex: 1,
    fontWeight: "300",
    fontSize: 12,
  },
  connectButtonText: {
    color: "#FFF",
    fontWeight: "500",
    textAlign: "center",
  },
});

export default NetworkScanner;
