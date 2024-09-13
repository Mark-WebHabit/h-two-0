// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth"; // Updated import
import { getDatabase } from "firebase/database";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyApx3R7MWTUKxtvx1vCOe7M81LjsAZkXmE",
	authDomain: "ezpay-94408.firebaseapp.com",
	databaseURL: "https://ezpay-94408-default-rtdb.firebaseio.com",
	projectId: "ezpay-94408",
	storageBucket: "ezpay-94408.appspot.com",
	messagingSenderId: "515373396121",
	appId: "1:515373396121:web:ae786570179c5cf2938808",
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// Initialize Firebase Auth with AsyncStorage
export const authInstance = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const auth = getAuth(app);
