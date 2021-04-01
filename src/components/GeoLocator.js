import { useState, useEffect } from "react";
import marker_red from "../img/marker_red.png";

import * as kmu from "./KakaoMapUtil";

const { kakao } = window;
const { geolocation } = navigator;

function GeoLocator(props) {
  const [location, setLocation] = useState(null);
  const [count, setCount] = useState(0);
  console.log(count, "MAP:", props.map);
  // console.log(count, "location:", props.location);

  const handleSuccess = (pos) => {
    const { longitude, latitude } = pos.coords;
    console.log("lat:", latitude);
    console.log("lng:", longitude);
    var latLng = new kakao.maps.LatLng(latitude, longitude);
    console.log("latLng:", latLng);
    if (location == null || (location.getLat() != latLng.getLat()
      && location.getLng() != latLng.getLng())) {
        setLocation(latLng);
    }
  }

  const handleError = (err) => {
    console.log("watch error:", err);
  }

  useEffect(() => {
    setCount(count + 1);

    const map = props.map;
    const marker = kmu.createMarker(null, null, marker_red);
    var watchId = null;

    if (geolocation) {
      console.log("watching...");
      watchId = geolocation.watchPosition(handleSuccess, handleError);
      kmu.changeMarkerPos(marker, location);
      console.log("markerPos:", location);
      // console.log("map or null?", map instanceof kakao.maps.Map, map == null);
      
      let msg = '<div style="padding:5px; align:center;">현재 위치'+ count +'</div>';
      
      kmu.setInfoWindow(marker, msg, map);
      kmu.displayMarker(marker, map, true);
      // setWatcher();
      // if (watchId != null) geolocation.clearWatch();
      // getCurrentLocation();
    } else {
      console.log("not watching...");
      map.setCenter(new kakao.maps.LatLng(33.450701, 126.570667));
    }

    /**
     * @deprecated
     * 
     * Checks if geolocation is available.
     *  If yes, set marker to its current position and display.
     *  Otherwise, setCenter to default location.
     * 
     */
    function getCurrentLocation() {
      let latLng = new kakao.maps.LatLng(33.450701, 126.570667);
      if (geolocation) {
        getGeolocation().then((data) => {
          latLng = data ? data : latLng;

          kmu.changeMarkerPos(marker, latLng);
          // console.log("map or null?", map instanceof kakao.maps.Map, map == null);
          kmu.displayMarker(marker, map, true);

        }).catch((err) => {
          console.log("getGeolocation:", err);
        });
      } else {
        console.log("geolocation unavailable.");
        map.setCenter(latLng);
      }
    }

    /**
     * Helper
     * 
     * Returns a Promise that resolves when geolocation
     *  has a current position, and rejects otherwise.
     *  
     * @returns {Promise} represents a kakao.maps.LatLng object
     * 
     */
    function getGeolocation() {
      return new Promise((resolve, reject) => {
        geolocation.getCurrentPosition(function (position) {
          // console.log("position = ", position);
          let lat = position.coords.latitude, // 위도
            lng = position.coords.longitude; // 경도
          let latLng = new kakao.maps.LatLng(lat, lng);
          if (latLng && latLng != null) {
            resolve(latLng);
          } else {
            console.log("getGeolocation rejected.");
            reject();
          }

        });
      });
    }

    /**
     * Makes geolocation to watch the device's geolocation
     *  at a certain interval, and updates the marker location on the map.
     */
    function setWatcher() {
      watchId = geolocation.watchPosition(function (position) {
        const { latitude, longitude } = position.coords;
        let latLng = new kakao.maps.LatLng(latitude, longitude);
        console.log("latLng:", latLng);

        kmu.changeMarkerPos(marker, latLng);
        // console.log("map or null?", map instanceof kakao.maps.Map, map == null);
        kmu.displayMarker(marker, map, true);
        let msg = '<div style="padding:5px; align:center;">현재 위치</div>';
        let iw = kmu.createInfoWindow(true);
        kmu.setInfoWindowListener(iw, marker, map);
        kmu.setInfoWindowMsg(iw, msg);
      }, function (err) {
        console.log("setWatcher Error:", err);
      });
    };

    function clearWatcher() {
      geolocation.clearWatch(watchId);
      console.log("watcher cleared");
    }

    return () => {
      clearWatcher();
    };

  }, [location]);

  return null;
}

export default GeoLocator;