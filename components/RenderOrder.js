import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React from "react";
import useFetchProduct from "../hook/useFetchProduct";

const width = Dimensions.get("window").width;
import { formatDate } from "../utilities/date";
import { ref, remove } from "firebase/database";
import { db } from "../firebase";

const RenderOrder = ({ item }) => {
  const { product, loading, error } = useFetchProduct(item.productId);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  if (!product) {
    return <Text>Product not found</Text>;
  }

  const handleCancel = async () => {
    const ordersRef = ref(db, `orders/${item.orderId}`);
    await remove(ordersRef);
  };

  return (
    <View style={styles.orderWrapper}>
      <View style={styles.currentOrder}>
        <View style={styles.orderCard}>
          <View style={styles.imageWrapper}>
            <Image
              source={require("../assets/water.png")}
              style={styles.image}
            />
          </View>
          <View style={styles.orderInfo}>
            <Text style={styles.orderVolume}>{product.volume} Liters</Text>
            <Text style={styles.orderPrice}>₱{product.price}</Text>
            <Text style={styles.orderQuantity}>Quantity: {item.quantity}</Text>
            <Text style={styles.orderSubtotal}>₱{item.total}</Text>
          </View>

          {item.status?.length == 1 && (
            <TouchableOpacity style={styles.cancel} onPress={handleCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Text style={styles.orderMop}>Cash On Delivery</Text>

      <View style={styles.statuses}>
        {item?.status
          .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp))
          .map((stat, i) => (
            <View style={styles.status} key={i}>
              <Text style={styles.stamp}>
                {formatDate(new Date(stat.timeStamp))}
              </Text>
              <Text style={styles.statusText}>{stat.status}</Text>
            </View>
          ))}
      </View>
    </View>
  );
};

export default RenderOrder;

const styles = StyleSheet.create({
  orderWrapper: {
    marginVertical: 10,
    marginBottom: 50,
  },
  currentOrder: {
    borderWidth: 2,
    borderColor: "dodgerblue",
    borderRadius: 10,
    padding: 10,
    width: "92%",
    marginHorizontal: "auto",
  },
  orderCard: {
    flexDirection: "row",
    gap: 10,
    position: "relative",
  },
  imageWrapper: {
    borderWidth: 1,
    padding: 10,
    borderWidth: 2,
    borderColor: "dodgerblue",
    borderRadius: 10,
  },
  image: {
    resizeMode: "contain",
    width: width * 0.25,
    height: width * 0.25,
  },
  orderInfo: {
    flex: 1,
  },
  orderVolume: {
    fontSize: 18,
    color: "red",
  },
  orderMop: {
    textAlign: "center",
    fontSize: 18,
    marginVertical: 10,
    color: "red",
  },
  statuses: {
    paddingHorizontal: "5%",
  },
  status: {
    marginVertical: 5,
    borderBottomWidth: 2,
    paddingBottom: 10,
    borderColor: "#b3e0ff",
  },
  stamp: {
    fontSize: 12,
    color: "#999999",
  },

  cancel: {
    position: "absolute",
    top: 0,
    right: 0,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "red",
  },
  cancelText: {
    color: "white",
  },
});
