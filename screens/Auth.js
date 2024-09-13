import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRoleBasedNavigation } from "../hook/authListener";

const Auth = ({ navigation }) => {
  useRoleBasedNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.Text}>Sign In As</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AdminRegister")}
      >
        <Text style={styles.role}>Seller</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.role}>Customer</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Auth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  Text: {
    fontSize: 20,
    fontWeight: "700",
  },

  button: {
    flexDirection: "row",
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: "dodgerblue",
  },

  role: {
    fontSize: 25,
    textTransform: "uppercase",
    color: "white",
  },
});
