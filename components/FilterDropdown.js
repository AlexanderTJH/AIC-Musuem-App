// Importing necessary libraries
import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
// Importing components, constants, and styles
import PlaceFilterTab from "./PlaceFilterTab";
import ArtistFilterTab from "./ArtistFilterTab";
import ClassificationFilterTab from "./ClassificationFilterTab";
import DateFilterTab from "./DateFilterTab";
import { DATE_INTERVALS } from "../constants/DateIntervals";
import { useFilter } from "./FilterContext";
import { FILTERS } from "../constants/Filters";
import { colors, fonts } from "../styles/colors";
// Defining the FilterDropdown component
export default function FilterDropdown({ places = [], artists = [], classifications = [] }) {
  // State to manage the expanded tab
  const [expandedTab, setExpandedTab] = useState(null);
  // Destructuring filter context values
  const {
    selectedArtists, setSelectedArtists,
    selectedPlaces, setSelectedPlaces,
    selectedClassifications, setSelectedClassifications,
    dateSliderValues, setDateSliderValues,
    dateStartInput, setDateStartInput,
    dateEndInput, setDateEndInput,
  } = useFilter();
  // Function to handle tab press
  const handleTabPress = (key) => {
    setExpandedTab(expandedTab === key ? null : key);
  };
  // Structure of the FilterDropdown component
  return (
    <View style={styles.dropdown}>
      {FILTERS.map((filter) => ( // Mapping through the FILTERS array to create filter tabs
        <View key={filter.key}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleTabPress(filter.key)}
          >
            <Text style={styles.tabText}>{filter.label}</Text>
            <Ionicons
              name={ // Chevron icon to indicate expanded/collapsed state
                expandedTab === filter.key ? "chevron-up" : "chevron-down"
              }
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
          {filter.key === "place" && expandedTab === "place" && ( // If both place and expanded tab are selected, show PlaceFilterTab
            <PlaceFilterTab // Place filter tab component
              places={places}
              selectedPlaces={selectedPlaces}
              setSelectedPlaces={setSelectedPlaces}
            />
          )}
          {filter.key === "artists" && expandedTab === "artists" && ( // If both artists and expanded tab are selected, show ArtistFilterTab
            <ArtistFilterTab // Artist filter tab component
              artists={artists}
              selectedArtists={selectedArtists}
              setSelectedArtists={setSelectedArtists}
            />
          )}
          {filter.key === "classification" && expandedTab === "classification" && ( // If both classification and expanded tab are selected, show ClassificationFilterTab
            <ClassificationFilterTab // Classification filter tab component
              classifications={classifications}
              selectedClassifications={selectedClassifications}
              setSelectedClassifications={setSelectedClassifications}
            />
          )}
          {filter.key === "date" && expandedTab === "date" && ( // If both date and expanded tab are selected, show DateFilterTab
            <DateFilterTab // Date filter tab component
              sliderValues={dateSliderValues}
              setSliderValues={setDateSliderValues}
              startInput={dateStartInput}
              setStartInput={setDateStartInput}
              endInput={dateEndInput}
              setEndInput={setDateEndInput}
            />
          )}
        </View>
      ))}
    </View>
  );
}
// Styles for the FilterDropdown component
const styles = StyleSheet.create({
  dropdown: {
    width: "85%",
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.secondary,
    marginTop: 8,
    alignSelf: "center",
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  tabText: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.primary,
  },
});
