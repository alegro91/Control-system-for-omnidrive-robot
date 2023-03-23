import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

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

  const [hasGlobalErrors, setHasGlobalErrors] = useState(false);
  const notificationAnim = useRef(new Animated.Value(-100)).current;

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(true);
  const notificationListener = useRef();
  const responseListener = useRef();

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    if (hasGlobalErrors) {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });
    }
  }, [hasGlobalErrors]);

  useEffect(() => {
    const hasErrors = robotData.some((robot) => robot.errors.length > 0);
    setHasGlobalErrors(hasErrors);
    if (hasErrors) {
      Animated.timing(notificationAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(notificationAnim, {
        toValue: -150,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [robotData]);

  const renderNotification = () => (
    <Animated.View
      style={[
        styles.notificationContainer,
        {
          transform: [
            {
              translateY: notificationAnim,
            },
          ],
        },
      ]}
    >
      <View
        style={{
          width: "100%",
          backgroundColor: "#F05555",
          borderRadius: 12,
        }}
      >
        <View style={styles.notificationContent}>
          <Ionicons name="notifications" size={20} color="white" />
          <Text style={styles.notificationTitle}>Issues detected</Text>
        </View>
        <Text style={styles.notificationSubtitle}>
          Some robots have have an error
        </Text>
      </View>
    </Animated.View>
  );

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
            <MaterialIcons
              name="warning"
              size={24}
              color={hasErrors ? "#F05555" : "#000"}
            />
          ) : (
            <FontAwesome
              name={batteryLevel(item.battery_capacity)}
              size={20}
              color={"#000"}
            />
          )}
        </View>
        <View style={{}}>
          <TouchableOpacity
            style={{
              backgroundColor: "#1E90FF",
              paddingHorizontal: 5,
              paddingVertical: 3,
              borderRadius: 6,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {}}
          >
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
      {renderNotification()}

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
  connectButtonText: {
    color: "#FFF",
    fontWeight: "500",
    textAlign: "center",
  },
  notificationContainer: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    width: "100%",
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    paddingLeft: 10,
    color: "#FFFFFF",
  },
  notificationSubtitle: {
    fontSize: 12,
    fontWeight: "300",
    color: "#FFFFFF",
    paddingBottom: 20,
    textAlign: "center",
  },
});

export default NetworkScanner;
