import { StyleSheet, TextInput, View } from "react-native";
import React from "react";

import Icon from "react-native-vector-icons/MaterialIcons";

const TExtField = ({
  icon,
  placeholder,
  secure = false,
  name,
  onChange,
  value,
}) => {
  return (
    <View style={styles.textInput}>
      <Icon name={icon} size={30} color={"dodgerblue"} />
      <TextInput
        placeholder={placeholder}
        style={styles.input}
        secureTextEntry={secure}
        value={value}
        onChangeText={(text) => onChange(text, name)}
      />
    </View>
  );
};

export default TExtField;

const styles = StyleSheet.create({
  textInput: {
    marginVertical: 15,
    flexDirection: "row",
    width: "60%",
    gap: 10,
    borderBottomWidth: 2,
    borderColor: "dodgerblue",
  },

  input: {
    padding: 0,
    margin: 0,
    width: "80%",
  },
});
