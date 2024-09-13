import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { get, ref, update } from "firebase/database";
import { db } from "../firebase";
import { sendPushNotification } from "./sendPushNotification";

const OrderInfo = ({ order }) => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!order) {
      return;
    }

    const productRef = ref(db, `products/${order.productId}`);
    get(productRef).then((snapshot) => {
      if (snapshot.exists()) {
        const dt = snapshot.val();
        setProduct(dt);
      }
    });
  }, [order]);

  if (!order) {
    return null;
  }

  const updateDeliveryStatus = async (status) => {
    Alert.alert(
      "Confirmation",
      "Do you want to change the delivery status to: " + status + "?",
      [
        {
          text: "YES",
          onPress: async () => {
            try {
              const orderRef = ref(db, `orders/${order.orderId}`);
              await update(orderRef, { deliveryStatus: status });

              // Update status field in order object
              let newStatus;
              let notificationMessage;
              if (status === "delivered") {
                newStatus = {
                  status: "Order has been delivered",
                  timeStamp: new Date().toISOString(),
                };
                notificationMessage = "Your order has been delivered.";
              } else if (status === "out for pickup") {
                newStatus = {
                  status: "Your order is waiting to be picked up",
                  timeStamp: new Date().toISOString(),
                };
                notificationMessage = "Your order is ready for pickup.";
              } else if (status === "out for delivery") {
                newStatus = {
                  status: "Your order is on the way",
                  timeStamp: new Date().toISOString(),
                };
                notificationMessage = "Your order is out for delivery.";
              } else {
                newStatus = {
                  status: "Waiting for seller's response",
                  timeStamp: new Date().toISOString(),
                };
                notificationMessage = "Your order status has been updated.";
              }

              const newOrderStatus = [...order.status, newStatus];
              await update(orderRef, { status: newOrderStatus });

              const userRef = ref(db, `users/${order.userId}`);
              const snap = await get(userRef);

              if (snap.exists()) {
                const userData = snap.val();
                const expoPushToken = userData.expoPushToken;

                if (expoPushToken) {
                  await sendPushNotification(
                    expoPushToken,
                    "Order Update",
                    notificationMessage
                  );
                }
              }
            } catch (error) {
              console.error("Error updating delivery status:", error);
            }
          },
        },
        {
          text: "NO",
        },
      ]
    );
  };

  const getButtonColor = (status) => {
    return order.deliveryStatus === status ? "red" : "dodgerblue";
  };

  return (
    <View style={styles.orderCard}>
      <View style={styles.userInfo}>
        <View style={styles.infoRow}>
          <Icon name="user" size={16} color="dodgerblue" />
          <Text style={[styles.textInfo, styles.name]}>{order?.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="phone" size={16} color="dodgerblue" />
          <Text style={[styles.textInfo, styles.contact]}>
            {order?.contact}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="map-marker" size={16} color="dodgerblue" />
          <Text style={[styles.textInfo, styles.location]}>
            {order?.location}
          </Text>
        </View>
      </View>

      <View style={styles.orderInfo}>
        <View style={styles.imageWrapper}>
          <Image source={require("../assets/water.png")} style={styles.Image} />
        </View>
        <View style={styles.orderDetai}>
          <Text style={styles.textOrder}>{product?.volume} Liters</Text>
          <Text style={styles.textOrder}>Price: ₱{product?.price}</Text>
          <Text style={styles.textOrder}>{order?.quantity} &times;</Text>
          <Text style={styles.textOrder}>₱{order.total}.00</Text>
        </View>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: getButtonColor("out for pickup") },
          ]}
          onPress={() => updateDeliveryStatus("out for pickup")}
          disabled={order.deliveryStatus === "delivered"} // Disable button if status is delivered
        >
          <Text style={styles.buttonText}>Out for pickup</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: getButtonColor("out for delivery") },
          ]}
          onPress={() => updateDeliveryStatus("out for delivery")}
          disabled={order.deliveryStatus === "delivered"} // Disable button if status is delivered
        >
          <Text style={styles.buttonText}>Out for delivery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: getButtonColor("delivered") },
          ]}
          onPress={() => updateDeliveryStatus("delivered")}
          disabled={order.deliveryStatus === "delivered"} // Disable button if status is delivered
        >
          <Text style={styles.buttonText}>Delivered</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderInfo;

const styles = StyleSheet.create({
  orderCard: {
    borderWidth: 2,
    width: "90%",
    marginHorizontal: "auto",
    borderRadius: 10,
    padding: 10,
    borderColor: "dodgerblue",
    marginVertical: 10,
  },
  userInfo: {
    paddingHorizontal: "10%",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  textInfo: {
    fontSize: 16,
    marginLeft: 5,
  },
  name: {
    color: "dodgerblue",
    fontWeight: "bold",
  },
  orderInfo: {
    flexDirection: "row",
    paddingHorizontal: "5%",
    gap: 10,
  },
  imageWrapper: {
    borderWidth: 2,
    borderColor: "dodgerblue",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  Image: {
    resizeMode: "contain",
    width: 60,
    height: 60,
  },
  textOrder: {
    fontSize: 14,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  button: {
    width: "30%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 5,
    backgroundColor: "dodgerblue",
  },
  buttonText: {
    fontSize: 12,
    color: "white",
    fontWeight: "bold",
  },
});
