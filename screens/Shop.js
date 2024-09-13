import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Modal,
  TouchableOpacity,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  ref,
  onValue,
  push,
  set,
  update,
  query,
  orderByChild,
  equalTo,
  get,
  remove,
} from "firebase/database";
import { db } from "../firebase.js";

import Back from "../components/Back";
import ShopHeader from "../components/ShopHeader";
import Card from "../components/Card";
import ErrorModal from "../components/ErrorModal.js";
import SuccessModal from "../components/SuccessModal.js";
import EditProductModal from "../components/EditProductModal.js";
import { useNoUserNavigation } from "../hook/authListener.js";

const Shop = ({ navigation }) => {
  useNoUserNavigation();
  // usePushNotification();

  const [unit, setUnit] = useState("liters");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newProduct, setNewProduct] = useState({
    volume: "",
    price: "",
    description: "",
  });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const checkExistingOrders = async (productId) => {
    const orderRef = ref(db, `orders`);
    const orderQeury = query(
      orderRef,
      orderByChild("productId"),
      equalTo(productId)
    );

    let hasOrders;
    const snapshot = await get(orderQeury);

    if (snapshot.exists()) {
      hasOrders = true;
    } else {
      hasOrders = false;
    }

    return hasOrders;
  };

  const handleEditProduct = async (product) => {
    const hasOrders = await checkExistingOrders(product.uid);
    if (hasOrders) {
      Alert.alert(
        "Edit Not Allowed",
        "This product has existing orders and cannot be edited.",
        [{ text: "OK" }]
      );
    } else {
      setSelectedProduct(product);
      setEditModalVisible(true);
    }
  };

  const handleSaveEditedProduct = async (editedProduct) => {
    const { description, price, unit, volume, uid } = editedProduct;

    try {
      let vol = parseInt(volume);
      if (unit === "gallons") {
        vol = volume * 3.78541;
      }

      vol = parseFloat(vol.toFixed(2));

      const productRef = ref(db, `products/${uid}`);

      await update(productRef, {
        description,
        price,
        volume: vol,
      });

      setSuccess("Product Updated");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const fetchProducts = () => {
    const productsRef = ref(db, "products");

    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const keys = Object.keys(data);

        const arr = keys.map((key) => ({
          ...data[key],
          uid: key,
        }));

        setProducts(arr);
        setFilteredProducts(arr);
      } else {
        setProducts([]);
        setFilteredProducts([]);
      }
    });
  };

  useEffect(() => {
    if (!search) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product?.description?.toLowerCase().includes(search?.toLowerCase()) ||
          product.volume
            ?.toString()
            ?.toLowerCase()
            .includes(search?.toLowerCase()) ||
          product?.price?.toString()?.includes(search?.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [search, products]);

  const handleAddProduct = async () => {
    try {
      const { volume, price, description } = newProduct;

      if (!volume || !price) {
        setErrorMessage("All fields required");
        return;
      }

      let vol = parseFloat(volume);
      if (unit === "gallons") {
        // Convert gallons to liters
        vol *= 3.78541;
      }

      vol = parseFloat(vol.toFixed(2)); // Limit to 2 decimal places

      const newProductData = {
        description,
        price,
        volume: vol,
      };

      const newProductRef = push(ref(db, "products"));
      await set(newProductRef, newProductData);

      setModalVisible(false);
      setNewProduct({ volume: "", price: "", description: "" });
      setSuccess("Product added");
    } catch (error) {
      setErrorMessage(error.message);
      console.error("Error adding product:", error.message);
    }
  };

  const handleDelete = (productId) => {
    console.log(productId);
    Alert.alert(
      "Confirm To Delete Product",
      "NOTE: This will delete all relevant data of this product including order history and sales",
      [
        {
          text: "Confirm",
          onPress: async () => {
            try {
              // Delete product from products node
              const productRef = ref(db, `products/${productId}`);
              await remove(productRef);

              // Fetch all orders to find and delete relevant ones
              const ordersRef = ref(db, "orders");
              const snapshot = await get(ordersRef);

              if (snapshot.exists()) {
                const orders = snapshot.val();

                // Identify and delete orders related to the product
                for (const orderId in orders) {
                  if (orders[orderId].productId === productId) {
                    const orderRef = ref(db, `orders/${orderId}`);
                    await remove(orderRef);
                  }
                }

                console.log("Product and related orders deleted successfully");
              }
            } catch (error) {
              console.error(
                "Error deleting product and related orders:",
                error
              );
            }
          },
        },
        {
          text: "Cancel",
        },
      ]
    );
  };

  const handleCloseErrorModal = () => {
    setErrorMessage(null);
  };

  const handleCloseSuccessModal = () => {
    setSuccess(null);
  };

  const renderProduct = ({ item }) => (
    <Card
      item={item}
      unit={unit}
      onEdit={handleEditProduct}
      onDelete={handleDelete}
    />
  );

  return (
    <View style={styles.container}>
      <Back navigation={navigation} />
      <ShopHeader />

      <Text style={styles.title}>Products</Text>

      <View style={styles.filterContainer}>
        <TextInput
          placeholder="Search product..."
          style={styles.search}
          value={search}
          onChangeText={(text) => setSearch(text)}
        />
        <View style={styles.filter}>
          <Picker
            selectedValue={unit}
            onValueChange={(value) => setUnit(value)}
            style={styles.pickerUnit}
          >
            <Picker.Item label="Liters" value="liters" />
            <Picker.Item label="Gallons" value="gallons" />
          </Picker>
        </View>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.productList}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add Product</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Product</Text>
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={newProduct.description}
              maxLength={30}
              onChangeText={(text) =>
                setNewProduct({ ...newProduct, description: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              keyboardType="numeric"
              value={newProduct.price}
              onChangeText={(text) =>
                setNewProduct({ ...newProduct, price: text })
              }
            />
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.inputVolume]}
                placeholder="Volume"
                keyboardType="numeric"
                value={newProduct.volume}
                onChangeText={(text) =>
                  setNewProduct({ ...newProduct, volume: text })
                }
              />
              <Picker
                selectedValue={unit}
                style={styles.picker}
                onValueChange={(value) => setUnit(value)}
              >
                <Picker.Item label="Liters" value="liters" />
                <Picker.Item label="Gallons" value="gallons" />
              </Picker>
            </View>
            <TouchableOpacity
              style={styles.addProductButton}
              onPress={handleAddProduct}
            >
              <Text style={styles.addProductButtonText}>Add Product</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ErrorModal
        visible={errorMessage !== null}
        message={errorMessage}
        onClose={handleCloseErrorModal}
      />
      <SuccessModal
        visible={success !== null}
        message={success}
        onClose={handleCloseSuccessModal}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
      >
        <EditProductModal
          visible={editModalVisible}
          product={selectedProduct}
          onClose={() => setEditModalVisible(false)}
          onSave={handleSaveEditedProduct}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    color: "dodgerblue",
    fontWeight: "bold",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginBottom: 10,
  },
  search: {
    flex: 1,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: "dodgerblue",
    marginRight: 10,
    paddingHorizontal: 10,
  },
  filter: {
    width: "40%",
    borderBottomWidth: 1,
    borderBottomColor: "dodgerblue",
  },
  pickerUnit: {
    width: "100%",
    color: "dodgerblue",
  },
  productList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  addButton: {
    backgroundColor: "dodgerblue",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "dodgerblue",
  },
  input: {
    height: 40,
    borderColor: "dodgerblue",
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputVolume: {
    flex: 1,
    marginRight: 10,
  },
  picker: {
    width: 120,
    height: 40,
    borderColor: "dodgerblue",
    borderBottomWidth: 1,
  },
  addProductButton: {
    backgroundColor: "dodgerblue",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  addProductButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "tomato",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Shop;
