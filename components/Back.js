import { Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

const Back = ({ navigation }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.goBack()}
      hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} // Add hitSlop to increase touch area
    >
      <Image source={require("../assets/left.png")} style={styles.image} />
    </TouchableOpacity>
  );
};

export default Back;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 10,
    padding: 10, // Increase padding to increase touch area
  },
  image: {
    resizeMode: "contain",
    width: 35,
    height: 35,
  },
});
