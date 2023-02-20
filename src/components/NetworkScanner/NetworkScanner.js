import { useEffect, useState } from "react";
import { View } from "react-native";

const NetworkScanner = ({ navigation }) => {
  const [devices, setDevices] = useState([]);
  return (
    <>
      {devices.length > 0 && (
        <View>
          {devices.map((device, index) => (
            <Text key={index}>
              {device.address}:{device.port}
            </Text>
          ))}
        </View>
      )}
    </>
  );
};

export default NetworkScanner;
