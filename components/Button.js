import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";

const Button = ({ text, onClick }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onClick}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    width: "60%",
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: "dodgerblue",
    marginVertical: 15,
  },
  text: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
  },
});
