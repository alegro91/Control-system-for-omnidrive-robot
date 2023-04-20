import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const isWeb = Platform.OS === "web";

const storage = {
  getItem: async (key) => {
    return isWeb ? localStorage.getItem(key) : AsyncStorage.getItem(key);
  },
  setItem: async (key, value) => {
    return isWeb
      ? localStorage.setItem(key, value)
      : AsyncStorage.setItem(key, value);
  },
  removeItem: async (key) => {
    return isWeb ? localStorage.removeItem(key) : AsyncStorage.removeItem(key);
  },
};

export default storage;
