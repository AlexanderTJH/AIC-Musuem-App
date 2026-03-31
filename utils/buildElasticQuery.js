export function buildElasticQuery({
  query,
  selectedArtists,
  selectedPlaces,
  selectedClassifications,
  dateRange,
  fields = [
    "id", "title", "artist_title", "image_id", "date_display",
    "classification_titles", "description", "date_start", "dimensions", "medium_display"
  ],
  limit = 10,
}) {
  const must = [];

  if (selectedArtists && selectedArtists.length > 0) {
    selectedArtists.forEach(artist =>
      must.push({
        term: { "artist_title.keyword": artist }
      })
    );
  }

  if (selectedPlaces && selectedPlaces.length > 0) {
    selectedPlaces.forEach(place =>
      must.push({
        term: { "place_of_origin.keyword": place }
      })
    );
  }

  if (selectedClassifications && selectedClassifications.length > 0) {
    selectedClassifications.forEach(classification =>
      must.push({
        term: { "classification_titles.keyword": classification }
      })
    );
  }

  if (dateRange && dateRange.length === 2) {
    const [userStart, userEnd] = dateRange;
    must.push({
      range: { date_start: { gte: userStart, lte: userEnd } }
    });
  }

  const queryObj = {
    q: query || "",
    query: { bool: { must } },
    fields,
    limit,
  };

  return queryObj;
}