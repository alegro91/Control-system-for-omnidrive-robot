import React, { useState, useRef, useEffect } from "react";
import {
  Animated,
  View,
  Text,
  StyleSheet,
  Easing,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

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

const ErrorNotification = ({ robotData }) => {
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

  return renderNotification();
};

const styles = StyleSheet.create({
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

export default ErrorNotification;
