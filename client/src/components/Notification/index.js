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

const Notification = ({ header, message, visible, color, opacity }) => {
  const notificationAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
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
  }, [visible]);

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
          backgroundColor: color || "#1E90FF",
          borderRadius: 12,
          opacity: opacity,
        }}
      >
        <View style={styles.notificationContent}>
          <Ionicons name="notifications" size={20} color="white" />
          <Text style={styles.notificationTitle}>{header}</Text>
        </View>
        <Text style={styles.notificationSubtitle}>{message}</Text>
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

export default Notification;
