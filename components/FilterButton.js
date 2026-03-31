// Import necessary libraries
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
// Importing styles and colors
import { colors, fonts } from "../styles/colors";
// Defining the FilterButton component
export default function FilterButton({ onPress, label = "Show Filters" }) {
  return (
    <TouchableOpacity style={styles.filterButton} onPress={onPress}>
      <Ionicons name="filter-outline" size={22} color={colors.primary} />
      <Text style={styles.filterText}>{label}</Text>
    </TouchableOpacity>
  );
}
// Styles for the FilterButton component
const styles = StyleSheet.create({
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  filterText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.primary,
    marginLeft: 4,
  },
});
