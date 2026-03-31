import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from "../styles/colors";

export default function ArtistFilterTab({
  artists = [],
  selectedArtists = [],
  setSelectedArtists = () => {},
}) {
  const [search, setSearch] = useState("");

  const filteredArtists = artists.filter((artist) =>
    (artist.title || artist.name).toLowerCase().includes(search.toLowerCase())
  );

  const toggleArtist = (id) => {
    setSelectedArtists((prev) =>
      prev.includes(id)
        ? prev.filter((artistId) => artistId !== id)
        : [...prev, id]
    );
  };

  return (
    <View style={styles.expandedContent}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search artists..."
          placeholderTextColor={colors.secondary}
          value={search}
          onChangeText={setSearch}
        />
        <Ionicons name="search" size={22} color={colors.primary} style={styles.searchIcon} />
      </View>
      <FlatList
        data={filteredArtists.slice(0, 20)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.artistRow}
            onPress={() => toggleArtist(item.id)}
            activeOpacity={0.7}
          >
            <View style={styles.checkbox}>
              {selectedArtists.includes(item.id) && (
                <Ionicons name="checkmark" size={18} color={colors.primary} />
              )}
            </View>
            <Text style={styles.artistName}>{item.title || item.name}</Text>
          </TouchableOpacity>
        )}
        style={styles.artistList}
        contentContainerStyle={{ paddingBottom: 8 }}
        showsVerticalScrollIndicator={true}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        ListEmptyComponent={<Text>No artists found.</Text>}
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
  artistList: {
    maxHeight: 38 * 5,
  },
  artistRow: {
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
  artistName: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.primary,
  },
});
