
import React, { useState, useEffect } from "react";
import { dbService, authService } from "../fbase";
import marker_red from "../img/marker_red.png";

import * as kmu from "./KakaoMapUtil";
import GeoLocator from "./GeoLocator";
// import SearchPlace from "./SearchPlaces";
import MarkerSearch from "./MarkerSearch";
import "../css/map.css";

const { kakao } = window;

function Map(props) {
  const [count, setCount] = useState(0);
  const [map, setMap] = useState(null);
  const [storeNames, setStoreNames] = useState({});
  // const { location, cancelLocationWatch, error } = useWatchLocation();

  useEffect(() => {
    setCount(count + 1);
    console.log("COUNT:", count);

    const container = document.getElementById("myMap");
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), //여기를 바꿔야함 내 장소로
      level: 4,
    };
    var map = kmu.createMap(container, options, true, true);
    setMap(map);

    var markers = {};
    var store_names = {};

    var iws = {};
    var iw = null;
    var cur_marker = null;
    var userId = null;
    init().then((data) => {

      loadMarkersFromDB();

    }).catch((err) => {
      console.log("ERRRR", err);
    });

    function init() {
      return new Promise((resolve, reject) => {
        if (authService.currentUser) {
          userId = authService.currentUser.uid;
          resolve(userId);
        }
        else {
          resolve(null);
        }
      });
    }

    function loadMarkersFromDB() {
      // const snapshot = await dbService.collection("markers").get();
      // return snapshot.docs.map(doc => doc.data());
      return new Promise((resolve, reject) => {
        dbService.collection("markers").onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let data = doc.data();
            let lat = data.lat;
            let lng = data.lng;
            let pos = new kakao.maps.LatLng(lat, lng);

            let msg = '<h5>' + data.storeName + '</h5><h6>'
              + data.storeType + '</h6><a href=' + data.adWeb +
              '> 가게 SNS</a> / <a href=/ourNeighborFoodTruck/#/store/' + data.userId + '>메뉴보기</a>';
            // console.log(markers[doc.id]);
            if (markers[doc.id]) {
              console.log("update/markers[uid] = ", markers[doc.id]);
              updateMarker(markers[doc.id], pos, msg);
              store_names[data.storeName] = pos;
              setStoreNames({ ...store_names });
            } else {
              let marker = kmu.createMarker(pos);
              markers[doc.id] = marker;
              store_names[data.storeName] = pos;
              setStoreNames({ ...store_names });
              kmu.displayMarker(marker, map);
            }

          });
          // markerSearch();
        });

      });


    }

    function updateMarker(marker, pos, msg) {
      if (marker instanceof kakao.maps.Marker) {
        kmu.changeMarkerPos(marker, pos);

        if (!(iws[marker] instanceof kakao.maps.InfoWindow)) {
          // create infoWindow for this marker
          iws[marker] = kmu.createInfoWindow(true);
        }
        console.log("original content:", iws[marker].getContent());
        if (typeof msg == typeof "") {
          kmu.setInfoWindow(iws[marker], marker, msg, map);
          // iws[marker].setContent(msg);
        }
      }
    }

  }, []);


  return (
    <div class="map_wrap">
      <MarkerSearch map={map} storeNames={storeNames} />
      <div
        className="home-map"
        id="myMap"
        style={{ width: "100%", height: "100%" }}
      ></div>

      {map && <GeoLocator map={map} />}

    </div>
  );
}

export default Map;