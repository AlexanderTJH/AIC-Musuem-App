// Importing necessary libraries
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
// Importing styles and colors
import { colors, fonts } from "../styles/colors";
// Defining the ClearButton component
export default function ClearButton({ onPress, label = "Clear Filters" }) {
  return (
    <TouchableOpacity style={styles.clearButton} onPress={onPress}>
      <Text style={styles.clearText}>{label}</Text>
    </TouchableOpacity>
  );
}
// Styles for the ClearButton component
const styles = StyleSheet.create({
  clearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  clearText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.accent,
    fontWeight: "bold",
  },
});
