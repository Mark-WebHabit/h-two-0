import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { Picker } from "@react-native-picker/picker";
import { useGetUser, useNoUserNavigation } from "../hook/authListener";
import { db } from "../firebase";
import {
  equalTo,
  get,
  onValue,
  orderByChild,
  push,
  query,
  ref,
  set,
} from "firebase/database";

import HomeHeader from "../components/HomeHeader";
import UserInfo from "../components/UserInfo";
import ProductCard from "../components/ProductCard";
import ErrorModal from "../components/ErrorModal";
import SuccessModal from "../components/SuccessModal";

//
import { sendPushNotification } from "../components/sendPushNotification";

const Home = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [success, setSuccess] = useState(null);

  const user = useGetUser();

  useNoUserNavigation();

  useEffect(() => {
    const productsRef = ref(db, "products");
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedProducts = Object.keys(data).map((key) => ({
          uid: key,
          ...data[key],
        }));
        setProducts(formattedProducts);
      } else {
        setProducts([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const closeSelectedFunction = () => setSelectedProduct(null);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const subtotal = selectedProduct ? selectedProduct.price * quantity : 0;

  const handleAddOrder = async () => {
    if (!user?.name || !user?.contact || !user?.location) {
      Alert.alert(
        "Account Setup",
        "It seems that you aren't done setting up your information",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Setting"),
          },
          {
            text: "Cancel",
          },
        ]
      );

      return;
    }

    try {
      const date = new Date().toISOString();
      const obj = {
        productId: selectedProduct.uid,
        quantity: quantity,
        total: subtotal,
        userId: user.uid,
        orderDate: date,
        deliveryStatus: "pending",
        status: [
          {
            timeStamp: date,
            status: "Waiting for seller's response",
          },
        ],
      };

      const ordersRef = push(ref(db, "orders"));
      await set(ordersRef, obj);

      const orderUid = ordersRef.key; // Get the UID of the created order

      const notificationsRef = push(ref(db, "notifications"));
      await set(notificationsRef, {
        dateTime: date,
        body: `You have a new order from ${user.name}`,
        productId: selectedProduct.uid,
        notified: false,
        orderId: orderUid, // Include the order UID in the notification
      });

      const selleresRef = ref(db, "users");
      const sellersQuery = query(
        selleresRef,
        orderByChild("role"),
        equalTo("seller")
      );
      const snapshot = await get(sellersQuery);

      if (snapshot.exists()) {
        const dt = snapshot.val();
        const keys = Object.keys(dt);

        keys.forEach((key) => {
          const seller = dt[key];

          if (seller?.expoPushToken) {
            sendPushNotification(
              seller.expoPushToken,
              "New Order",
              "You have new order from " + user?.name
            );
          }
        });
      }

      setSuccess("Order Placed");
      setQuantity(1);
      setSelectedProduct(null);
    } catch (error) {
      console.log(error);
      setErrorMessage(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <HomeHeader navigation={navigation} />
      {headerVisible && <UserInfo />}
      <View style={styles.picker}>
        <Picker
          selectedValue={selectedUnit}
          onValueChange={(itemValue) => setSelectedUnit(itemValue)}
        >
          <Picker.Item label="Liters" value={"liters"} />
          <Picker.Item label="Gallons" value={"gallons"} />
        </Picker>
      </View>
      <FlatList
        contentContainerStyle={styles.productList}
        data={products}
        keyExtractor={(item) => item?.uid}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            selected={selectedProduct}
            setSelected={setSelectedProduct}
            unit={selectedUnit}
          />
        )}
        numColumns={2}
      />
      {selectedProduct && (
        <View style={styles.selectedProduct}>
          <Pressable onPress={() => closeSelectedFunction()}>
            <Icon
              name="times"
              size={30}
              color={"red"}
              style={styles.closeSelected}
            />
          </Pressable>
          <View style={styles.selectedInfo}>
            <Text style={styles.volume}>
              {selectedUnit === "gallons"
                ? (parseFloat(selectedProduct.volume) / 3.78541).toFixed(2) +
                  " Gallons"
                : selectedProduct.volume + " Liters"}
            </Text>
            <Text style={styles.price}>Price: ₱{selectedProduct.price}</Text>
            <Text style={styles.subtotal}>Subtotal: ₱{subtotal}</Text>
          </View>
          <View style={styles.selectedButton}>
            <TouchableOpacity
              onPress={decrementQuantity}
              style={styles.quantityButton}
            >
              <Icon name="minus" size={30} color="red" />
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity
              onPress={incrementQuantity}
              style={styles.quantityButton}
            >
              <Icon name="plus" size={30} color="green" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmOrder}
              onPress={handleAddOrder}
            >
              <Text style={styles.confirm}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setHeaderVisible(!headerVisible)}
      >
        <Icon
          name={headerVisible ? "chevron-up" : "chevron-down"}
          size={10}
          color="white"
        />
      </TouchableOpacity>

      <ErrorModal
        visible={errorMessage !== null}
        message={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
      <SuccessModal
        visible={success !== null}
        message={success}
        onClose={() => setSuccess(null)}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  productList: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 100, // To ensure the bottom component doesn't overlap the list
  },

  floatingButton: {
    position: "absolute",
    top: 30, // Adjust the top position to your desired value
    right: 5,
    backgroundColor: "dodgerblue",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  floatingButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  picker: {
    width: "50%",
    borderBottomColor: "dodgerblue",
    borderBottomWidth: 2,
    marginLeft: 10,
  },
  selectedProduct: {
    flexDirection: "row",
    padding: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "dodgerblue",
    position: "relative",
  },
  selectedInfo: {
    width: "50%",
    alignItems: "flex-end",
  },
  volume: {
    fontSize: 18,
  },
  selectedButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  quantityButton: {
    marginHorizontal: 10,
  },
  quantity: {
    color: "dodgerblue",
    fontSize: 18,
    marginHorizontal: 5,
  },
  subtotal: {
    fontSize: 18,
    color: "red",
  },
  confirmOrder: {
    width: "100%",
    alignItems: "center",
  },
  confirm: {
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: "dodgerblue",
    color: "white",
  },
  closeSelected: {
    position: "absolute",
    top: 0 - 60,
    left: -10,
  },
});
