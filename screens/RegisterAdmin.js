import { useState } from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import React from "react";

// compoentn
import AuthLogo from "../components/AuthLogo";
import TExtField from "../components/TextField";
import Button from "../components/Button";
import Link from "../components/Link";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { ref, query, orderByChild, equalTo, set, get } from "firebase/database";
import { auth, db } from "../firebase";
import ErrorModal from "../components/ErrorModal";
import SuccessModal from "../components/SuccessModal";
import { useRoleBasedNavigation } from "../hook/authListener";

const PINCODE = "102030";

const RegisterAdmin = ({ navigation }) => {
  useRoleBasedNavigation();
  const [data, setData] = useState({
    email: "",
    password: "",
    confirm: "",
    pincode: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (text, name) => {
    setData({ ...data, [name]: text });
  };

  const handleCloseErrorModal = () => setError(null);
  const handleCloseSuccessModal = () => setSuccess(null);

  const handleSubmit = async () => {
    const { email, password, confirm, pincode } = data;

    if (!email || !password || !confirm || !pincode) {
      setError("All fields are required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return;
    }

    if (pincode !== PINCODE) {
      setError("Invalid System Pincode");
      return;
    }

    // Password length check
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const usersRef = ref(db, "users");
      const userQuery = query(usersRef, orderByChild("email"), equalTo(email));
      const snapshot = await get(userQuery);

      if (snapshot.exists()) {
        setError("Email Taken, Please Use Another Email");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user) {
        const userRef = ref(db, `users/${user.uid}`);
        await set(userRef, { email, password, role: "seller" });
        await signOut(auth);
        setSuccess("Account created");
        setData({ email: "", password: "", confirm: "", pincode: "" });
        navigation.navigate("Login");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <AuthLogo title={"Register As Seller"} />

      <TExtField
        placeholder={"Email"}
        icon={"email"}
        name={"email"}
        value={data.email}
        onChange={handleChange}
      />

      <TExtField
        placeholder={"Secret Pin"}
        icon={"lock"}
        secure={true}
        name={"pincode"}
        value={data.pincode}
        onChange={handleChange}
      />
      <TExtField
        placeholder={"Password"}
        icon={"password"}
        secure={true}
        name={"password"}
        value={data.password}
        onChange={handleChange}
      />
      <TExtField
        placeholder={"Confirm Password"}
        icon={"password"}
        secure={true}
        name={"confirm"}
        value={data.confirm}
        onChange={handleChange}
      />

      <Button text={"REGISTER"} onClick={handleSubmit} />
      <Link
        text={"Already have an account"}
        navigation={navigation}
        path={"Login"}
      />
      <Link text={"I'm a customer"} navigation={navigation} path={"Register"} />

      <ErrorModal
        visible={error !== null}
        message={error}
        onClose={handleCloseErrorModal}
      />
      <SuccessModal
        visible={success !== null}
        message={success}
        onClose={handleCloseSuccessModal}
      />
    </View>
  );
};

export default RegisterAdmin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
