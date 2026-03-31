// Importing the necessary font packages from Expo
import { useFonts as usePlayfairFonts, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { useFonts as useInterFonts, Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
// Function to load the Playfair and Inter fonts
export function useAppFonts() {
  const [playfairLoaded] = usePlayfairFonts({ PlayfairDisplay_700Bold });
  const [interLoaded] = useInterFonts({ Inter_400Regular, Inter_500Medium });
  return playfairLoaded && interLoaded;
}
