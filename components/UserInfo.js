import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useGetUser } from "../hook/authListener";

const UserInfo = () => {
  const user = useGetUser();
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <View style={styles.wrapper}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{user?.name || "N/A"}</Text>
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.label}>No.:</Text>
          <Text style={styles.value}>{user?.contact || "N/A"}</Text>
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.label}>Loc.:</Text>
          <Text style={styles.value}>{user?.location || "N/A"}</Text>
        </View>
      </View>
      <View style={styles.logo}>
        <Image
          source={require("../assets/logoBig.png")}
          style={styles.logoImage}
        />
      </View>
    </View>
  );
};

export default UserInfo;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: 10,
    marginHorizontal: "2%",
    borderWidth: 2,
    borderColor: "dodgerblue",
    borderRadius: 10,
  },
  info: {
    flexBasis: "65%",
    padding: 10,
    justifyContent: "center",
  },
  logo: {
    flexBasis: "35%",
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  value: {
    width: "65%",
  },
  logoImage: {
    resizeMode: "contain",
    width: 120,
    height: 120,
  },
});
