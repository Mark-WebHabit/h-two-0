import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useGetUser, useNoUserNavigation } from "../hook/authListener";
import { Dimensions } from "react-native";
import Back from "../components/Back";
import { equalTo, onValue, orderByChild, query, ref } from "firebase/database";
import { db } from "../firebase";

import ErrorModal from "../components/ErrorModal";
import RenderOrder from "../components/RenderOrder";

const Orders = ({ navigation }) => {
  // useNoUserNavigation();
  const user = useGetUser();
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    async function fetchProducts() {
      const ordersRef = ref(db, "orders");
      const ordersQuery = query(
        ordersRef,
        orderByChild("userId"),
        equalTo(user?.uid)
      );

      const unsubscribe = onValue(ordersQuery, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const keys = Object.keys(data);

          const arr = [];

          keys.forEach((key) => {
            let obj = data[key];
            obj = { ...obj, orderId: key };

            arr.push(obj);
          });

          if (arr.length > 0) {
            const sorted = arr.sort((a, b) => {
              return new Date(b.orderDate) - new Date(a.orderDate);
            });
            setOrders(sorted);
          } else {
            setOrders(arr);
          }
        } else {
          setOrders([]);
        }
      });

      return () => unsubscribe();
    }

    fetchProducts();
  }, [user]);

  return (
    <View style={styles.container}>
      <Back navigation={navigation} />
      <Text style={styles.title}>My Orders</Text>
      {orders.length > 0 && (
        <FlatList
          data={orders}
          renderItem={({ item }) => <RenderOrder item={item} />}
          keyExtractor={(item) => item.orderId}
          contentContainerStyle={styles.ordersList}
        />
      )}
      <ErrorModal
        visible={errorMessage !== null}
        message={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
    </View>
  );
};

export default Orders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
  },

  title: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 20,
  },

  ordersList: {
    paddingBottom: 20, // Optional: adjust padding to prevent overlap with other elements
  },
});
