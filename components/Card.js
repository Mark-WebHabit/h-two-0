import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

// Conversion functions
const litersToGallons = (liters) => {
  return liters * 0.264172;
};

const gallonsToLiters = (gallons) => {
  return gallons * 3.78541;
};

const Card = ({ item, unit, onEdit, onDelete }) => {
  const { volume, price, description } = item;

  // Convert volume based on selected unit
  const convertedVolume =
    unit === "liters" ? volume : litersToGallons(volume).toFixed(2);

  const handleEdit = () => {
    onEdit(item); // Pass the clicked item data to the parent component for editing
  };

  const handleDelete = () => {
    onDelete(item.uid);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Icon name="local-drink" size={40} color="#0D98BA" />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>
            {convertedVolume} {unit}
          </Text>
          <Text style={styles.cardDescription}>
            {description || "No description"}
          </Text>
          <Text style={styles.cardPrice}>Price: ₱{price}</Text>
        </View>
        {/* Edit and Delete buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
            <Icon name="edit" size={20} color="dodgerblue" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Icon name="delete" size={20} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardText: {
    marginLeft: 15,
    flex: 1, // Allow the card text to take up remaining space
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0D98BA",
  },
  cardDescription: {
    fontSize: 14,
    color: "#6c757d",
    marginVertical: 5,
  },
  cardPrice: {
    fontSize: 16,
    color: "#28a745",
  },
  buttonsContainer: {
    flexDirection: "row", // Arrange buttons horizontally
    position: "absolute",
    top: 0,
    right: 0,
  },
  editButton: {
    marginRight: 10, // Add some spacing between buttons
  },
});
