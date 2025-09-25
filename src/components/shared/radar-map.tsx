"use client";

import React, { useEffect, useRef } from "react";
import Radar from "radar-sdk-js";
import "radar-sdk-js/dist/radar.css";
import AutocompleteUI from "radar-sdk-js/dist/ui/autocomplete";

const latitude = 9.0764785;
const longitude = 7.398574;

const RadarMap: React.FC = () => {
  useEffect(() => {
    // Initialize Radar
    Radar.initialize("prj_test_pk_136dd986381e20a9438552dcf3e944a804945990");

    // Create the map
    const map = Radar.ui.map({
      container: "map",
      style: "radar-default-v1",
      center: [longitude, latitude],
      zoom: 14,
    });

    // Add marker
    Radar.ui
      .marker({ text: "Radar HQ" })
      .setLngLat([longitude, latitude])
      .addTo(map);
  }, []);

  return (
    <div
      id='map-container'
      style={{ width: "100%", height: "100%", position: "absolute" }}
    >
      <div
        id='map'
        style={{ height: "100%", width: "100%", position: "absolute" }}
      />
    </div>
  );
};

export { RadarMap };

type AddressResult = {
  addressLabel: string;
  city: string;
  country: string;
  countryCode: string;
  countryFlag: string; // e.g. 🇪🇸
  county: string;
  distance: number;
  formattedAddress: string;
  geometry: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  latitude: number;
  longitude: number;
  state: string;
  layer: string; // e.g. "locality"
};

const RadarAutocomplete = () => {
  const autocompleteRef = useRef<AutocompleteUI>(null);

  useEffect(() => {
    Radar.initialize("prj_test_pk_136dd986381e20a9438552dcf3e944a804945990");

    autocompleteRef.current = Radar.ui.autocomplete({
      container: "autocomplete",
      width: "600px",
      onSelection: (address: AddressResult) => {
        // Do something with the selected address
        console.log(address.longitude, address.latitude);
      },
    });

    setTimeout(() => {
      const input = document.querySelector(
        ".radar-autocomplete-input"
      ) as HTMLInputElement;
      if (input) {
        input.placeholder = "Enter your address here"; // ✅ Custom placeholder
      }
    }, 100); // Wait for Radar to render the input

    return () => {
      autocompleteRef.current?.remove();
    };
  }, []);

  return <div id='autocomplete' />;
};

export { RadarAutocomplete };
