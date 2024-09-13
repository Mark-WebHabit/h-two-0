import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const EditProductModal = ({ visible, product, onClose, onSave }) => {
  const [editedProduct, setEditedProduct] = useState(null);
  // Update the edited product when the product prop changes
  useEffect(() => {
    setEditedProduct({ ...product, unit: "liters" });
  }, [product]);

  // Function to handle input changes
  const handleInputChange = (field, value) => {
    setEditedProduct({ ...editedProduct, [field]: value });
  };

  // Function to handle saving changes
  const handleSaveChanges = () => {
    onSave(editedProduct);
    onClose();
  };

  if (!editedProduct) {
    return null;
  }

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Product</Text>
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={editedProduct.description}
            maxLength={30}
            onChangeText={(text) => handleInputChange("description", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            keyboardType="numeric"
            value={editedProduct?.price?.toString()}
            onChangeText={(text) => handleInputChange("price", text)}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.inputVolume]}
              placeholder="Volume"
              keyboardType="numeric"
              value={editedProduct?.volume?.toString()}
              onChangeText={(text) => handleInputChange("volume", text)}
            />
            <Picker
              selectedValue={editedProduct.unit}
              style={styles.picker}
              onValueChange={(value) => handleInputChange("unit", value)}
            >
              <Picker.Item label="Liters" value="liters" />
              <Picker.Item label="Gallons" value="gallons" />
            </Picker>
          </View>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveChanges}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  inputVolume: {
    flex: 1,
    marginRight: 10,
  },
  picker: {
    width: 120,
    height: 40,
    borderColor: "#ccc",
    borderBottomWidth: 1,
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default EditProductModal;
