import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

function NetworkScanner() {
  const [isLoading, setIsLoading] = useState(false); // Set loading to true on component mount

  const ROBOT_IP = "192.168.100.95";
  const ROBOT_PORT = "7012";
  const ROBOT_COMMAND = "rpc/get_agv_data";

  const [robotData, setRobotData] = useState([]);

  useEffect(() => {
    setRobotData([
      {
        agv_id: "Robot 1",
        state: "Idle",
        battery_capacity: 100,
        location: "A1",
        errors: [{ error: "Error 1" }, { error: "Error 2" }],
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

  useEffect(() => {
    fetchData();
  }, []);

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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 12,
          padding: 20,
          marginTop: 30,
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
        <FontAwesome5 name="robot" size={20} />
        <View style={styles.robotContainer}>
          <Text style={styles.robotName}>{item.agv_id}</Text>
          <Text style={styles.robotState}>{item.state}</Text>
        </View>

        <View
          style={{
            paddingRight: 20,
          }}
        >
          {hasErrors ? (
            <MaterialIcons name="warning" size={24} color="red" />
          ) : (
            <FontAwesome
              name={batteryLevel(item.battery_capacity)}
              size={20}
              color={"#000"}
            />
          )}
        </View>
        <View style={{}}>
          <TouchableOpacity style={styles.connectButton} onPress={() => {}}>
            <Text style={styles.connectButtonText}>Connect</Text>
          </TouchableOpacity>
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
      </View>
    );
  };

  return (
    <>
      <View
        style={{
          display: "flex",
          //position: "absolute",
          zIndex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 30,
          width: "100%",
        }}
      >
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            width: "100%",
            backgroundColor: "#DBDBDB",
            borderRadius: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="notifications" size={20} color="black" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                paddingLeft: 10,
              }}
            >
              No issues detected
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 10,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "400",
                paddingLeft: 10,
              }}
            >
              All robots are operational
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : robotData.length > 0 ? (
          <FlatList
            data={robotData}
            renderItem={renderItem}
            keyExtractor={(item) => item.agv_id}
            style={{}}
          />
        ) : (
          <View>
            <Text>No robots found</Text>
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
  connectButton: {
    backgroundColor: "#1E90FF",
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  connectButtonText: {
    color: "#FFF",
    fontWeight: "500",
    textAlign: "center",
  },
});

export default NetworkScanner;
