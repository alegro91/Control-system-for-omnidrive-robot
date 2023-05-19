import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import * as Location from "expo-location";

//Component for getting geolocation of host device.
//Using decimal degrees, 5 decimals for accuracy of 1.11m.
const GeoLocation = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  //Target latitude and longitude. Distance should be measured from this point.
  //Lat: 62.42971, Long: 6.32803 corresponds to ther H.I. Gjørtz wareshouse.
  const targetLatitude = 62.42971;
  const targetLongitude = 6.32803;
  //The maximum acepted distance, in meters. If current location is greater than maxDistance,
  //should not be able to control AGV.
  const maxDistance = 200;

  //Temporary lat and long for testing
  //const currentLat = 62.42977;
  //const currentLong = 6.3286;

  //Calculates the distance between first position (lat1, long1) and
  //second position (lat2, long2).
  //Current position - 1  Target position - 2
  const distanceHaversine = (lat1, long1, lat2, long2) => {
    const earthRadius = 6371; //Radius of the Earth, in KM.
    const distanceLat = degToRad(lat2 - lat1); //Dif in latitude
    const distanceLong = degToRad(long2 - long1); //Dif in longitude

    const a =
      Math.sin(distanceLat / 2) * Math.sin(distanceLat / 2) +
      Math.cos(degToRad(lat1)) *
        Math.cos(degToRad(lat2)) *
        Math.sin(distanceLong / 2) *
        Math.sin(distanceLong / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = earthRadius * c; //Distance in kilometers
    const dm = d * 1000; //Distance in meters

    return dm;
  };

  //Converts degrees to radian.
  function degToRad(deg) {
    return deg * (Math.PI / 180);
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  return (
    <View>
      {/* If error occurs */}
      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : location ? (
        /* Show distance between current and target position, rounded to nearest integer. */
        <Text>
          Distance: approx.{" "}
          {Math.round(
            distanceHaversine(
              location.coords.latitude,
              location.coords.longitude,
              targetLatitude,
              targetLongitude
            )
          )}{" "}
          meters to origo. {"\n"}Max distance: 200m.
        </Text>
      ) : (
        <Text>Loading location...</Text>
      )}
    </View>
  );
};

export default GeoLocation;
