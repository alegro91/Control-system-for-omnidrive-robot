import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

const Robot = ({ item }) => {
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
        testID="robot-component"
      >
        <FontAwesome5
          name="robot"
          size={20}
          color={hasErrors ? "#F05555" : "#000"}
          testID="battery-icon"
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
                testID="error-icon"
              />
            </>
          ) : (
            <FontAwesome
              name={batteryLevel(item.battery_capacity)}
              size={20}
              color={"#000"}
              testID="battery-icon"
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
              testID="view-error-button"
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
              onPress={() => {
                handleRobotConnect(item);
              }}
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

const styles = StyleSheet.create({
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

export default Robot;
