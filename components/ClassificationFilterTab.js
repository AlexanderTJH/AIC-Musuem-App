import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from "../styles/colors";

export default function ClassificationFilterTab({
  classifications = [],
  selectedClassifications = [],
  setSelectedClassifications = () => {},
}) {
  const [search, setSearch] = useState("");

  const filteredClassifications = classifications.filter((classification) =>
    (classification.title || classification.name).toLowerCase().includes(search.toLowerCase())
  );

  const toggleClassification = (id) => {
    setSelectedClassifications((prev) =>
      prev.includes(id)
        ? prev.filter((classId) => classId !== id)
        : [...prev, id]
    );
  };

  return (
    <View style={styles.expandedContent}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search classifications..."
          placeholderTextColor={colors.secondary}
          value={search}
          onChangeText={setSearch}
        />
        <Ionicons name="search" size={22} color={colors.primary} style={styles.searchIcon} />
      </View>
      <FlatList
        data={filteredClassifications.slice(0, 20)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.classificationRow}
            onPress={() => toggleClassification(item.id)}
            activeOpacity={0.7}
          >
            <View style={styles.checkbox}>
              {selectedClassifications.includes(item.id) && (
                <Ionicons name="checkmark" size={18} color={colors.primary} />
              )}
            </View>
            <Text style={styles.classificationName}>{item.title || item.name}</Text>
          </TouchableOpacity>
        )}
        style={styles.classificationList}
        contentContainerStyle={{ paddingBottom: 8 }}
        showsVerticalScrollIndicator={true}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        ListEmptyComponent={<Text>No classifications found.</Text>}
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
  classificationList: {
    maxHeight: 38 * 5, // 5 rows
  },
  classificationRow: {
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
  classificationName: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.primary,
  },
});
