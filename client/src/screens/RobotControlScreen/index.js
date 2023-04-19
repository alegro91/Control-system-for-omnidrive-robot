import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import RobotControl from "../../components/RobotControl";
import { useNavigation } from "@react-navigation/native";
import {
  storeData,
  getData,
  removeData,
  clearData,
  getAllKeys,
} from "../../utils/CacheStorage";

const RobotControlScreen = ({ route }) => {
  const navigation = useNavigation();
  const [robotIP, setRobotIP] = useState("");

  useEffect(() => {
    const fetchRobotIP = async () => {
      const ip = await getData("robotIP");
      setRobotIP(ip);
    };
    fetchRobotIP();
  }, []);

  if (route.params && route.params.robot) {
    const { robot, onDisconnect } = route.params;
    return (
      <RobotControl
        route={{
          params: {
            robot: robot,
            robotIP: robotIP,
            onDisconnect: onDisconnect,
          },
        }}
      />
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24 }}>Connect to a Robot</Text>
      <Button
        title="Go to Main Screen"
        onPress={() => navigation.navigate("NetworkScanner")}
      />
    </View>
  );
};

export default RobotControlScreen;
