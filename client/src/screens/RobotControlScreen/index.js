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

/**
 * Screen that displays the robot control interface.
 * @param {Object} route - The route object passed to the screen. Contains the robot object.
 */
const RobotControlScreen = ({ route }) => {
  const navigation = useNavigation();
  const robot = route?.params?.robot || null;
  const robotIP = route?.params?.robotIP || null;
  const onDisconnect = route?.params?.onDisconnect || (() => {});

  /*
  useEffect(() => {
    const fetchRobotIP = async () => {
      const ip = await getData("robotIP");
      setRobotIP(ip);
    };
    fetchRobotIP();
  }, []);
    */

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
};

export default RobotControlScreen;
