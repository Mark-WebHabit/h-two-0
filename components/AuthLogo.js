import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import React from "react";

const width = Dimensions.get("window").width;

const AuthLogo = ({ title }) => {
  return (
    <View style={styles.logoContainer}>
      <Image source={require("../assets/logoBig.png")} style={styles.logo} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default AuthLogo;

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
  },

  logo: {
    resizeMode: "contain",
    width: width * 0.35,
    height: width * 0.35,
  },

  title: {
    fontSize: 25,
    textAlign: "center",
    fontWeight: "700",
  },
});
