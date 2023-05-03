import { BleManager } from "react-native-ble-plx";

//Class for handeling proximity detection of Bluetooth devices
class ProximityDetectorBT {
  ProximityDetector = new BleManager();

  //*
  //name - the name of the Bluetooth device being searched for.
  //*
  scanForDevice(name) {
    // Scan for nearby Bluetooth LE devices
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        return;
      }

      // Check if the device is the one you're looking for
      if (device.name === name) {
        // Get RSSI value
        device.readRSSI().then((rssi) => {
          console.log(`RSSI for ${device.name}: ${rssi}`);
        });
      }
    });
  }

  //Test function to ensure the import worked as intended without having to think about the rest of the logic for now.
  addNumbers(num1, num2) {
    return num1 + num2;
  }
}

export default ProximityDetectorBT;
