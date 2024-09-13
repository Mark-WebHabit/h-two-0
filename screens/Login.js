import {
  Dimensions,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState, useContext } from "react";

// compoentn
import AuthLogo from "../components/AuthLogo";
import TExtField from "../components/TextField";
import Button from "../components/Button";
import Link from "../components/Link";

import ErrorModal from "../components/ErrorModal";
import SuccessModal from "../components/SuccessModal";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { get, ref, update } from "firebase/database";
import { useRoleBasedNavigation } from "../hook/authListener";
import { MyContext } from "../hook/Context";

const Login = ({ navigation }) => {
  useRoleBasedNavigation();
  const { expoPushToken } = useContext(MyContext);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleCloseErrorModal = () => setError(null);
  const handleCloseSuccessModal = () => setSuccess(null);

  const handleChange = (text, name) => {
    setData({ ...data, [name]: text });
  };

  const handleSubmit = async () => {
    const { email, password } = data;

    if (!email || !password) {
      setError("All fields required");
      return;
    }

    try {
      const user = await signInWithEmailAndPassword(auth, email, password);

      if (user.user) {
        const userRef = ref(db, `users/${user.user.uid}`);

        const logUser = await get(userRef);

        if (!logUser.exists()) {
          setError("Invalid Account");
          return;
        }

        await update(userRef, {
          expoPushToken,
        });

        const fetchedUser = logUser.val();

        const role = fetchedUser.role;
        setData({
          email: "",
          password: "",
        });
        if (role == "seller") {
          navigation.navigate("Store");
        } else {
          navigation.navigate("Home");
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <AuthLogo title={"Login"} />

      <TExtField
        placeholder={"Email"}
        icon={"email"}
        name={"email"}
        value={data.email}
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
      <Button text={"SIGN IN"} onClick={handleSubmit} />
      <Link
        text={"Create an account"}
        navigation={navigation}
        path={"Register"}
      />
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

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
