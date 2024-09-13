// Context.js
import { StyleSheet, View } from "react-native";
import React, { createContext } from "react";
import usePushNotifications from "./usePushNotifications";

const MyContext = createContext(null);

const ContextProvider = ({ children }) => {
  const { expoPushToken, notification } = usePushNotifications();

  return (
    <MyContext.Provider value={{ expoPushToken, notification }}>
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, ContextProvider };

const styles = StyleSheet.create({});
