"use client";
import React, { useEffect, useId, useRef, useState, useCallback } from "react";
import axios from "axios";
import Radar from "radar-sdk-js";
import "radar-sdk-js/dist/radar.css";
import AutocompleteUI from "radar-sdk-js/dist/ui/autocomplete";
import { AddressResult } from "@/types";

const publishableKey = process.env.NEXT_PUBLIC_RADAR_API_KEY || "";
type RadarMapProps = {
  pickup?: [number, number];
  pickupName?: string;
  drop?: [number, number];
  dropName?: string;
};

const Map = ({ pickup, drop, dropName, pickupName }: RadarMapProps) => {
  const generatedId = useId().replace(/:/g, "");
  const mapContainerId = `radar-map-${generatedId}`;
  const [sdkFailed, setSdkFailed] = useState(false);
  const pickupLng = pickup?.[0];
  const pickupLat = pickup?.[1];
  const dropLng = drop?.[0];
  const dropLat = drop?.[1];

  const addRoute = useCallback(
    async (
      map: ReturnType<typeof Radar.ui.map>,
      pickupCoords: [number, number],
      dropCoords: [number, number],
    ) => {
      try {
        const resp = await axios.get(
          "https://api.radar.io/v1/route/directions",
          {
            params: {
              locations: `${pickupCoords[1]},${pickupCoords[0]}|${dropCoords[1]},${dropCoords[0]}`,
              mode: "car",
              units: "metric",
            },
            headers: { Authorization: publishableKey },
          },
        );
        const route = resp.data?.routes?.[0];
        if (!route) return;
        if (route.geometry.polyline) {
          map.addPolyline(route.geometry.polyline as string, {
            id: "route-polyline",
            precision: 6,
            properties: {},
            paint: { "line-color": "#007AFF", "line-width": 4 },
          });
        } else if (route.geometry.coordinates) {
          map.addLine(
            {
              type: "Feature",
              id: "route-line-feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: route.geometry.coordinates as [number, number][],
              },
            },
            { paint: { "line-color": "#007AFF", "line-width": 4 } },
          );
        }
      } catch {
        /* route overlay optional — map still usable */
      }
    },
    [],
  );

  useEffect(() => {
    if (!publishableKey) return;

    let map: ReturnType<typeof Radar.ui.map> | undefined;
    setSdkFailed(false);

    try {
      Radar.initialize(publishableKey);
      const pickupCoords =
        pickupLng !== undefined &&
        pickupLat !== undefined &&
        (pickupLng !== 0 || pickupLat !== 0)
          ? ([pickupLng, pickupLat] as [number, number])
          : undefined;
      const dropCoords =
        dropLng !== undefined && dropLat !== undefined
          ? ([dropLng, dropLat] as [number, number])
          : undefined;

      map = Radar.ui.map({
        container: mapContainerId,
        style: "radar-default-v1",
        center: pickupCoords ?? [-90, 37.7749],
        zoom: pickupCoords ? 13 : 4,
      });

      if (pickupCoords) {
        Radar.ui
          .marker({ text: pickupName || "Pickup", color: "red" })
          .setLngLat(pickupCoords)
          .addTo(map);

        if (dropCoords) {
          Radar.ui
            .marker({ text: dropName || "Drop", color: "green" })
            .setLngLat(dropCoords)
            .addTo(map);
          map.on("load", () => addRoute(map!, pickupCoords, dropCoords));
        }
      }
    } catch {
      setSdkFailed(true);
    }

    return () => {
      map?.remove?.();
    };
  }, [
    addRoute,
    dropLat,
    dropLng,
    dropName,
    mapContainerId,
    pickupLat,
    pickupLng,
    pickupName,
  ]);

  if (!publishableKey) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-400">Map not configured</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div id={mapContainerId} className="h-full w-full" />
      {sdkFailed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 gap-2">
          <p className="text-sm font-medium text-gray-500">Map unavailable</p>
          <p className="text-xs text-gray-400">
            Enable hardware acceleration to view the map
          </p>
        </div>
      )}
    </div>
  );
};

export const RadarMap = React.memo(Map);

type RadarAutoCompleteProps = {
  placeholder?: string;
  defaultValue?: string;
  containerID?: string;
  setAutoCompleteAddress: (address: AddressResult) => void;
};

const RadarAutocomplete = ({
  placeholder,
  defaultValue,
  setAutoCompleteAddress,
}: RadarAutoCompleteProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const autocompleteRef = useRef<AutocompleteUI | null>(null);
  const [useManualSearch, setUseManualSearch] = useState(() => !publishableKey);
  const [query, setQuery] = useState(defaultValue ?? "");
  const [results, setResults] = useState<RadarAutocompleteResult[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!publishableKey) {
      return;
    }

    try {
      Radar.initialize(publishableKey);

      autocompleteRef.current = Radar.ui.autocomplete({
        container: containerRef.current,
        width: "100%",
        onSelection: setAutoCompleteAddress,
      });

      const input = containerRef.current.querySelector(
        ".radar-autocomplete-input",
      ) as HTMLInputElement | null;

      if (input) {
        input.placeholder = placeholder ?? "Enter your address here";
        input.value = defaultValue ?? "";
      }
    } catch {
      autocompleteRef.current = null;
      queueMicrotask(() => setUseManualSearch(true));
    }

    return () => {
      autocompleteRef.current?.remove();
    };
  }, [placeholder, defaultValue, setAutoCompleteAddress]);

  useEffect(() => {
    if (!useManualSearch || !publishableKey || query.length < 3) {
      return;
    }

    const timer = window.setTimeout(async () => {
      try {
        const nextResults = await radarAutocompleteManual(query);
        setResults(nextResults.slice(0, 5));
      } catch {
        setResults([]);
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [query, useManualSearch]);

  if (useManualSearch) {
    return (
      <div className="relative flex-1">
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            if (event.target.value.length < 3) setResults([]);
          }}
          className="w-full bg-transparent text-sm outline-none"
          placeholder={placeholder ?? "Enter your address here"}
        />
        {results.length > 0 && (
          <div className="absolute left-0 right-0 top-8 z-50 rounded-2xl bg-white p-2 shadow-lg">
            {results.map((result) => (
              <button
                key={`${result.address.formattedAddress}-${result.geometry.coordinates.join(",")}`}
                type="button"
                onClick={() => {
                  setQuery(result.address.formattedAddress);
                  setResults([]);
                  setAutoCompleteAddress({
                    addressLabel: result.address.placeLabel,
                    city: "",
                    country: "",
                    countryCode: "",
                    countryFlag: "",
                    county: "",
                    distance: 0,
                    formattedAddress: result.address.formattedAddress,
                    geometry: {
                      type: "Point",
                      coordinates: result.geometry.coordinates,
                    },
                    longitude: result.geometry.coordinates[0],
                    latitude: result.geometry.coordinates[1],
                    state: "",
                    layer: "address",
                  });
                }}
                className="block w-full rounded-xl px-3 py-2 text-left text-xs hover:bg-background"
              >
                {result.address.formattedAddress}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return <div ref={containerRef} className="flex-1" />;
};

export { RadarAutocomplete };

// CHANGE THESE
const AUTOCOMPLETE_URL = "https://api.radar.io/v1/search/autocomplete";

type RadarAutocompleteResult = {
  address: {
    formattedAddress: string;
    placeLabel: string;
  };
  geometry: { coordinates: [number, number] };
};
const radarAutocompleteManual = async (
  query: string,
): Promise<RadarAutocompleteResult[]> => {
  if (!query || query.length < 3) return [];

  const { data, status } = await axios(
    `${AUTOCOMPLETE_URL}?query=${encodeURIComponent(
      query,
    )}&layers=address,place`,
    {
      headers: {
        Authorization: publishableKey,
      },
    },
  );

  if (status !== 200) {
    throw new Error(`Radar autocomplete failed with: ${status} code`);
  }
  return data.addresses ?? [];
};

export { radarAutocompleteManual };
