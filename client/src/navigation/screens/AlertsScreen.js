import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Icon, Button } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import {
  HStack,
  Banner,
  Avatar,
  Button as CButton,
} from "@react-native-material/core";
import { useNavigation } from "@react-navigation/native";
import Notification from "../../components/Notification";

import { useState } from "react";

import useRobots from "../../socket/useRobots";

const alertsData = [
  { id: "1", text: "Alert 1" },
  { id: "2", text: "Alert 2" },
  { id: "3", text: "Alert 3" },
  { id: "4", text: "Alert 4" },
  { id: "5", text: "Alert 5" },
];

const robotsData = [
  {
    agv_id: "Robot 1",
    state: "Idle",
    battery_capacity: 100,
    location: "A1",
    errors: [
      { id: "1", errorMessage: "Super dangerous error" },
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
    battery_capacity: 20,
    location: "A2",
    errors: [
      { id: "1", errorMessage: "Super dangerous error" },
      { id: "2", errorMessage: "Error 2" },
      { id: "3", errorMessage: "Error 3" },
    ],
  },
  {
    agv_id: "Robot 3",
    state: "Charging",
    battery_capacity: 0,
    location: "A3",
    errors: [],
  },
  {
    agv_id: "Robot 4",
    state: "Charging",
    battery_capacity: 0,
    location: "A3",
    errors: [],
  },
  {
    agv_id: "Robot 5",
    state: "Charging",
    battery_capacity: 0,
    location: "A3",
    errors: [],
  },
  {
    agv_id: "Robot 6",
    state: "Charging",
    battery_capacity: 0,
    location: "A3",
    errors: [],
  },
  {
    agv_id: "Robot 7",
    state: "Charging",
    battery_capacity: 0,
    location: "A3",
    errors: [],
  },
];

const AlertsScreen = () => {
  const {
    robots,
    startMdnsScan,
    stopMdnsScan,
    searching,
    scanStatus,
    socketConnected,
  } = useRobots();

  const [expanded, setExpanded] = useState([]);

  const robotsWithError = robots.filter((robot) => robot.errors?.length > 0);

  const navigation = useNavigation();

  const renderItem = ({ item, index }) => {
    let iconColor = "#666";
    let iconName = "circle";
    if (item.state === "Moving") {
      iconColor = "#00f";
      iconName = "truck-moving";
    } else if (item.state === "Charging") {
      iconColor = "#0f0";
      iconName = "battery-charging";
    } else if (item.state === "Idle") {
      iconColor = "#f00";
      iconName = "pause-circle";
    }

    const toggleExpanded = () => {
      const newExpanded = [...expanded];
      newExpanded[index] = !newExpanded[index];
      setExpanded(newExpanded);
    };

    const batteryColors = [
      item.battery_capacity > 10 ? "#f00" : "#fff",
      item.battery_capacity > 30 ? "#f90" : "#fff",
      item.battery_capacity > 50 ? "#ff0" : "#fff",
      item.battery_capacity > 70 ? "#9f0" : "#fff",
      item.battery_capacity > 90 ? "#0f0" : "#fff",
    ];
    const batteryLevel = item.battery_capacity / 100;

    const getBatteryColor = (batteryCapacity) => {
      if (batteryCapacity > 70) {
        return "#4cd964";
      } else if (batteryCapacity > 30) {
        return "#ffcc00";
      } else {
        return "#ff3b30";
      }
    };

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={toggleExpanded}
        activeOpacity={0.8}
      >
        <View style={styles.iconContainer}>
          <FontAwesome5 name="robot" size={24} color="#666" />
          <View style={styles.batteryContainer}>
            <LinearGradient
              colors={batteryColors}
              start={[0, 0.5]}
              end={[1, 0.5]}
              style={styles.gradient}
            >
              <View
                style={[
                  styles.batteryLevel,
                  {
                    width: `${batteryLevel * 100}%`,
                    backgroundColor: getBatteryColor(item.battery_capacity),
                  },
                ]}
              />
            </LinearGradient>
            <Text
              style={styles.batteryText}
            >{`${item.battery_capacity}%`}</Text>
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.robotName}>{item.agv_id}</Text>
          <Text
            style={styles.robotDetails}
          >{`${item.location} - ${item.state}`}</Text>
          {item.errors.length > 0 && (
            <>
              <View style={styles.errorsContainer}>
                <FontAwesome5
                  name="exclamation-triangle"
                  size={16}
                  color="#f00"
                />
                <Text
                  style={styles.errorText}
                >{`${item.errors.length} errors`}</Text>
              </View>
              {expanded[index] && (
                <View style={styles.expandedContainer}>
                  <ScrollView persistentScrollbar={true}>
                    {item.errors.map((error) => (
                      <View style={styles.errorItem} key={error.id}>
                        <FontAwesome5
                          name="exclamation-triangle"
                          size={16}
                          color="#f00"
                        />
                        <Text style={styles.errorText}>
                          {error.errorMessage}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {/*
      <Notification
        header={"Notification"}
        message={"Test"}
        visible={robotsWithError.length > 0}
      />
    */}
      <Banner
        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        illustration={(props) => (
          <Avatar
            color="primary"
            icon={(props) => <Icon name="wifi-off" {...props} />}
            {...props}
          />
        )}
        style={{
          paddingTop: 15,
        }}
        buttons={
          <HStack spacing={2}>
            <CButton
              key="fix-it"
              variant="text"
              title="View"
              compact
              onPress={() => {
                navigation.navigate("NetworkScanner");
              }}
            />

            <Button
              // Hidden to make the rescan positioned to the left
              //icon={<Icon name="wifi" size={24} color="black" />}
              buttonStyle={{
                backgroundColor: "#fff",
                width: 200,
                height: 50,
                justifyContent: "center",
              }}
              titleStyle={{
                color: "black",
                paddingLeft: 10,
              }}
              title=""
              onPress={() => {}}
            />
          </HStack>
        }
      />
      <View style={styles.container}>
        <View style={styles.robotContainer}>
          <FlatList
            data={robotsWithError} // change to robots for real data
            renderItem={renderItem}
            keyExtractor={(item) => item.agv_id}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ddd",
  },
  robotContainer: {
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },
  iconContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  batteryContainer: {
    display: "flex",
    marginLeft: 8,
    alignContent: "center",
    justifyContent: "center",
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 4,
    overflow: "hidden",
    width: 24,
    height: 16,
  },
  battery: {
    width: 24,
    height: 12,
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 2,
  },
  batteryText: {
    fontSize: 12,
    color: "#666",
  },
  batteryLevel: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#fff",
    height: "100%",
    zIndex: -1,
  },
  textContainer: {
    flex: 2,
    marginLeft: 8,
  },
  robotName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  robotDetails: {
    fontSize: 14,
    color: "#666",
  },
  errorsContainer: {
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    color: "#f00",
  },
  expandedContainer: {
    flex: 1,
    paddingLeft: 32,
    maxHeight: 150,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#ddd",
  },
  errorItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
});

export default AlertsScreen;
