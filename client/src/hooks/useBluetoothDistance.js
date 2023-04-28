import { useState, useEffect } from "react";

const useBluetoothDistance = () => {
  const [distance, setDistance] = useState(null);
  const [status, setStatus] = useState("disconnected");

  const connectBluetooth = async () => {
    setStatus("connecting");

    if (typeof navigator !== "undefined" && navigator.bluetooth) {
      const referenceRSSI = -59; // RSSI value measured at 1 meter
      const pathLossExponent = 2.5; // Varies between 2 and 4, depending on the environment

      try {
        const device = await navigator.bluetooth.requestDevice({
          filters: [
            {
              namePrefix: "Elias",
            },
          ],
          //optionalServices: ['your-service-uuid'],
        });

        device.addEventListener("advertisementreceived", (event) => {
          const currentRSSI = event.rssi;
          const estimatedDistance =
            10 ** ((referenceRSSI - currentRSSI) / (10 * pathLossExponent));
          console.log(
            `Device: ${device.name}, RSSI: ${currentRSSI}, Estimated distance: ${estimatedDistance} meters`
          );

          setDistance(estimatedDistance);
        });

        await device.watchAdvertisements();
        setStatus("connected");
      } catch (error) {
        console.error("Error:", error);
        setStatus("error");
      }
    }
  };

  const disconnectBluetooth = async () => {
    if (typeof navigator !== "undefined" && navigator.bluetooth) {
      try {
        const device = await navigator.bluetooth.getDevices();
        if (device.length > 0) {
          device[0].unwatchAdvertisements();
          device[0].gatt.disconnect();
          setDistance(null);
          setStatus("disconnected");
        }
      } catch (error) {
        console.error("Error:", error);
        setStatus("error");
      }
    }
  };

  useEffect(() => {
    // You no longer need to call connectBluetooth() here.
  }, []);

  return {
    distance,
    status,
    connect: connectBluetooth,
    disconnect: disconnectBluetooth,
  };
};

export default useBluetoothDistance;
