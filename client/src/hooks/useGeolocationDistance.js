import { useState, useEffect } from "react";
import * as Location from "expo-location";

const useGeolocationDistance = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [distance, setDistance] = useState(null);

  //Target latitude and longitude. Distance should be measured from this point.
  //Lat: 62.42971, Long: 6.32803 corresponds to the H.I. Gjørtz warehouse.
  const targetLatitude = 62.42971;
  const targetLongitude = 6.32803;
  //The maximum accepted distance, in meters. If current location is greater than maxDistance,
  //should not be able to control AGV.
  const maxDistance = 200;

  const distanceHaversine = (
    currentLat,
    currentLong,
    targetLat,
    targetLong
  ) => {
    const earthRadius = 6371; //Radius of the Earth, in KM.
    const distanceLat = degToRad(targetLat - currentLat); //Diff in latitude
    const distanceLong = degToRad(targetLong - currentLong); //Diff in longitude

    const a =
      Math.sin(distanceLat / 2) * Math.sin(distanceLat / 2) +
      Math.cos(degToRad(currentLat)) *
        Math.cos(degToRad(targetLat)) *
        Math.sin(distanceLong / 2) *
        Math.sin(distanceLong / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = earthRadius * c; //Distance in kilometers
    const dm = d * 1000; //Distance in meters

    return dm;
  };

  function degToRad(deg) {
    return deg * (Math.PI / 180);
  }

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let distance = distanceHaversine(
        location.coords.latitude,
        location.coords.longitude,
        targetLatitude,
        targetLongitude
      );
      setDistance(Math.round(distance));
      setLocation(location);
      setErrorMsg(null); // Clear any previous error messages
    } catch (error) {
      setErrorMsg("Error fetching location");
    }
  };

  useEffect(() => {
    // Fetch location immediately
    getLocation();

    // Update location every second
    const interval = setInterval(() => {
      getLocation();
    }, 1000);

    // Clean up the interval on unmount
    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    location,
    distance,
    errorMsg,
  };
};

export default useGeolocationDistance;
