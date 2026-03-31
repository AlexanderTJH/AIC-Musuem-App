// Importing necessary libraries
import React, { createContext, useContext, useState } from "react";
// Importing Constants
import { DATE_INTERVALS } from "../constants/DateIntervals";

const FilterContext = createContext();
// Function to provide filter context to the application
export function FilterProvider({ children }) {
  const [search, setSearch] = useState("");
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [selectedClassifications, setSelectedClassifications] = useState([]);
  const [dateSliderValues, setDateSliderValues] = useState([0, DATE_INTERVALS.length - 1]);
  const [dateStartInput, setDateStartInput] = useState(DATE_INTERVALS[0]);
  const [dateEndInput, setDateEndInput] = useState(DATE_INTERVALS[DATE_INTERVALS.length - 1]);
  // Function to clear all filters
  const clearFilters = () => {
    setSelectedArtists([]);
    setSelectedPlaces([]);
    setSelectedClassifications([]);
    setDateSliderValues([0, DATE_INTERVALS.length - 1]);
    setDateStartInput(DATE_INTERVALS[0]);
    setDateEndInput(DATE_INTERVALS[DATE_INTERVALS.length - 1]);
  };
  // Structure of the FilterProvider component
  return (
    <FilterContext.Provider
      value={{
        search, setSearch,
        selectedArtists, setSelectedArtists,
        selectedPlaces, setSelectedPlaces,
        selectedClassifications, setSelectedClassifications,
        dateSliderValues, setDateSliderValues,
        dateStartInput, setDateStartInput,
        dateEndInput, setDateEndInput,
        clearFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  return useContext(FilterContext);
}