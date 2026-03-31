// Importing necessary libraries
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import 'react-native-gesture-handler'; // Imported as recommended in Moodle
// Importing Components
import { HomeScreen } from "./screens/HomeScreen";
import { ResultsScreen } from "./screens/ResultsScreen";
import { DetailsScreen } from "./screens/DetailsScreen";
import { FilterProvider } from "./components/FilterContext";

const Stack = createNativeStackNavigator();

export default function App() {
  // Creating setters for filters
  const [places, setPlaces] = useState([]);
  const [artists, setArtists] = useState([]);
  const [classifications, setClassifications] = useState([]);
  // Creating loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // This function fetches all the data from the API and sets it to the state variables
  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchAllPages = async (baseUrl, filterFn = (x) => x) => {
        let all = [];
        for (let page = 1; page <= 30; page++) { // Adjust the page limit as needed (In this case, 30 pages)
          const res = await fetch(`${baseUrl}&page=${page}`);
          const data = await res.json();
          if (!data.data || data.data.length === 0) break;
          all = all.concat(filterFn(data.data));
        }
        return all;
      };

      const [placesData, artistsData, classData] = await Promise.all([
        fetchAllPages(
          "https://api.artic.edu/api/v1/places?fields=id,title&limit=100"
        ),
        fetchAllPages(
          "https://api.artic.edu/api/v1/agents?fields=id,title&limit=100"
        ),
        fetchAllPages(
          "https://api.artic.edu/api/v1/category-terms?fields=id,title,subtype&limit=100",
          (data) => data.filter((item) => item.subtype === "classification")
        ),
      ]);
      // Set the data to the state variables
      setPlaces(placesData);
      setArtists(artistsData);
      setClassifications(classData);
    } catch (e) {
      setError("Failed to load filter data. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // fetchAll Function is called
  useEffect(() => {
    fetchAll();
  }, []);
  // Shows Error message if there is an error in fetching data
  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{error}</Text>
        <TouchableOpacity
          style={{ marginTop: 20, padding: 10, backgroundColor: "#E07A5F", borderRadius: 6 }}
          onPress={fetchAll}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  // Shows loading message while data is being fetched
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          Loading places, artists, and classifications...
        </Text>
      </View>
    );
  }
  // Structure of the app is defined here
  return (
    <FilterProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            options={{ headerShown: false }}
          >
            {(props) => (
              // Pass the props to the HomeScreen component
              <HomeScreen
                {...props}
                places={places}
                artists={artists}
                classifications={classifications}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Results"
            options={{ headerShown: false }}
          >
            {(props) => (
              // Pass the props to the ResultsScreen component
              <ResultsScreen
                {...props}
                places={places}
                artists={artists}
                classifications={classifications}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            // No props are passed to the DetailsScreen component, as it does not require them
            name="Details"
            component={DetailsScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </FilterProvider>
  );
}
// Style sheet for the loading screen
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F5F3EA",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: "#2D2D2A",
    fontWeight: "bold",
  },
});