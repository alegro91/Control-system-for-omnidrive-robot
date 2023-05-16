import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import * as Location from 'expo-location';

//Component for getting geolocation of host device.
const GeoLocation = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
  
    useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      })();
    }, []);
  
    return (
      <View>
        {errorMsg ? (
          <Text>{errorMsg}</Text>
        ) : location ? (
          <Text>
            Latitude: {location.coords.latitude}, Longitude:{' '}
            {location.coords.longitude}
          </Text>
        ) : (
          <Text>Loading location...</Text>
        )}
      </View>
    );
  };

  export default GeoLocation;
  