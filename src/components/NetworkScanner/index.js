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
  const sendPushNotification = async () => {
    const message = {
      to: "ExponentPushToken[MBcDrBEO-JjP3oWKe8i-w_]",
      sound: "default",
      title: "Error",
      body: "Some robots appear to have errors, please check the dashboard",
      data: { name: "max" },
    };
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    const data = response._bodyInit;
    //console.log(`Status & Response ID-> ${JSON.stringify(data)}`);
  };

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
  const isMobile = Platform.OS === "ios" || Platform.OS === "android";

  useEffect(() => {
    if (!isMobile) return;
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
    if (!isMobile) return;
    if (hasGlobalErrors) {
      sendPushNotification(); // Send push notification, just expo notification for now

      // Native notifications
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

  const { width, height } = Dimensions.get("window");

  const [selectedError, setSelectedError] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const renderModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={modalStyle.overlay}>
        <View style={modalStyle.centeredView}>
          <View style={modalStyle.modalView}>
            <Text style={modalStyle.modalTitle}>Error details</Text>
            <ScrollView style={modalStyle.scrollView}>
              {selectedError.map((error) => (
                <View key={error.id} style={modalStyle.errorItem}>
                  <Text style={modalStyle.errorId}>ID: {error.id}</Text>
                  <Text style={modalStyle.errorMessage}>
                    {error.errorMessage}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={{ ...modalStyle.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={modalStyle.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const modalStyle = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
    },
    modalView: {
      width: width * 0.8,
      backgroundColor: "white",
      borderRadius: 12,
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
    modalTitle: {
      marginBottom: 15,
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 20,
    },
    scrollView: {
      width: "100%",
      maxHeight: 200,
      marginBottom: 15,
    },
    errorItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
    errorId: {
      fontSize: 16,
      fontWeight: "bold",
    },
    errorMessage: {
      fontSize: 16,
    },
    openButton: {
      borderRadius: 6,
      paddingHorizontal: 5,
      paddingVertical: 3,
      elevation: 2,
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
      fontSize: 16,
    },
  });

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

  return (
    <>
      {renderNotification()}
      {renderModal()}
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
