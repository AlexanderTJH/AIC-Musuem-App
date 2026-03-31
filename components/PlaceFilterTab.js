import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from "../styles/colors";

export default function PlaceFilterTab({
  places = [],
  selectedPlaces = [],
  setSelectedPlaces = () => {},
}) {
  const [search, setSearch] = useState("");

  const filteredPlaces = places.filter((place) =>
    (place.title || place.name).toLowerCase().includes(search.toLowerCase())
  );

  const togglePlace = (id) => {
    setSelectedPlaces((prev) =>
      prev.includes(id)
        ? prev.filter((placeId) => placeId !== id)
        : [...prev, id]
    );
  };

  return (
    <View style={styles.expandedContent}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search places..."
          placeholderTextColor={colors.secondary}
          value={search}
          onChangeText={setSearch}
        />
        <Ionicons name="search" size={22} color={colors.primary} style={styles.searchIcon} />
      </View>
      <FlatList
        data={filteredPlaces.slice(0, 20)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.placeRow}
            onPress={() => togglePlace(item.id)}
            activeOpacity={0.7}
          >
            <View style={styles.checkbox}>
              {selectedPlaces.includes(item.id) && (
                <Ionicons name="checkmark" size={18} color={colors.primary} />
              )}
            </View>
            <Text style={styles.placeName}>{item.title || item.name}</Text>
          </TouchableOpacity>
        )}
        style={styles.placeList}
        contentContainerStyle={{ paddingBottom: 8 }}
        showsVerticalScrollIndicator={true}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        ListEmptyComponent={<Text>No places found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.secondary,
    marginBottom: 12,
    height: 40,
    paddingHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.primary,
    backgroundColor: "transparent",
    height: 40,
    paddingVertical: 0,
    textAlignVertical: "center",
  },
  searchIcon: {
    marginLeft: 4,
  },
  placeList: {
    maxHeight: 38 * 5,
  },
  placeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 4,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  placeName: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.primary,
  },
});
