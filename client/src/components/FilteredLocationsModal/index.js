import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Button,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from "react-native";

const FilteredLocationsModal = ({
  showModal,
  setShowModal,
  locations,
  handleLocationPress,
  cooldown,
  message,
}) => {
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [filterText, setFilterText] = useState("");
  const scrollY = new Animated.Value(0);

  useEffect(() => {
    const filtered = locations.filter((item) =>
      item.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredLocations(filtered);
  }, [filterText, locations]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  const renderLocationItem = ({ item }) => (
    <TouchableOpacity
      style={{
        ...styles.locationItemContainer,
        backgroundColor: cooldown ? "#999" : "#F05555",
      }}
      disabled={cooldown}
      onPress={() => handleLocationPress(item)}
    >
      <Text style={styles.locationItemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={showModal} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              height: scrollY.interpolate({
                inputRange: [0, 200],
                outputRange: ["40%", "60%"],
                extrapolate: "clamp",
              }),
            },
          ]}
        >
          <View style={styles.header}>
            <TextInput
              style={styles.filterInput}
              placeholder="Filter locations"
              placeholderTextColor="#999"
              value={filterText}
              onChangeText={(text) => setFilterText(text)}
            />
            <Button
              title="Close"
              onPress={() => setShowModal(false)}
              color="#F05555"
            />
          </View>

          <View
            style={{
              marginTop: 20,
              marginBottom: 20,
              alignSelf: "center",
            }}
          >
            {/*<Text style={{ textAlign: "center" }}>{message}</Text>*/}

            {cooldown ? (
              <ActivityIndicator size="large" color="#F05555" />
            ) : (
              <>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: message.type === "success" ? 16 : 14,
                    fontWeight: message.type === "error" ? "bold" : "normal",
                    color:
                      message.type === "success"
                        ? "#1E90FF"
                        : message.type === "info"
                        ? "#808080" // Grey color for "info" type
                        : message.type === "error"
                        ? "#F05555" // Red grey for "error" type
                        : "#808080", // Grey color for undefined or null type
                    width: 250,
                  }}
                >
                  {message.text && !cooldown
                    ? message.text
                    : "Choose a location to move to"}
                </Text>
              </>
            )}
          </View>

          <Animated.ScrollView
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.listContainer}
          >
            {filteredLocations.length === 0 && (
              <Text style={{ textAlign: "center" }}>No locations found</Text>
            )}
            {filteredLocations.map((item) => (
              <View key={item}>{renderLocationItem({ item })}</View>
            ))}
          </Animated.ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignSelf: "center",
    width: "150",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  filterInput: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    fontSize: 16,
    color: "#333",
  },
  listContainer: {
    flexGrow: 1,
    paddingTop: 10,
    paddingBottom: 20,
  },
  locationItemContainer: {
    backgroundColor: "#F05555",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  locationItemText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default FilteredLocationsModal;
