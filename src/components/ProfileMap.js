import React, { useState, useEffect } from "react";

import { dbService, authService } from "../fbase";
import marker_red from "../img/marker_red.png";
import "../css/map.css";

import * as kmu from "./KakaoMapUtil";
import PlaceSearch from "./PlaceSearch";
import GeoLocator from "./GeoLocator";


const { kakao } = window;

function ProfileMap(props) {
  const [map, setMap] = useState(null);
  // const {location, cancelLocationWatch, error} = useWatchLocation();

  useEffect(() => {
    // setTimeout(() => {
    //   cancelLocationWatch();
    //   // setIsWatchForLocation(false);
    // }, 3000);

    var map = kmu.createMap(document.getElementById("pfMap"), false, true, true);
    setMap(map);

    let iw = null;
    let cur_marker = null;
    let marker = null;
    let locPosition = null;

    let uid = null;
    let store_name = null;
    let ad_web = null;
    let store_type = null;
    let user_id = null;

    init().then((data) => {
      loadSavedMarkerPosFromDB();
    }).catch((err) => {
      console.log("init error: ", err);
    });

    kakao.maps.event.addListener(map, "click", (mouseEvent) => {
      console.log(mouseEvent.latLng);
      var pos = mouseEvent.latLng;
      var update = window.confirm("새 위치로 변경할까요?");
      if (update) {
        if (store_name != null) {
          // has store_name
          if (!(marker instanceof kakao.maps.Marker)) {
            marker = kmu.createMarker();
          }
          // marker already exists
          kmu.changeMarkerPos(marker, pos);
          kmu.displayMarker(marker, map, true, "트럭 위치");
          addMarkerToDB(marker);

        } else {
          // has no store_name
          alert("점포 등록 후 사용 가능합니다.");
        }
      } else {
        // don't update == don't do anything
      }
    });

    function init() {
      return new Promise((resolve, reject) => {
        uid = authService.currentUser.uid;
        dbService
          .collection("stores")
          .where("userId", "==", uid)
          .onSnapshot((snapshot) => {
            let tmp = snapshot.docs[0];
            if (tmp) {
              let temp = snapshot.docs[0].data().storeName;
              if (temp && temp != null) {
                store_name = snapshot.docs[0].data().storeName;
                ad_web = snapshot.docs[0].data().adWeb;
                store_type = snapshot.docs[0].data().storeType;
                user_id = snapshot.docs[0].data().userId;
                resolve(tmp.data());
              }
            } else {
              reject(new Error("init errrr"));
            }
          });
      });
    }

    function loadSavedMarkerPosFromDB() {
      let latLng = new Promise((resolve, reject) => {
        resolve(fetchMarkerDataFromDB(uid));
      });
      latLng.then((ll) => {
        if (ll instanceof kakao.maps.LatLng) {
          // if the user has a saved marker position
          // console.log("saved position exists: ", ll);
          if (!(marker instanceof kakao.maps.Marker)) {
            marker = kmu.createMarker();
          }
          kmu.changeMarkerPos(marker, ll);
          kmu.displayMarker(marker, map, true, "트럭 위치");
        } else {
          // console.log("no saved position");
        }
      });
    }

    function fetchMarkerDataFromDB() {
      return new Promise(function (resolve, reject) {
        let docRef = dbService.collection("markers").doc(uid);
        // let ll = null;
        docRef
          .get()
          .then((doc) => {
            if (!doc.data() || doc.data() == null) resolve(null);
            else {
              let ll = new kakao.maps.LatLng(doc.data().lat, doc.data().lng);
              resolve(ll);
            }
          })
          .catch((error) => {
            console.log("error getting doc: ", error);
            reject(new Error(error));
          });
      });
    }

    async function addMarkerToDB() {
      if (!props.hasStore) {
        return;
      }
      let lat = marker.getPosition().getLat();
      let lng = marker.getPosition().getLng();
      // let uid = authService.currentUser.uid;

      let markersRef = await dbService.collection("markers");
      markersRef.doc(uid).set({
        lat: lat,
        lng: lng,
        storeName: store_name,
        adWeb: ad_web,
        storeType: store_type,
        userId: uid,
      });
    }

  }, []);

  return (
    <div class="map_wrap">
      <PlaceSearch map={map} />
      <div
        className="profile-map"
        id="pfMap"
        style={{ width: "100%", height: "100%" }}
      ></div>

      {map && <GeoLocator map={map} />}
    </div>
  );
}
export default ProfileMap;