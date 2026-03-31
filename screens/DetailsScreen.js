// Importing necessary libraries and components
import React, { useEffect, useState } from "react";
import RenderHtml from "react-native-render-html";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from "react-native";
import { useWindowDimensions } from "react-native";
// Importing components and styles
import CustomHeader from "../components/CustomHeader";
import { useAppFonts } from "../components/fonts";
import { colors, fonts } from "../styles/colors";
// DetailsScreen component
export const DetailsScreen = ({ navigation, route }) => {
  const { artworkId } = route.params || {};
  const fontsLoaded = useAppFonts();
  const { width } = useWindowDimensions();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  // Fetching artwork details from API
  useEffect(() => {
    async function fetchArtwork() {
      setLoading(true);
      try {
        // Fetching artwork details from the API, based on the artworkId passed from the previous screen and showing only the required fields
        const res = await fetch(`https://api.artic.edu/api/v1/artworks/${artworkId}?fields=id,title,artist_title,artist_display,date_display,date_start,date_end,place_of_origin,medium_display,dimensions,main_reference_number,description,image_id,classification_titles`);
        const data = await res.json();
        setArtwork(data.data);
      } catch (e) {
        setArtwork(null);
      } finally {
        setLoading(false);
      }
    }
    if (artworkId) fetchArtwork();
  }, [artworkId]);
  // Shows Loading screen until fonts are loaded
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }
  // If loading, show activity indicator
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }
  // If artwork not found, show no results message
  if (!artwork) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noResultsText}>Artwork not found.</Text>
      </View>
    );
  }
  // Image URL for the artwork
  const imageUrl = artwork.image_id
    ? `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`
    : null;
  // Structure of the DetailsScreen component
  return (
    <View style={styles.container}>
      <CustomHeader showBack={true} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{artwork.title}</Text>
        <Text style={styles.artist}>
          {artwork.artist_title}
          {artwork.artist_display && (
            <Text style={styles.artistLifespan}>{"  " + artwork.artist_display.replace(artwork.artist_title, "").trim()}</Text>
          )}
        </Text>
        <Text style={styles.date}>{artwork.date_display}</Text>
        {imageUrl && (
          <TouchableOpacity onPress={() => setFullscreen(true)} activeOpacity={0.8}>
            <Image
              source={{ uri: imageUrl }}
              style={[styles.artworkImage, { width: width * 0.9 }]}
              resizeMode="contain"
            />
            <Text style={styles.fullscreenHint}>Tap to view fullscreen</Text>
          </TouchableOpacity>
        )}
        {artwork.description ? (
          <RenderHtml
            contentWidth={width}
            source={{ html: artwork.description }}
            baseStyle={styles.description}
          />
        ) : (
          <Text style={styles.description}>No description available.</Text>
        )}
        <View style={styles.detailsList}>
          <DetailItem label="Title" value={artwork.title} />
          <DetailItem label="Date" value={artwork.date_display} />
          <DetailItem label="Place" value={artwork.place_of_origin} />
          <DetailItem label="Medium" value={artwork.medium_display} />
          <DetailItem label="Dimensions" value={artwork.dimensions} />
          <DetailItem label="Classification" value={artwork.classification_titles?.join(", ")} />
          <DetailItem label="Ref. Number" value={artwork.main_reference_number} />
        </View>
      </ScrollView>
      <Modal visible={fullscreen} transparent={true}>
        <View style={styles.fullscreenModal}>
          <TouchableOpacity style={styles.fullscreenClose} onPress={() => setFullscreen(false)}>
            <Text style={styles.fullscreenCloseText}>✕</Text>
          </TouchableOpacity>
          {imageUrl && (
            <Image source={{ uri: imageUrl }} style={styles.fullscreenImage} resizeMode="contain" />
          )}
        </View>
      </Modal>
    </View>
  );
};

function DetailItem({ label, value }) {
  if (!value) return null;
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}
// Styles for the DetailsScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    alignItems: "flex-start",
    padding: 16,
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: fonts.title,
    fontSize: 26,
    color: colors.primary,
    textAlign: "left",
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  artist: {
    fontFamily: fonts.body,
    fontSize: 18,
    color: colors.primary,
    textAlign: "left",
    marginBottom: 2,
    alignSelf: "flex-start",
  },
  artistLifespan: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.secondary,
  },
  date: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.secondary,
    textAlign: "left",
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  artworkImage: {
    width: "90%",
    height: 260,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: "#eee",
    alignSelf: "center",
  },
  fullscreenHint: {
    fontSize: 12,
    color: colors.secondary,
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.primary,
    marginBottom: 16,
    textAlign: "left",
    alignSelf: "flex-start",
  },
  detailsList: {
    width: "100%",
    marginTop: 8,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    elevation: 1,
  },
  detailItem: {
    flexDirection: "row",
    marginBottom: 6,
  },
  detailLabel: {
    fontFamily: fonts.body,
    fontWeight: "bold",
    color: colors.primary,
    width: 110,
  },
  detailValue: {
    fontFamily: fonts.body,
    color: colors.primary,
    flex: 1,
    flexWrap: "wrap",
  },
  noResultsText: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.primary,
  },
  fullscreenModal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenImage: {
    width: "98%",
    height: "80%",
  },
  fullscreenClose: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 2,
  },
  fullscreenCloseText: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
  },
});