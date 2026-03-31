// Import necessary libraries
import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
// Importing styles and colors
import { colors, fonts } from "../styles/colors";
// Defining the SearchBar component
export default function SearchBar({ value, onChangeText, onSearch, placeholder = "Search artworks..." }) {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor={colors.secondary}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        onSubmitEditing={onSearch}
      />
      <TouchableOpacity style={styles.searchIcon} onPress={onSearch}>
        <Ionicons name="search" size={28} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}
// Styles for the SearchBar component
const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.secondary,
    width: "85%",
    height: 56,
    marginTop: 10,
    marginBottom: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 18,
    fontSize: 18,
    fontFamily: fonts.body,
    color: colors.primary,
    backgroundColor: "transparent",
  },
  searchIcon: {
    paddingHorizontal: 16,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});