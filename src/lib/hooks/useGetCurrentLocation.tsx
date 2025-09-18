// import React, { useState, useEffect } from "react";

// function LocationTracker() {
//   const [location, setLocation] = useState(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!navigator.geolocation) {
//       setError("Geolocation is not supported by your browser");
//       setLoading(false);
//       return;
//     }

//     const successHandler = (position) => {
//       setLocation({
//         latitude: position.coords.latitude,
//         longitude: position.coords.longitude,
//       });
//       setLoading(false);
//     };

//     const errorHandler = (err) => {
//       setError(err.message);
//       setLoading(false);
//     };

//     navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
//   }, []); // Empty dependency array ensures this runs only once on mount

//   if (loading) {
//     return <p>Getting location...</p>;
//   }

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   return (
//     <div>
//       <h2>Your Current Location:</h2>
//       <p>Latitude: {location.latitude}</p>
//       <p>Longitude: {location.longitude}</p>
//     </div>
//   );
// }

// export default LocationTracker;

"use client";
import { useState, useEffect } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export const useGetCurrentLocation = (): GeolocationState => {
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
        loading: false,
      }));
      return;
    }

    const successHandler = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        loading: false,
      });
    };

    const errorHandler = (error: GeolocationPositionError) => {
      setLocation((prev) => ({
        ...prev,
        error: error.message,
        loading: false,
      }));
    };
    navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
  }, []);

  console.log("Ran");
  return location;
};
