import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { useNoUserNavigation } from "../hook/authListener";
import usePushNotifications from "../hook/usePushNotifications";
import { TouchableOpacity } from "react-native-gesture-handler";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Store = ({ navigation }) => {
  useNoUserNavigation();
  // usePushNotifications();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.wrapper}
        onPress={() => navigation.navigate("Shop")}
      >
        <Image source={require("../assets/store.png")} style={styles.image} />
        <Text style={styles.text}>My Shop</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.wrapper}
        onPress={() => navigation.navigate("OrderList")}
      >
        <Image source={require("../assets/orders.png")} style={styles.image} />
        <Text style={styles.text}>Orders</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.wrapper}
        onPress={() => navigation.navigate("Sales")}
      >
        <Image source={require("../assets/sales.png")} style={styles.image} />
        <Text style={styles.text}>Sales</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.wrapper}
        onPress={() => navigation.navigate("Setting")}
      >
        <Image
          source={require("../assets/settings.png")}
          style={styles.image}
        />
        <Text style={styles.text}>Setting</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.wrapper}
        onPress={async () => {
          await signOut(auth);
        }}
      >
        <Image source={require("../assets/logout.png")} style={styles.image} />
        <Text style={styles.text}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Store;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
    justifyContent: "center",
    paddingHorizontal: "10%",
  },
  wrapper: {
    padding: 20,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "dodgerblue",
    gap: 10,
    paddingHorizontal: "15%",
    marginVertical: 10,
  },

  image: {
    resizeMode: "contain",
    width: 50,
    height: 50,
  },

  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "dodgerblue",
  },
});
