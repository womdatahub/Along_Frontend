"use client";
import React, { useEffect, useRef } from "react";
import axios from "axios";
import Radar from "radar-sdk-js";
import "radar-sdk-js/dist/radar.css";
import AutocompleteUI from "radar-sdk-js/dist/ui/autocomplete";

const mapContainerId = "map";
const publishableKey = "prj_test_pk_136dd986381e20a9438552dcf3e944a804945990";
const RadarMap: React.FC = () => {
  useEffect(() => {
    Radar.initialize(publishableKey);

    const pickup: [number, number] = [7.398574, 9.0764785]; // [lng, lat]
    const drop: [number, number] = [12.5, 9.33333]; // [lng, lat]

    const map = Radar.ui.map({
      container: mapContainerId,
      style: "radar-default-v1",
      center: pickup,
      zoom: 6,
    });

    Radar.ui.marker({ text: "Pickup" }).setLngLat(pickup).addTo(map);
    Radar.ui.marker({ text: "Drop" }).setLngLat(drop).addTo(map);

    map.on("load", async () => {
      try {
        const resp = await axios.get(
          "https://api.radar.io/v1/route/directions",
          {
            params: {
              locations: `${pickup[1]},${pickup[0]}|${drop[1]},${drop[0]}`, // note: lat,lng
              mode: "car",
              units: "metric",
            },
            headers: {
              Authorization: publishableKey,
            },
          }
        );

        // resp.data should have a routes array
        const directionsData = resp.data;

        if (!directionsData.routes || directionsData.routes.length === 0) {
          console.error("No route found");
          return;
        }

        const route = directionsData.routes[0];
        // route.geometry might have:
        // - an encoded polyline in route.geometry.polyline
        // - or direct coordinates depending on API response format

        if (route.geometry.polyline) {
          const polyline = route.geometry.polyline as string;

          // Use Radar Maps UI function to draw encoded polyline
          map.addPolyline(polyline, {
            id: "route-polyline",
            precision: 6,
            properties: {},
            paint: {
              "line-color": "#007AFF",
              "line-width": 4,
            },
          });
        } else if (route.geometry.coordinates) {
          const coords: [number, number][] = route.geometry.coordinates;

          // Use GeoJSON LineString with map.addLine
          map.addLine(
            {
              type: "Feature",
              id: "route-line-feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: coords,
              },
            },
            {
              paint: {
                "line-color": "#007AFF",
                "line-width": 4,
              },
            }
          );
        } else {
          console.error("Route geometry format not supported");
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    });
  }, []);

  return (
    <div
      id={mapContainerId}
      style={{ width: "100%", height: "500px", position: "relative" }}
    />
  );
};

export { RadarMap };

type AddressResult = {
  addressLabel: string;
  city: string;
  country: string;
  countryCode: string;
  countryFlag: string;
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
    Radar.initialize(publishableKey);

    autocompleteRef.current = Radar.ui.autocomplete({
      container: "autocomplete",
      width: "600px",
      onSelection: (address: AddressResult) => {
        console.log(address.longitude, address.latitude);
      },
    });

    setTimeout(() => {
      const input = document.querySelector(
        ".radar-autocomplete-input"
      ) as HTMLInputElement;
      if (input) {
        input.placeholder = "Enter your address here";
      }
    }, 100);
    return () => {
      autocompleteRef.current?.remove();
    };
  }, []);

  return <div id='autocomplete' />;
};

export { RadarAutocomplete };
