import { useState, useEffect, useRef } from "react";

const { kakao } = window;

const useWatchLocation = (options = {}) => {
  // store location in state
  const [location, setLocation] = useState();
  // store error message in state
  const [error, setError] = useState();
  // save the returned id from the geolocation's `watchPosition` to be able to cancel the watch instance
  const locationWatchId = useRef(null);

  // Success handler for geolocation's `watchPosition` method
  const handleSuccess = (pos) => {
    const { latitude, longitude } = pos.coords;
    let latLng = new kakao.maps.LatLng(latitude, longitude); //  + Math.random()/10 
    // console.log("latLng?", latLng);
    if (!location || (location.getLat() != latLng.getLat()
      || location.getLng() != latLng.getLng())) {
      console.log("setLocation called:", latLng);
      setLocation(latLng);
    }

  };

  // Error handler for geolocation's `watchPosition` method
  const handleError = (error) => {
    setError(error.message);
    console.log("watcher ERROR");
  };

  // Clears the watch instance based on the saved watch id
  const cancelLocationWatch = () => {
    const { geolocation } = navigator;

    if (locationWatchId.current && geolocation) {
      geolocation.clearWatch(locationWatchId.current);
    }
  };

  useEffect(() => {
    const { geolocation } = navigator;

    // If the geolocation is not defined in the used browser we handle it as an error
    if (!geolocation) {
      setError("Geolocation is not supported.");
      return;
    }
    
    // Start to watch the location with the Geolocation API
    locationWatchId.current = geolocation.watchPosition(handleSuccess, handleError, options);

    // Clear the location watch instance when React unmounts the used component
    return cancelLocationWatch;
  }, [options]);

  return { location, cancelLocationWatch, error };
};

export default useWatchLocation;