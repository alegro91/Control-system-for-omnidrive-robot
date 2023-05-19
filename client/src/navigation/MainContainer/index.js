import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Platform, View, StyleSheet, Animated } from "react-native";
import { useEffect } from "react";

// Screens

import NetworkScanner from "../../components/NetworkScanner";
import AlertsScreen from "../screens/AlertsScreen.js";
import MapScreen from "../screens/MapScreen.js";
import QRScanner from "../../components/QRScanner/index.js";
import RobotControlScreen from "../screens/RobotControlScreen";
import RobotControl from "../../components/RobotControl";

import useRobots from "../../socket/useRobots";
import ProfilePage from "../screens/ProfilePage";
import Login from "../../components/Login";

import { useDispatch, useSelector } from "react-redux";
import { setAuthenticated, setUser } from "../../redux/robotSlice";

const Tab = createBottomTabNavigator();

function MainContainer() {
  /* Custom hook */
  const {
    robots,
    startMdnsScan,
    stopMdnsScan,
    searching,
    scanStatus,
    socketConnected,
    error,
  } = useRobots();

  const dispatch = useDispatch();

  const authenticated = useSelector((state) => state.robot.authenticated);

  useEffect(() => {
    console.log(authenticated, "authenticated");
  }, [authenticated]);

  const totalErrors = robots.reduce((total, robot) => {
    return total + robot.errors?.length;
  }, 0);

  return (
    <>
      {authenticated ? (
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                const iconSize = focused
                  ? new Animated.Value(1)
                  : new Animated.Value(0.8);
                const iconColor = focused ? "#8a2be2" : "gray";

                useEffect(() => {
                  Animated.spring(iconSize, {
                    toValue: focused ? 1 : 0.8,
                    friction: 3,
                    useNativeDriver: false,
                  }).start();
                }, [focused]);

                let iconName;

                if (route.name === "NetworkScanner") {
                  iconName = focused ? "ios-list" : "ios-list-outline";
                } else if (route.name === "Alerts") {
                  iconName = focused
                    ? "notifications"
                    : "notifications-outline";
                } else if (route.name === "Map") {
                  iconName = focused ? "map" : "map-outline";
                } else if (route.name === "QRScanner") {
                  iconName = focused ? "ios-qr-code" : "ios-qr-code-outline";
                } else if (route.name === "RobotControl") {
                  iconName = focused
                    ? "game-controller-outline"
                    : "game-controller-outline";
                } else if (route.name === "Profile") {
                  iconName = focused ? "person" : "person-outline";
                }

                return (
                  <Animated.View style={{ transform: [{ scale: iconSize }] }}>
                    <Ionicons name={iconName} size={size} color={iconColor} />
                  </Animated.View>
                );
              },
              tabBarActiveTintColor: "#8a2be2",
              tabBarInactiveTintColor: "gray",
            })}
            tabBarOptions={{
              style: {
                paddingTop: 10,
                paddingBottom: 10,
                backgroundColor: "#FFFFFF",
                borderRadius: 20,
                marginHorizontal: 20,
                marginBottom: 20,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              },
            }}
          >
            <Tab.Screen
              name="NetworkScanner"
              component={NetworkScanner}
              options={{ title: "Robot list", headerShown: false }}
            />
            <Tab.Screen
              name="Alerts"
              component={AlertsScreen}
              options={{
                title: "Alerts",
                headerShown: false,
                tabBarBadge: totalErrors ? totalErrors : null,
                tabBarBadgeStyle: {
                  backgroundColor: "#8a2be2",
                  color: "white",
                  fontSize: 12,
                  width: 20,
                },
              }}
            />
            <Tab.Screen
              name="Map"
              component={MapScreen}
              options={{ title: "Map", headerShown: false }}
            />
            <Tab.Screen
              name="RobotControl"
              component={RobotControlScreen}
              options={{ title: "Robot Control", headerShown: false }}
            />
            <Tab.Screen
              name="Profile"
              options={{ title: "Profile", headerShown: false }}
              component={ProfilePage}
            />
          </Tab.Navigator>
        </NavigationContainer>
      ) : (
        <Login />
      )}
    </>
  );
}

export default MainContainer;
