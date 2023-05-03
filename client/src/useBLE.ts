/* eslint-disable no-bitwise */

import {useMemo, useState} from "react";
import { PermissionsAndroid, Platform } from "react-native";
import {BleManager, Device} from "react-native-ble-plx";

import * as ExpoDevice from "expo-device";

interface BluetoothLowEnergyAPI {
    requestPermissions(): Promise<boolean>;
    scanForDevices(): void  
}

function useBLE(): BluetoothLowEnergyAPI {
    const bleManager = useMemo(() => new BleManager(), []);

    const [allDevices, setAllDevices] = useState<Device[]>([]);

    //Android permissions required for API 31 and above
    const requestAndroid31Permissions = async () => {
        const bluetoothScanPermissions = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            {
                title: "Scan Permission",
                message: "This app needs permission for Bluetooth scanning.",
                buttonPositive: "OK",
            }
        );
        const bluetoothConnectPermissions = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            {
                title: "Connect Permission",
                message: "This app needs permission for Bluetooth connection.",
                buttonPositive: "OK",
            }
        );
        const bluetoothFineLocationPermissions = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_ACCESS_FINE_LOCATION,
            {
                title: "Fine Location Permission",
                message: "This app needs permission for Bluetooth Fine Grain location.",
                buttonPositive: "OK",
            }
        );

        return (
            bluetoothScanPermissions === "granted" &&
            bluetoothConnectPermissions === "granted" &&
            bluetoothFineLocationPermissions === "granted"
        );
    };

    const requestPermissions = async () => {
        if(Platform.OS === "android") {
            if((ExpoDevice.platformApiLevel ?? -1) < 31) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_ACCESS_FINE_LOCATION,
                    {
                        title: "Location Permission",
                        message: "Bluetooth requires Location.",
                        buttonPositive: "OK",
                    }
                )
                return  granted === PermissionsAndroid.RESULTS.GRANTED;
            } else {
                const isAndroid31PermissionsGranted = await requestAndroid31Permissions();
                return isAndroid31PermissionsGranted;
            }
        } else {
            //If platform is NOT android (presumably iOS).
            return true;
        }
    }

    const scanForDevices = () => {


    }

    
    return {
        scanForDevices,
        requestPermissions,
    }
}

export default useBLE;