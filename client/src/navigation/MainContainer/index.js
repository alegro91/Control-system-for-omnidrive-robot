import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Platform } from "react-native";

// Screens

import NetworkScanner from "../../components/NetworkScanner";
import AlertsScreen from "../screens/AlertsScreen.js";
import MapScreen from "../screens/MapScreen.js";
import QRScanner from "../../components/QRScanner/index.js";
import RobotControlScreen from "../../screens/RobotControlScreen";
import RobotControl from "../../components/RobotControl";

const Tab = createBottomTabNavigator();
const isMobile = Platform.OS === "web" ? false : true;

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

function MainContainer() {
  const totalErrors = robotsData.reduce((total, robot) => {
    return total + robot.errors.length;
  }, 0);
  return (
    <NavigationContainer>
      {/*isMobile && (
        <Drawer.Navigator
          initialRouteName="Home"
          drawerContentOptions={{
            activeTintColor: "#e91e63",
            itemStyle: { marginVertical: 5 },
          }}
        >
          <Drawer.Screen
            name="Home"
            component={NetworkScanner}
            options={{ drawerLabel: "Home" }}
          />
          <Drawer.Screen
            name="Notifications"
            component={AlertsScreen}
            options={{ drawerLabel: "Notifications" }}
          />
        </Drawer.Navigator>
        )*/}
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let routeName = route.name;
            let customSize = focused ? 25 : 25; // Change size values as needed

            if (routeName === "NetworkScanner") {
              iconName = focused ? "ios-list" : "ios-list-outline";
            } else if (route.name === "Alerts") {
              iconName = focused ? "notifications" : "notifications-outline";
            } else if (route.name === "Map") {
              iconName = focused ? "map" : "map-outline";
            } else if (route.name === "QRScanner") {
              iconName = focused ? "ios-qr-code" : "ios-qr-code-outline";
            } else if (route.name === "RobotControl") {
              iconName = focused
                ? "game-controller-outline"
                : "game-controller-outline";
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={customSize} color={color} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
        tabBarOptions={{
          activeTintColor: "blue",
          inactiveTintColor: "gray",
          tabBarStyle: {
            paddingTop: 10, // Adjust padding as needed
            paddingBottom: 10, // Adjust padding as needed
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
            tabBarBadge: totalErrors,
            tabBarBadgeStyle: {
              backgroundColor: "#F05555",
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
        {/*
        <Tab.Screen
          name="QRScanner"
          component={QRScanner}
          options={{ title: "QR Scanner", headerShown: false }}
        />
        */}

        <Tab.Screen
          name="RobotControl"
          component={RobotControlScreen}
          options={{ title: "Robot Control", headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default MainContainer;
