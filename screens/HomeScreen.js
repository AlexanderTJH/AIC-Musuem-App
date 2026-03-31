// Importing necessary libraries
import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";
// Importing Components and styles
import CustomHeader from "../components/CustomHeader";
import SearchBar from "../components/SearchBar";
import FilterButton from "../components/FilterButton";
import ClearButton from "../components/ClearButton";
import FilterDropdown from "../components/FilterDropdown";
import { useAppFonts } from "../components/fonts";
import { colors, fonts } from "../styles/colors";
import { useFilter } from "../components/FilterContext";
// HomeScreen component
export const HomeScreen = ({
  // Props passed from the App.js file
  navigation,
  places = [],
  artists = [],
  classifications = [],
}) => {
  // Loading fonts and setting up filter context
  const fontsLoaded = useAppFonts();
  const {
    search, setSearch, clearFilters,
  } = useFilter();
  // Setting up state for filters visibility
  const [filtersVisible, setFiltersVisible] = useState(false);
  // Shows Loading screen until fonts are loaded
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }
  // Function to handle search action
  const handleSearch = () => {
    navigation.navigate("Results", { query: search });
  };
  // Structure of the HomeScreen
  return (
    <View style={styles.container}>
      <CustomHeader showBack={false} />
      <View style={styles.content}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          onSearch={handleSearch}
        />
        <View style={styles.filterRow}>
          <FilterButton // Logic to show/hide filters and clear filters
            label={filtersVisible ? "Hide Filters" : "Show Filters"}
            onPress={() => setFiltersVisible((v) => !v)}
          />
          {filtersVisible && (
            <ClearButton onPress={clearFilters} />
          )}
        </View>
        {filtersVisible && (
          <FilterDropdown // Dropdown for filters
            places={places}
            artists={artists}
            classifications={classifications}
          />
        )}
      </View>
    </View>
  );
};
// Style sheet for the HomeScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  title: {
    fontFamily: fonts.title,
    fontSize: 28,
    color: colors.primary,
    marginBottom: 32,
    textAlign: "center",
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.primary,
    marginBottom: 24,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "85%",
    alignSelf: "flex-start",
    marginTop: 4,
    marginBottom: 4,
    marginLeft: "7.5%",
    justifyContent: "space-between",
  },
});
