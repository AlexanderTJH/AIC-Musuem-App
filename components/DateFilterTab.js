import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { colors, fonts } from "../styles/colors";
import { DATE_INTERVALS } from "../constants/DateIntervals";

function getClosestIndex(value) {
  if (typeof value === "string" && value.toLowerCase().includes("bce")) {
    const num = parseInt(value);
    let minDiff = Infinity, minIdx = 0;
    DATE_INTERVALS.forEach((d, i) => {
      if (d.includes("BCE")) {
        const dNum = parseInt(d);
        const diff = Math.abs(dNum - num);
        if (diff < minDiff) {
          minDiff = diff;
          minIdx = i;
        }
      }
    });
    return minIdx;
  }
  if (typeof value === "string" && value.toLowerCase().includes("ce")) {
    return DATE_INTERVALS.indexOf("1 CE");
  }
  if (typeof value === "string" && value.toLowerCase().includes("present")) {
    return DATE_INTERVALS.length - 1;
  }
  let minDiff = Infinity, minIdx = 0;
  DATE_INTERVALS.forEach((d, i) => {
    let dNum = null;
    if (d.includes("BCE")) dNum = -parseInt(d);
    else if (d === "Present") dNum = 2025;
    else if (d === "1 CE") dNum = 1;
    else dNum = parseInt(d);
    const diff = Math.abs(dNum - value);
    if (diff < minDiff) {
      minDiff = diff;
      minIdx = i;
    }
  });
  return minIdx;
}

export default function DateFilterTab({
  sliderValues,
  setSliderValues,
  startInput,
  setStartInput,
  endInput,
  setEndInput,
}) {
  const onSliderChange = (values) => {
    setSliderValues(values);
    setStartInput(DATE_INTERVALS[values[0]]);
    setEndInput(DATE_INTERVALS[values[1]]);
  };

  const onStartInputChange = (text) => {
    setStartInput(text);
    const idx = getClosestIndex(text);
    setSliderValues([idx, sliderValues[1]]);
  };
  const onEndInputChange = (text) => {
    setEndInput(text);
    const idx = getClosestIndex(text);
    setSliderValues([sliderValues[0], idx]);
  };

  return (
    <View style={styles.expandedContent}>
      <View style={styles.labelRow}>
        <Text style={styles.handleLabel}>{DATE_INTERVALS[sliderValues[0]]}</Text>
        <Text style={styles.handleLabel}>{DATE_INTERVALS[sliderValues[1]]}</Text>
      </View>
      <MultiSlider
        values={sliderValues}
        min={0}
        max={DATE_INTERVALS.length - 1}
        step={1}
        allowOverlap={false}
        snapped
        onValuesChange={onSliderChange}
        selectedStyle={{ backgroundColor: colors.accent }}
        markerStyle={{ backgroundColor: colors.primary, height: 24, width: 24 }}
        containerStyle={{ marginHorizontal: 8 }}
      />
      <View style={styles.inputRow}>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            value={startInput}
            onChangeText={onStartInputChange}
            placeholder="Start"
            placeholderTextColor={colors.secondary}
          />
        </View>
        <Text style={styles.toText}>to</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            value={endInput}
            onChangeText={onEndInputChange}
            placeholder="End"
            placeholderTextColor={colors.secondary}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    marginTop: 8,
  },
  handleLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.primary,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    justifyContent: "center",
  },
  inputBox: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 6,
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 80,
  },
  input: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.primary,
    textAlign: "center",
    paddingVertical: 2,
  },
  toText: {
    marginHorizontal: 12,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.primary,
  },
});