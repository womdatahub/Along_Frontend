"use client";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

/*
from defaults to center if not given
To
Markers [
  { lat: 37.7749, lng: -122.4194 },
  { lat: 37.7749, lng: -122.4194 },]

*/
export const GoogleMaps = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  if (!isLoaded) {
    return <div>GoogleMaps is instantiating</div>;
  }

  return (
    <div className='w-full h-full'>
      <GoogleMap
        center={center}
        zoom={15}
        mapContainerStyle={{
          width: "100%",
          height: "100%",
        }}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
};

export const GoogleMapAutoComplete = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  if (!isLoaded) {
    return <div>GoogleMaps is instantiating</div>;
  }
  return <Autocomplete>{children}</Autocomplete>;
};
