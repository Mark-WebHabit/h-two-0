import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Back from "./Back";
import { useGetUser, useNoUserNavigation } from "../hook/authListener";
import { ref, update } from "firebase/database";
import { db } from "../firebase";

const PersonalSetting = ({ navigation }) => {
  useNoUserNavigation();
  const [name, setName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [address, setAddress] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  const user = useGetUser();

  useEffect(() => {
    setName(user?.name || "");
    setContactNo(user?.contact || "");
    setAddress(user?.location || "");
  }, [user]);

  const handleToggleEdit = () => {
    setIsEditable(!isEditable);
  };

  const handleSubmit = async () => {
    if (!user) {
      return;
    }

    const userRef = ref(db, `users/${user?.uid}`);

    try {
      await update(userRef, {
        name: name,
        contact: contactNo,
        location: address,
      });

      Alert.alert("Personal Info Updated");
      setIsEditable(false);
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Back navigation={navigation} />
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={[styles.input, !isEditable && styles.disabledInput]}
            value={name}
            onChangeText={setName}
            editable={isEditable}
            placeholder="Enter your name"
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contact No</Text>
          <TextInput
            style={[styles.input, !isEditable && styles.disabledInput]}
            value={contactNo}
            onChangeText={setContactNo}
            editable={isEditable}
            placeholder="Enter your contact number"
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, !isEditable && styles.disabledInput]}
            value={address}
            onChangeText={setAddress}
            editable={isEditable}
            placeholder="Enter your address"
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={handleToggleEdit}
        >
          <Icon
            name={isEditable ? "unlock" : "lock"}
            size={20}
            color="white"
            style={styles.toggleIcon}
          />
          <Text style={styles.toggleButtonText}>
            {isEditable ? "Disable Editing" : "Enable Editing"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 20,
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "white",
    color: "#333",
  },
  disabledInput: {
    backgroundColor: "#f9f9f9",
    color: "#999",
  },
  submitButton: {
    backgroundColor: "green",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  toggleButton: {
    backgroundColor: "dodgerblue",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  toggleButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 5,
  },
  toggleIcon: {
    marginRight: 5,
  },
});

export default PersonalSetting;
