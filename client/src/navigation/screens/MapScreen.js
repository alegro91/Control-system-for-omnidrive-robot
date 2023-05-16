import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
const { width, height } = Dimensions.get("window");
import { Svg, Circle, Polygon } from "react-native-svg";
import useRobots from "../../socket/useRobots";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { on } from "events";
import { useDispatch, useSelector } from "react-redux";
import { updateRobotIP } from "../../redux/robotSlice";
import { Animated } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import GeoLocation from "../../components/GeoLocation"
import MapImage from "../../../assets/map_giortz_no_dimensions.png";

const mapToPixelCoordinates = (value, range) => {
  return (value / range) * width;
};

const RobotDetails = ({ robot, onPressManage }) => (
  <View style={styles.robotDetails}>
    <Text
      style={{
        fontWeight: "bold",
        fontSize: 12,
      }}
    >
      {robot.agv_id}
    </Text>
    <Text
      style={{
        fontWeight: "normal",
        fontSize: 12,
        marginBottom: 10,
      }}
    >
      {robot.state}
    </Text>
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
      }}
    >
      <Icon name="battery-full" size={15} color="#000" />
      <Text
        style={{
          marginLeft: 5,
        }}
      >
        {robot.battery_capacity}%
      </Text>
    </View>
    <Button
      style={{
        marginBottom: 5,
      }}
      onPress={() => {
        onPressManage(robot);
      }}
      title="Control"
      titleStyle={{
        fontSize: 14,
      }}
      type="outline"
    ></Button>

    {/* Speech Bubble */}
    <View style={styles.speechBubble}>
      <Svg width={20} height={10}>
        <Polygon
          points="0,0 10,10 20,0"
          fill="white"
          stroke="#ccc"
          strokeWidth={1}
        />
      </Svg>
    </View>
    {/* Add more details and icons as needed */}
  </View>
);

const SvgButton = ({ robot, handlePress, isSelected, onPressManage }) => {
  const pulseValue = useRef(
    new Animated.Value(robot.state === "Moving" ? 1.2 : 1)
  ).current;

  const startPulseAnimation = () => {
    Animated.sequence([
      Animated.timing(pulseValue, {
        toValue: 1.2,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(pulseValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (robot.state === "Moving") {
        startPulseAnimation();
      }
    });
  };

  useEffect(() => {
    startPulseAnimation(); // Start the pulse animation when the component mounts

    // Cleanup function to stop the animation when the component unmounts
    return () => {
      pulseValue.stopAnimation();
    };
  }, []);

  useEffect(() => {
    if (robot.state === "Moving") {
      startPulseAnimation();
    }
  }, [robot.state]);

  return (
    <View
      style={{
        position: "absolute",
        top: mapToPixelCoordinates(180 - robot.y * 1.7, 150),
        left: mapToPixelCoordinates(robot.x * 1.7 + 130, 150),
      }}
    >
      <Animated.View
        style={{
          transform: [{ scale: pulseValue }],
        }}
      >
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            handlePress(robot);
          }}
          style={{
            width: 100,
            height: 100,
            backgroundColor: "transparent",
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FontAwesome5
            name="robot"
            size={20}
            color={
              robot.errors?.length > 0
                ? "red"
                : isSelected
                ? "#8a2be2"
                : "#0C134F"
            }
          />
        </TouchableOpacity>
      </Animated.View>
      {isSelected && (
        <RobotDetails robot={robot} onPressManage={onPressManage} />
      )}
    </View>
  );
};

const MapScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { robots } = useRobots();
  const [selectedRobot, setSelectedRobot] = useState(null);

  const handleRobotPress = (robot) => {
    setSelectedRobot(selectedRobot === robot ? null : robot);
  };

  useEffect(() => {
    console.log("robots", robots);
  }, [robots]);

  return (
    <View
      style={styles.container}
      onStartShouldSetResponder={() => true} // Make the container able to receive touch events
      onResponderRelease={() => setSelectedRobot(null)} // Deselect the robot when the container is pressed
    >
      <Image
        source={MapImage}
        style={[styles.mapImage, styles.rotatedImage]}
        resizeMode="contain"
      />
      {robots.map((robot) => (
        <SvgButton
          key={robot.agv_id}
          robot={robot}
          handlePress={handleRobotPress}
          isSelected={selectedRobot === robot}
          onPressManage={() => {
            dispatch(updateRobotIP(robot.ip)); // Update the robot IP using dispatch
            navigation.navigate("RobotControl");
          }}
        />
      ))}
      {/*<GeoLocation /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mapImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  robotDetails: {
    position: "absolute",
    top: -120, // Adjust this value to position the details above the selected robot
    left: 0,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    // Add more styles as needed
  },
  speechBubble: {
    position: "absolute",
    bottom: -10,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center", // Center the triangle vertically
  },
});

export default MapScreen;
