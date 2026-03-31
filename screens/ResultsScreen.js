// Importing necessary libraries
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { useWindowDimensions } from "react-native";
// Importing components, constants, and styles
import CustomHeader from "../components/CustomHeader";
import SearchBar from "../components/SearchBar";
import FilterButton from "../components/FilterButton";
import ClearButton from "../components/ClearButton";
import FilterDropdown from "../components/FilterDropdown";
import { useAppFonts } from "../components/fonts";
import { DATE_INTERVALS } from "../constants/DateIntervals";
import { useFilter } from "../components/FilterContext";
import { buildElasticQuery } from "../utils/buildElasticQuery";
import { colors, fonts } from "../styles/colors";
// Function to convert date labels to years
function dateLabelToYear(label) {
  if (label.includes("BCE")) return -parseInt(label);
  if (label === "Present") return new Date().getFullYear();
  if (label === "1 CE") return 1;
  return parseInt(label);
}
// ResultsScreen component
export const ResultsScreen = ({
  // Props passed from the App.js file
  navigation,
  places = [],
  artists = [],
  classifications = [],
}) => {
  // Loading fonts and setting up filter context
  const fontsLoaded = useAppFonts();
  const {
    search, setSearch,
    selectedArtists,
    selectedPlaces,
    selectedClassifications,
    dateStartInput,
    dateEndInput,
    clearFilters,
  } = useFilter();

  const [filtersVisible, setFiltersVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.40;
  const cardMargin = width * 0.035;

  useEffect(() => {
    async function fetchArtworks() {
      setLoading(true);
      setApiError(null);
      try {
        const dateRange = [dateLabelToYear(dateStartInput), dateLabelToYear(dateEndInput)];
        // Setting Filter for Artists, Places, and Classifications
        const selectedArtistTitles = selectedArtists.map(id => {
          const artist = artists.find(a => a.id === id);
          return artist ? artist.title : null;
        }).filter(Boolean);

        const selectedPlaceTitles = selectedPlaces.map(id => {
          const place = places.find(p => p.id === id);
          return place ? place.title : null;
        }).filter(Boolean);

        const selectedClassificationTitles = selectedClassifications.map(id => {
          const c = classifications.find(c => c.id === id);
          return c ? c.title : null;
        }).filter(Boolean);

        const isDefaultDateRange =
          dateStartInput === DATE_INTERVALS[0] &&
          dateEndInput === DATE_INTERVALS[DATE_INTERVALS.length - 1];
        // Building the Elasticsearch query
        const elasticQuery = buildElasticQuery({
          query: search,
          selectedArtists: selectedArtistTitles,
          selectedPlaces: selectedPlaceTitles,
          selectedClassifications: selectedClassificationTitles,
          dateRange: isDefaultDateRange ? null : dateRange,
        });

        const params = encodeURIComponent(JSON.stringify(elasticQuery));
        const url = `https://api.artic.edu/api/v1/artworks/search?params=${params}&fields=id,title,image_id,artist_display,artist_title&limit=10&page=${page}`;
        // Used for debugging purposes
        // console.log("Elasticsearch Query:", JSON.stringify(elasticQuery, null, 2));
        // console.log("API URL:", url);

        // Fetching data from the API
        const res = await fetch(url);
        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          setApiError("Failed to parse API response.");
          setArtworks([]);
          setTotalPages(1);
          setLoading(false);
          return;
        }
        if (data.error) {
          setApiError(JSON.stringify(data.error, null, 2));
          setArtworks([]);
          setTotalPages(1);
        } else {
          setArtworks(data.data || []);
          setTotalPages(data.pagination?.total_pages || 1);
        }
      } catch (e) {
        setApiError(e.message || "Unknown error");
        setArtworks([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    }
    fetchArtworks();
  }, [
    // Inputting dependencies for useEffect
    search,
    selectedArtists,
    selectedPlaces,
    selectedClassifications,
    dateStartInput,
    dateEndInput,
    page,
    artists,
    places,
    classifications,
  ]);
  // Shows Loading screen until fonts are loaded
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  const handleSearch = () => {
    setPage(1);
  };
  // Rendering the artwork card
  const renderArtwork = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.artworkCard,
        { width: cardWidth, marginHorizontal: cardMargin }
      ]}
      onPress={() => navigation.navigate("Details", { artworkId: item.id })}
    >
      <Image
        source={
          item.image_id
            ? { uri: `https://www.artic.edu/iiif/2/${item.image_id}/full/843,/0/default.jpg` }
            : require("../assets/placeholder.png")
        }
        style={styles.artworkImage}
        resizeMode="cover"
      />
      <Text style={styles.artworkTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.artworkArtist} numberOfLines={1}>{item.artist_display || item.artist_title}</Text>
    </TouchableOpacity>
  );
  // Pagination bar for navigating through pages
  const renderPagination = () => (
    <View style={styles.paginationBar}>
      <TouchableOpacity
        style={styles.pageButton}
        disabled={page === 1}
        onPress={() => setPage(page - 1)}
      >
        <Text style={[styles.pageButtonText, page === 1 && { color: "#ccc" }]}>Prev</Text>
      </TouchableOpacity>
      <Text style={styles.pageInfo}>{`Page ${page} of ${totalPages}`}</Text>
      <TouchableOpacity
        style={styles.pageButton}
        disabled={page === totalPages}
        onPress={() => setPage(page + 1)}
      >
        <Text style={[styles.pageButtonText, page === totalPages && { color: "#ccc" }]}>Next</Text>
      </TouchableOpacity>
    </View>
  );
  // Structure of the ResultsScreen
  return (
    <View style={styles.container}>
      <CustomHeader showBack={true} onBack={() => navigation.goBack()} />
      <View style={styles.content}> 
        <SearchBar // Same Logic as in HomeScreen
          value={search}
          onChangeText={setSearch}
          onSearch={handleSearch}
        />
        <View style={styles.filterRow}>
          <FilterButton
            label={filtersVisible ? "Hide Filters" : "Show Filters"}
            onPress={() => setFiltersVisible((v) => !v)}
          />
          {filtersVisible && (
            <ClearButton onPress={clearFilters} />
          )}
        </View>
        {filtersVisible && (
          <FilterDropdown
            places={places}
            artists={artists}
            classifications={classifications}
          />
        )}
        <Text style={styles.resultsFor}> 
          Results for "{search}"
        </Text>
        {apiError && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>
              API Error: {apiError}
            </Text>
          </View>
        )}
        {loading ? ( 
          <ActivityIndicator style={{ marginTop: 32 }} />
        ) : !apiError && artworks.length === 0 ? (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>
              Sorry, we couldn't find any results for "{search}"
            </Text>
          </View>
        ) : (
          <FlatList // FlatList to display artworks
            data={artworks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderArtwork}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
              width: "95%",
              alignSelf: "center",
              marginBottom: 12,
            }}
            contentContainerStyle={styles.resultsList}
            showsVerticalScrollIndicator={true}
          />
        )}
        {artworks.length > 0 && renderPagination()}
      </View>
    </View>
  );
};
// Styles for the ResultsScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    width: "100%",
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
  resultsFor: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.primary,
    marginTop: 12,
    marginBottom: 8,
    alignSelf: "flex-start",
    marginLeft: "7.5%",
  },
  resultsList: {
    paddingBottom: 16,
    alignItems: "center",
  },
  row: {
    justifyContent: "space-between",
    width: "85%",
    alignSelf: "center",
  },
  artworkCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
    padding: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },  
  artworkImage: {
    width: "100%",
    height: 120,
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: "#eee",
  },
  artworkTitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.primary,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 2,
  },
  artworkArtist: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.secondary,
    textAlign: "center",
  },
  noResults: {
    marginTop: 32,
    alignItems: "center",
  },
  noResultsText: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.primary,
  },
  paginationBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
    width: "100%",
  },
  pageButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  pageButtonText: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.accent,
    fontWeight: "bold",
  },
  pageInfo: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.primary,
    marginHorizontal: 12,
  },
});
