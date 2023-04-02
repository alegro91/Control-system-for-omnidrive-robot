import React, { useState } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

import Joystick from "../Joystick";

const RobotControl = ({ robotIp, onDisconnect }) => {
  const [steeringType, setSteeringType] = useState("front");
  const [driveMode, setDriveMode] = useState("manual");
  const [speed, setSpeed] = useState(0);

  const handleSteeringTypePress = (type) => {
    setSteeringType(type);
  };

  return (
    <View style={styles.robotControlContainer}>
      <Text style={styles.ipText}>Connected to: {robotIp}</Text>
      <Joystick
        robotIp={robotIp}
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
        <Button title="Drive to" onPress={() => setDriveMode("driveTo")} />
        <Button title="Disconnect" onPress={onDisconnect} />
      </View>
    </View>
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
});

export default RobotControl;
