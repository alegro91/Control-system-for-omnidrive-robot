import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
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
  LayoutAnimation,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Button, Icon } from "react-native-elements";
import {
  HStack,
  Banner,
  Avatar,
  Button as CButton,
} from "@react-native-material/core";
import {
  storeData,
  getData,
  removeData,
  clearData,
  getAllKeys,
} from "../../utils/CacheStorage";

import { useDispatch, useSelector } from "react-redux";
import { updateRobotIP } from "../../redux/robotSlice";

import ErrorModal from "../ErrorModal";
import ErrorNotification from "../ErrorNotification";
import Notification from "../Notification";

import useRobots from "../../socket/useRobots";

/**
 * NetworkScanner component that scans the network for robots and displays them in a list view,
 * with their current status and location.
 * @returns
 */
const NetworkScanner = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false); // Set loading to true on component mount

  const [isExpanded, setIsExpanded] = useState([]);

  const toggleBox = (item) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    if (item.agv_id === undefined) {
      setIsExpanded((prev) => {
        return prev.includes(item)
          ? prev.filter((i) => i !== item)
          : [...prev, item];
      });
      return;
    } else {
      setIsExpanded((prev) => {
        return prev.includes(item.agv_id)
          ? prev.filter((i) => i !== item.agv_id)
          : [...prev, item.agv_id];
      });
    }
  };

  const isExpandedBox = (item) => {
    if (isExpanded.includes(item.agv_id)) {
      return true;
    }
    return isExpanded.includes(item);
  };

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

  const searchButtonTitle =
    scanStatus === "scanning" ? "Stop mDNS Scan" : "Start mDNS Scan";
  const searchButtonPress =
    scanStatus === "scanning" ? stopMdnsScan : startMdnsScan;

  /* Robot config */
  const ROBOT_IP = "192.168.100.95";
  const ROBOT_PORT = "7012";
  const ROBOT_COMMAND = "rpc/get_agv_data";

  /* Robot data */
  const [robotData, setRobotData] = useState([]);

  /* Error modal */
  const [selectedError, setSelectedError] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [timeout, setTimeout] = useState(false);

  /*
   * Fetch dummy robot data
   */

  useEffect(() => {
    setTimeout(() => {
      setTimeout(true);
    }, 5000);
  }, [socketConnected]);

  /*
  useEffect(() => {
    console.log("ROBOTS", robots);
  }, [robots]);
  */

  /*
  useEffect(() => {
    setRobotData([
      {
        agv_id: "Robot 1",
        state: "Idle",
        battery_capacity: 100,
        location: "A1",
        errors: [{ id: "1", errorMessage: "Error 1" }],
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
      {
        agv_id: "Robot 4",
        state: "Charging",
        battery_capacity: 0,
        location: "A3",
        errors: [],
      },
    ]);
  }, []);
  */

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

  /*
   * Fetch robots from the network and update the robotData state.
   */

  const fetchData = () => {
    /*
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
      */
  };

  // Fetch robots from the network on mount
  useEffect(() => {
    fetchData();
  }, []);

  /*
  useEffect(() => {
    const scanNetworkForRobots = async () => {
      const ipRange = [];

      // Generate IP addresses in the 192.168.x.x range
      for (let i = 0; i < 256; i++) {
        for (let j = 0; j < 256; j++) {
          ipRange.push(`192.168.${i}.${j}`);
        }
      }

      ipRange.forEach(async (ip) => {
        try {
          const response = await fetch(`http://${ip}:7012/rpc/get_agv_data`);
          if (response.ok) {
            const data = await response.json();
            // You can add validation here to check if the response contains valid robot data
            setRobots((prevRobots) => [...prevRobots, { ...data, ip }]);
          }
        } catch (error) {
          console.error(`Error fetching robot data from ${ip}:`, error);
        }
      });
      setIsLoading(false);
    };

    scanNetworkForRobots();
  }, []);
  */

  const handleRobotIPChange = (ip) => {
    dispatch(updateRobotIP(ip));
  };

  const handleRobotConnect = (robot) => {
    //console.log("Connecting to robot:", robot);
    //console.log("Robot IP:", "192.168.1.127");
    console.log("Robot:", robot);
    //storeData("robotIP", "192.168.1.127");
    handleRobotIPChange(robot.ip);
    navigation.navigate("RobotControl", {
      robot,
      robotIP: robot.ip,
      onDisconnect: () => {
        //navigation.navigate("NetworkScanner");
      },
    });
  };

  /*
   * Render the list of robots
   */
  const renderItem = ({ item }) => {
    // For robot list animation

    const batteryLevel = (battery_capacity) => {
      if (battery_capacity > 80) return "battery-full";
      if (battery_capacity > 60) return "battery-three-quarters";
      if (battery_capacity > 40) return "battery-half";
      if (battery_capacity > 20) return "battery-quarter";
      return "battery-empty";
    };

    const hasErrors = item.errors?.length > 0;

    //item.isExpanded = false;
    //item.loaded = true;
    //item.is_blocked = false;

    /*
    item.visited_places = [
      "Warehouse A",
      "Loading Dock",
      "Storage Area 1",
      "Storage Area 2",
      "Assembly Line",
    ];
    */

    return (
      <View>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 30,
            paddingBottom: 30,
            marginTop: 40,
            width: "100%",
            borderWidth: hasErrors ? 2 : 0,
            backgroundColor: "#fff",
            borderColor: hasErrors ? "#F05555" : "#000",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          onPress={() => toggleBox(item)}
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
                width: 80,
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

        {/* Additions */}
        {isExpandedBox(item) && (
          <Animated.View
            style={{
              position: "relative",
              top: -10,
              paddingTop: 25,
              paddingBottom: 15,
              backgroundColor: "#fff",
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              zIndex: -1,
              overflow: "hidden",
            }}
          >
            {item.loaded != null ||
            item.last_location != null ||
            item.is_blocked != null ? (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingLeft: 20,
                    paddingBottom: 15,
                  }}
                >
                  <Icon
                    name="package"
                    type="material-community"
                    size={20}
                    color="#000"
                    style={{ marginRight: 10 }}
                  />
                  <Text style={{ fontSize: 16, fontWeight: "400" }}>
                    {item.loaded ? "Loaded" : "Not loaded"}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingLeft: 20,
                    paddingBottom: 15,
                  }}
                >
                  <Icon
                    name="map-marker"
                    type="material-community"
                    size={20}
                    color="#000"
                    style={{ marginRight: 10 }}
                  />
                  <Text style={{ fontSize: 16, fontWeight: "400" }}>
                    {item.last_location ? item.last_location : "Unknown"}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingLeft: 20,
                  }}
                >
                  <Icon
                    type="material-community"
                    name={
                      item.is_blocked ? "motion-sensor" : "motion-sensor-off"
                    }
                    size={20}
                    color={item.is_blocked ? "red" : "green"}
                    style={{ marginRight: 10 }}
                  />
                  <Text style={{ fontSize: 16, fontWeight: "400" }}>
                    {item.is_blocked ? "Sensor blocked" : "Sensor clear"}
                  </Text>
                </View>
              </>
            ) : (
              <View style={{ alignItems: "center", padding: 20 }}>
                <Icon
                  name="alert-circle-outline"
                  type="material-community"
                  size={40}
                  color="gray"
                />
                <Text
                  style={{ fontSize: 16, fontWeight: "400", paddingTop: 10 }}
                >
                  No information available
                </Text>
              </View>
            )}
          </Animated.View>
        )}
      </View>
    );
  };

  /*
   * Render UI
   */
  return (
    <>
      {socketConnected || timeout ? (
        <>
          <ErrorNotification robotData={robotData} />
          <Notification
            header={"Notification"}
            message={"Searching for robots..."}
            visible={isLoading}
          />

          {/*<Notification
            header={"No robots found"}
            message={"Search again maybe?"}
            visible={
              !isLoading &&
              robotData.length === 0 &&
              !searching &&
              socketConnected
            }
            color={"#F05555"}
          />*/}
          <Notification
            header={"Backend Error"}
            message={"Service is not running"}
            visible={!socketConnected && !searching}
            color={"#F05555"}
          />
          <Notification
            header={"Scanning"}
            message={"Searching for robots..."}
            visible={searching && socketConnected}
          />
          <Notification
            header={"Search?"}
            message={"Press the button to search for robots"}
            visible={!searching && robots.length === 0 && socketConnected}
          />
          <ErrorModal
            selectedError={selectedError}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          />
          {!searching && robots.length > 0 && (
            <Banner
              text="If you can't find your robot, try pressing the rescan button"
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
                    title="Rescan"
                    compact
                    onPress={() => {
                      startMdnsScan();
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
          )}
          <View style={styles.container}>
            {searching ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : robots.length > 0 ? (
              <FlatList
                data={robots}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                persistentScrollbar={true}
                style={{
                  padding: 30,
                  paddingTop: 0,
                }}
              />
            ) : (
              <View>
                {socketConnected && !searching && (
                  <>
                    <Button
                      icon={
                        <Icon
                          name="bluetooth"
                          type="ionicon"
                          size={24}
                          color="black"
                        />
                      }
                      buttonStyle={{
                        backgroundColor: "#fff",
                        width: 200,
                        height: 50,
                        justifyContent: "center",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        marginBottom: 10,
                      }}
                      titleStyle={{
                        color: "black",
                        paddingLeft: 10,
                      }}
                      onPress={() => {
                        const referenceRSSI = -59; // RSSI value measured at 1 meter
                        const pathLossExponent = 2.5; // Varies between 2 and 4, depending on the environment

                        navigator.bluetooth
                          .requestDevice({
                            filters: [
                              {
                                namePrefix: "Elias",
                              },
                            ],
                            //optionalServices: ["your-service-uuid"],
                          })
                          .then((device) => {
                            device.addEventListener(
                              "advertisementreceived",
                              (event) => {
                                const currentRSSI = event.rssi;
                                const distance =
                                  10 **
                                  ((referenceRSSI - currentRSSI) /
                                    (10 * pathLossExponent));
                                console.log(
                                  `Device: ${device.name}, RSSI: ${currentRSSI}, Estimated distance: ${distance} meters`
                                );
                              }
                            );

                            return device.watchAdvertisements();
                          })
                          .catch((error) => {
                            console.error("Error:", error);
                          });
                      }}
                      title=""
                    />
                    <Button
                      icon={<Icon name="wifi" size={24} color="black" />}
                      buttonStyle={{
                        backgroundColor: "#fff",
                        width: 200,
                        height: 50,
                        justifyContent: "center",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        marginBottom: 10,
                      }}
                      titleStyle={{
                        color: "black",
                        paddingLeft: 10,
                      }}
                      onPress={startMdnsScan}
                      title=""
                    />
                  </>
                )}
              </View>
            )}
          </View>
        </>
      ) : (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  containerMDNS: {
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    padding: 20,
    marginTop: 20,
  },
  flatListContainer: {
    height: "50%", // Adjust this value based on your desired height
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  listItem: {
    fontSize: 18,
    textAlign: "center",
    padding: 10,
  },
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ddd",
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
});

export default NetworkScanner;
