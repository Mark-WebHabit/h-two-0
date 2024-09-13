import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const HomeHeader = ({ navigation }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.navigate("Setting")}>
        <Image
          source={require("../assets/settings.png")}
          style={styles.setting}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Orders")}>
        <Text style={styles.orders}>My Orders</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={async () => await signOut(auth)}>
        <Text style={styles.orders}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "7%",
  },

  setting: {
    resizeMode: "center",
    height: 30,
    width: 30,
  },
  orders: {
    fontSize: 16,
    color: "dodgerblue",
  },
});
