// src/context/GoogleMapsContext.jsx
import { createContext } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

export const GoogleMapsContext = createContext();

const libraries = ["places", "maps"];

const GoogleMapsProvider = ({ children }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API,
    libraries,
  });

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export default GoogleMapsProvider;
