import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";

const Link = ({ navigation, text, path }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate(path)}
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Link;

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    marginVertical: 10,
  },
});
