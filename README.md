# Art Institute of Chicago — Museum Search App

A React Native (Expo) Android app that uses the **Art Institute of Chicago (AIC) API** to search the museum collection, allows users to apply filters such as artist, place, classification and date, browse paginated results, and view detailed artwork information.

This project was tested using an **Android Emulator (Pixel 5 API 30)**.

---
## Demo

![App demo](assets/demo/demo.gif)

## Features

- **Search artworks** by keyword
- **Filter artworks** using a dropdown UI:
  - Place of origin
  - Artist
  - Classification
  - Date range (snap slider + manual start/end inputs)
- **Results grid** (2-column cards) with images, title, and artist
- **Pagination** (Prev/Next)
- **Artwork details screen**:
  - Artwork image with **tap-to-fullscreen**
  - HTML description rendering
  - Metadata: date, place, medium, dimensions, classification, reference number

---

## Tech Stack

- **Expo SDK**: `~52`
- **React / React Native**: React `18.x`, React Native `0.76.x`
- **Navigation**: `@react-navigation/native-stack`
- **UI**
  - `@expo/vector-icons` (Ionicons)
  - `react-native-render-html` (artwork descriptions)
  - `@ptomasroos/react-native-multi-slider` (date range slider)

---

## Getting Started

### Prerequisites
- Node.js + npm
- Android Studio + Android Emulator
  - Recommended: **Pixel 5 API 30**
- Expo CLI (run via `npx`)

### Install dependencies
From the project root:

```bash
npm install
```

### Run the app (Android Emulator)
Start Expo:

```bash
npx expo start
```

Then:
- Press **`a`** in the Expo terminal to open on Android

---

## How It Works

### Search + Filters
Search and filter state is managed via a global context:

- `components/FilterContext.js`

Filters are displayed in a dropdown component:

- `components/FilterDropdown.js`

Each filter tab provides search + multi-select UI:

- `PlaceFilterTab.js`
- `ArtistFilterTab.js`
- `ClassificationFilterTab.js`
- `DateFilterTab.js` (uses a fixed timeline from `constants/DateIntervals.js`)

### API Queries
The Results screen builds an Elasticsearch-style query object and sends it to:

- `GET https://api.artic.edu/api/v1/artworks/search?params=...`

Query generation logic lives in:

- `utils/buildElasticQuery.js`

The Details screen fetches a single artwork:

- `GET https://api.artic.edu/api/v1/artworks/{id}?fields=...`

### Images (IIIF)
Artwork images are loaded using the AIC IIIF format:

- `https://www.artic.edu/iiif/2/{image_id}/full/843,/0/default.jpg`

If an artwork has no `image_id`, the app shows a local placeholder image.

---

## Data Source / Disclaimer

This app uses the public **Art Institute of Chicago API**.

This project is for educational purposes and is not affiliated with or endorsed by the Art Institute of Chicago.

---

## Optional: Repository Hygiene

Typical files you should **not** commit:
- `node_modules/`
- Expo cache folders (`.expo/`, etc.)
- Build artifacts like `*.apk`

Add these to `.gitignore` as needed.