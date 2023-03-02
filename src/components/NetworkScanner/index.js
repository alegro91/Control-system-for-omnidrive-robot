import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";

function NetworkScanner() {
  const ROBOT_IP = "192.168.100.95";
  const ROBOT_PORT = "7012";
  const ROBOT_COMMAND = "get_agv_data";
  const [robotData, setRobotData] = useState(null);

  console.log("NetworkScanner rendered");

  const fetchData = () => {
    fetch(`http://${ROBOT_IP}:${ROBOT_PORT}/${ROBOT_COMMAND}`)
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        //Success
        alert("Success");
        console.log(responseJson);
        setRobotData(responseJson);
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error
        alert(error);
        console.error(error);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View>
      {robotData ? (
        <View>
          <Text>AGV ID: {robotData.agv_id}</Text>
          <Text>State: {robotData.state}</Text>
          <Text>Loaded: {robotData.loaded ? "Yes" : "No"}</Text>
          <Text>Battery Capacity: {robotData.battery_capacity}</Text>
          {/* and so on */}
        </View>
      ) : (
        <Text>Loading robot data...</Text>
      )}
    </View>
  );
}

export default NetworkScanner;
