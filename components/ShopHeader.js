import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

const ShopHeader = () => {
  return (
    <View style={styles.logoWrapper}>
      <Text style={styles.greet}>Welcome back!</Text>
      <Image source={require("../assets/logoBig.png")} style={styles.logo} />
    </View>
  );
};

export default ShopHeader;

const styles = StyleSheet.create({
  logoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginBottom: 10,
  },

  greet: {
    fontSize: 15,
    fontWeight: "bold",
  },

  logo: {
    resizeMode: "contain",
    width: 50,
    height: 50,
  },
});
