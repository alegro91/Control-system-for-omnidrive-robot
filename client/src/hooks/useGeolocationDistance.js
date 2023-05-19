import { useState, useEffect } from "react";
import * as Location from "expo-location";

const useGeolocationDistance = (currentLat, currentLong) => {
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

  //Calculates the distance between current position (currentLat, currentLong) and
  //target position (targetlat, targetLong).
  const distanceHaversine = (
    currentLat,
    currentlong,
    targetLat,
    targetLong
  ) => {
    const earthRadius = 6371; //Radius of the Earth, in KM.
    const distanceLat = degToRad(targetLat - currentLat); //Dif in latitude
    const distanceLong = degToRad(targetLong - currentlong); //Dif in longitude

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

  //Converts degrees to radians.
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
      const distance = distanceHaversine(
        location.coords.latitude,
        location.coords.longitude,
        targetLatitude,
        targetLongitude
      );
    })();
  }, []);

  return {
    distance,
  };
};

export default useGeolocationDistance;
