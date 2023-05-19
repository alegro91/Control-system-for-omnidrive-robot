import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import * as Location from "expo-location";
import useGeolocationDistance from "../../hooks/useGeolocationDistance";

//Component for getting geolocation of host device.
//Using decimal degrees, 5 decimals for accuracy of 1.11m.
const GeoLocation = () => {
  const [errorMsg, setErrorMsg] = useState(null);

  const { distance, location } = useGeolocationDistance();

  return (
    <View>
      {console.log("HERE - " + distance)}
      {/* If error occurs */}
      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : location ? (
        /* Show distance between current and target position, rounded to nearest integer. */
        <Text>
          Distance: approx. {distance} meters to origo. {"\n"}Max distance:
          200m.
        </Text>
      ) : (
        <Text>Loading location...</Text>
      )}
    </View>
  );
};

export default GeoLocation;
