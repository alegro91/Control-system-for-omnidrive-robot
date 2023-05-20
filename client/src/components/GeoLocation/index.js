import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import * as Location from "expo-location";
import useGeolocationDistance from "../../hooks/useGeolocationDistance";

//Component for getting geolocation of host device.
//Using decimal degrees, 5 decimals for accuracy of 1.11m.
const GeoLocation = () => {
  const { distance, location, errorMsg } = useGeolocationDistance();

  return (
    <View
      style={{
        position: "absolute",
        top: 120,
      }}
    >
      {console.log("HERE - " + distance)}
      {/* If error occurs */}
      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : location ? (
        /* Show distance between current and target position, rounded to nearest integer. */
        <Text>
          Distance: approx. {distance} meters to origo. {"\n"}Max distance to
          control: 200m.
        </Text>
      ) : (
        <Text
          style={{
            color: "red",
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Please allow geo location
        </Text>
      )}
    </View>
  );
};

export default GeoLocation;
