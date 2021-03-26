import React, { useEffect } from "react";

import { dbService, authService } from "../fbase";
import marker_red from "../img/marker_red.png";

const { kakao } = window;

function ProfileMap() {
  //  const checkMarker = async ()=>{
  //   let data; 
  //   data = await dbService.collection("markers").where("userId", "==", authService.currentUser.uid).onSnapshot((snapshot) => {

  //   const markerArray = snapshot.docs.map((doc) => ({

  //     id: doc.id,
  //     ...doc.data(),
  //   }));

  //  })


  useEffect(() => {
    const container = document.getElementById("pfMap");
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), //여기를 바꿔야함 내 장소로
      level: 7,
    };
    let map = new kakao.maps.Map(container, options);
    let iw = null;
    let cur_marker = null;
    let marker = null;
    let locPosition = null;

    let userId = null;
    let store_name = null;
    let ad_web = null;
    let store_type = null;

    init().then((data) => {
      console.log("data.storeName =", data.storeName, "data.adWeb =", data.adWeb);

      if (navigator.geolocation) {
        // GeoLocation을 이용해서 접속 위치를 얻어옵니다
        navigator.geolocation.getCurrentPosition(function (position) {
          var lat = position.coords.latitude, // 위도
            lng = position.coords.longitude; // 경도

          locPosition = new kakao.maps.LatLng(lat, lng);
          var message = '<div style="padding:5px;">현재 위치</div>';
          cur_marker = createMarker(locPosition, message, marker_red);
          marker = cloneMarker(cur_marker);
          // addToDB(marker);
          console.log(cur_marker ? "gps O" : "gps X");
          displayMarker(cur_marker);
          map.setCenter(locPosition);
          // console.log("msg = " + message);
        });
      } else {
        locPosition = new kakao.maps.LatLng(33.450701, 126.570667);
        var message = "위치 정보를 사용할수 없어요..";
        cur_marker = createMarker(locPosition, message, marker_red);
        marker = cloneMarker(cur_marker);
        // addToDB(marker);
        console.log(cur_marker ? "else O" : "else X");
        displayMarker(cur_marker);
        map.setCenter(locPosition);
      }

      checkMarkersDB(marker);

    }).catch((err) => {
      console.log("error: ", err);
    });

    // on click
    kakao.maps.event.addListener(map, "click", (mouseEvent) => {
      console.log(mouseEvent.latLng);
      var pos = mouseEvent.latLng;
      var update = window.confirm("새 위치로 변경할까요?");
      if (update) {
        // profile의 상호명 등을 받아와서 갱신
        if (marker !== null && pos !== marker.getPosition() && pos !== cur_marker.getPosition()) {
          // if new pos isn't equal to original pos
          removeMarker(marker);
          changeMarkerPos(marker, pos);
          addMarkerPosToDB(marker);
          displayMarker(marker, "트럭 위치");
        }
      } else {

      }
    });

    function init() {
      return new Promise((resolve, reject) => {
        userId = authService.currentUser.uid;
        dbService.collection("stores").where("userId", "==", userId)
          .onSnapshot((snapshot) => {
            let tmp = snapshot.docs[0];
            if (tmp) {
              let temp = snapshot.docs[0].data().storeName;
              console.log("on init(), storeName:", temp);
              if (temp && temp != null) {
                store_name = snapshot.docs[0].data().storeName;
                ad_web = snapshot.docs[0].data().adWeb;
                store_type = snapshot.docs[0].data().storeType;
                resolve(tmp.data());
              }
            } else {
              reject(new Error("errrrr"));
            }

            // console.log ("temp111 ", temp);
          });
      });

      // setStoreName(temp);
      // console.log("temp = ", temp);
    }

    function checkMarkersDB(target_marker) {
      let latLng = getMarkerPosFromDB(userId);
      if (latLng) {
        // if the user has a saved marker position
        console.log("YES, ", latLng);
        updateAndDisplayMarker(target_marker, latLng, "트럭 위치");
      } else {
        // checkMarker(); 
        console.log("NO");
        target_marker = cloneMarker(cur_marker);
        addMarkerPosToDB(target_marker);
      }
    }

    function createMarker(position, message, image) {
      let marker = new kakao.maps.Marker({
        // map: map,
        //image: markerImage,
        position: position,
      });

      setInfoWindow(marker, message);

      if (image) {
        let markerImage = new kakao.maps.MarkerImage(
          image, new kakao.maps.Size(35, 35), new kakao.maps.Point(13, 34));
        marker.setImage(markerImage);
      }

      // map.setCenter(position);
      return marker;
    }

    function cloneMarker(marker) {
      var new_marker = new kakao.maps.Marker({
        // map: null,
        //image: markerImage,
        position: marker ? marker.getPosition() : null,
      });
      removeMarker(new_marker);
      setInfoWindow(new_marker, "트럭 위치");

      return new_marker;
    }

    async function addMarkerPosToDB(marker) {
      let lat = marker.getPosition().getLat();
      let lng = marker.getPosition().getLng();
      let uid = authService.currentUser.uid;

      let markersRef = await dbService.collection("markers");
      await markersRef.doc(uid).set({
        lat: lat,
        lng: lng,
        storeName: store_name,
        adWeb: ad_web,
        storeType: store_type,
      });

    }

    async function getMarkerPosFromDB(uid) {
      let ll = await fetchMarkerDataFromDB(uid);
      if (ll instanceof kakao.maps.LatLng){
        return ll;
      }
      return null;
    }

    function fetchMarkerDataFromDB(uid) {
      return new Promise(function (resolve, reject) {
        let docRef = dbService.collection("markers").doc(uid);
        let ll = null;
        docRef.get().then((doc) => {
          ll = new kakao.maps.LatLng(doc.data().lat, doc.data().lng);
          resolve(ll);
        }).catch((error) => {
          console.log("error getting doc: ", error);
          reject(new Error(error));
        });
      });
    }

    function changeMarkerPos(target_marker, pos) {
      if (!target_marker || target_marker == null) { return; }
      if (pos instanceof kakao.maps.LatLng) {
        target_marker.setPosition(pos);
      } else {
        return;
      }
    }

    function setInfoWindow(marker, msg) {
      var iwContent = msg;
      var iwRemoveable = true;
      iw = new kakao.maps.InfoWindow({
        content: iwContent,
        removable: iwRemoveable,
      });
      kakao.maps.event.addListener(
        marker,
        "click",
        makeOverListener(map, marker, iw)
      );
      kakao.maps.event.addListener(map, "click", makeOutListener(iw));
    }
    function removeInfoWindow(marker, msg) { }

    function displayMarker(target_marker, msg) {
      // var imageSrc ="../img/personIcon.png" ; // 마커이미지의 주소입니다
      // var imageSize = new kakao.maps.Size(64, 69); // 마커이미지의 크기입니다
      // var imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

      // var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
      target_marker.setMap(map);
      if (msg) target_marker.getMap().setCenter(target_marker.getPosition());
    }

    function updateAndDisplayMarker(marker, latLng, msg) {
      var pos = latLng;
      changeMarkerPos(marker, pos);
      displayMarker(marker);
    }

    function removeMarker(target_marker) {
      if (!target_marker || target_marker == null) { return; }
      target_marker.setMap(null);
    }

    function makeOverListener(map, marker, infowindow) {
      return function () {
        infowindow.open(map, marker);
      };
    }

    function makeOutListener(infowindow) {
      return function () {
        infowindow.close();
      };
    }
  }, []);

  return (
    <div
      className="profile-map"
      id="pfMap"
      style={{ width: "90%", height: "100%" }}
    ></div>
  );
}
export default ProfileMap;
