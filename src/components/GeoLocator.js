import { useState, useEffect, useRef } from "react";
import marker_red from "../img/marker_red.png";

import * as kmu from "./KakaoMapUtil";
import useWatchLocation from "./useWatchLocation";
import {geolocationOptions} from "./geolocationOptions";

const { kakao } = window;
const { geolocation } = navigator;

function GeoLocator(props) {
  const { location, cancelLocationWatch, error } = useWatchLocation(geolocationOptions);
  const [focus, setFocus] = useState (true);
  const marker = useRef();

  // console.log("MAP:", props.map);
  if (error) console.log("error??",error);
  
  useEffect(() => {
    const map = null;//props.map;
    marker.current = kmu.createMarker(null, null, marker_red);
    var watchId = null;

    // const { longitude, latitude } = location;
    // var latLng = new kakao.maps.LatLng(latitude, longitude);
    // console.log("latLng:", location);

    if (location instanceof kakao.maps.LatLng){
      console.log ("setting a new marker");
      // alert("location: " + location);
      kmu.changeMarkerPos(marker.current, location);
      let msg = '<div style="padding:5px; align:center;">현재 위치</div>';
      
      let iw = kmu.createInfoWindow(true);
      kmu.setInfoWindow(iw, marker.current, msg, props.map);
      kmu.displayMarker(marker.current, props.map, focus);
    } else {
      // alert("not watching");
      console.log("not watching...");
      props.map.setCenter(new kakao.maps.LatLng(33.450701, 126.570667));
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

          kmu.changeMarkerPos(marker.current, latLng);
          // console.log("map or null?", map instanceof kakao.maps.Map, map == null);
          kmu.displayMarker(marker.current, map, true);

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

    return () => {
      setFocus(false);
      marker.current.setMap(null);
      marker.current = null;
      console.log("--------- marker cleared --------");
    };

  }, [location, cancelLocationWatch]);

  return null;
}

export default GeoLocator;