import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import usePushNotification from "../hook/usePushNotifications";

import SalesInfo from "../components/SalesInfo";

import Back from "../components/Back";
import { get, onValue, ref } from "firebase/database";
import { db } from "../firebase";

const Sales = ({ navigation }) => {
  // usePushNotification();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try {
      const ordersRef = ref(db, "orders");

      const unsubscribe = onValue(ordersRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const keys = Object.keys(data);

          const arr = [];

          keys.forEach(async (key) => {
            const dt = data[key];
            let obj = {};

            if (dt.deliveryStatus == "delivered") {
              const userId = dt.userId;

              const userRef = ref(db, `users/${userId}`);
              const user = await get(userRef);

              if (user.exists()) {
                const userDt = user.val();

                obj = {
                  ...dt,
                  name: userDt.name,
                  contact: userDt.contact,
                  location: userDt.location,
                  orderId: key,
                };

                arr.push(obj);
              }

              const sorted = arr.sort((a, b) => {
                return new Date(a.orderDate) - new Date(b.orderDate);
              });

              setOrders(sorted);
            }
          });
        } else {
          setOrders([]);
        }
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.log(error);
      Alert.alert(error.message);
    }
  }, []);

  // Function to render each order
  const renderOrder = ({ item }) => {
    return <SalesInfo order={item} />;
  };

  return (
    <View style={styles.container}>
      <Back navigation={navigation} />
      <Text style={styles.title}>Sales</Text>

      {/* Render FlatList */}
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.orderId}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

export default Sales;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  flatListContent: {
    paddingHorizontal: 10,
    paddingBottom: 20, // Add padding bottom to improve spacing
  },
});
