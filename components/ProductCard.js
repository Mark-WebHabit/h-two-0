import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import React, { useState } from "react";

const width = Dimensions.get("window").width;
const ProductCard = ({ product, selected, setSelected, unit }) => {
  return (
    <Pressable
      style={[
        styles.container,
        {
          borderColor: selected?.uid == product?.uid ? "red" : "dodgerblue",
        },
      ]}
      onPress={() => setSelected(product)}
    >
      <Image source={require("../assets/water.png")} style={styles.water} />

      <View style={styles.wrapper}>
        <View style={styles.productInfo}>
          <Text>
            {unit === "gallons"
              ? (parseFloat(product.volume) / 3.78541).toFixed(2) + " Gallons"
              : product.volume + " Liters"}
          </Text>
          <Text>₱{product.price}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  container: {
    width: width * 0.37,
    borderWidth: 2,
    height: width * 0.37,
    borderRadius: 10,
    position: "relative",
    overflow: "hidden",
    margin: 10,
  },

  water: {
    position: "absolute",
    resizeMode: "stretch",
    width: "80%",
    height: "80%",
    top: "10%",
    left: "10%",
    right: "10%",
    bottom: "10%",
  },

  wrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  productInfo: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
});
