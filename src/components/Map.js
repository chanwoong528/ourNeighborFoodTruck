import React, { useEffect } from "react";
import { dbService, authService } from "../fbase";
import marker_red from "../img/marker_red.png";

const { kakao } = window;

function Map() {

  useEffect(() => {
  
    const container = document.getElementById("myMap");
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), //여기를 바꿔야함 내 장소로
      level: 4,
    };
    var map = new kakao.maps.Map(container, options);
    var markers = {};
    var iws= {};
    var iw = null;
    var cur_marker = null;
    var userId = null;
    init().then((data) => {
      if (navigator.geolocation) {
        // GeoLocation을 이용해서 접속 위치를 얻어옵니다
        navigator.geolocation.getCurrentPosition(function (position) {
          var lat = position.coords.latitude, // 위도
            lng = position.coords.longitude; // 경도
  
          var locPosition = new kakao.maps.LatLng(lat, lng);
          var message = '<div style="padding:5px;">내 위치</div>';
          cur_marker = createMarker(locPosition, message, marker_red);
          displayMarker(cur_marker);
          console.log('msg = ' + message);
          map.setCenter(locPosition);
        });
      }
      else {
        var locPosition = new kakao.maps.LatLng(37.56710356826317, 126.97896911386826);
        var message = "위치 정보를 사용할수 없어요..";
        cur_marker = createMarker(locPosition, message, marker_red);
        displayMarker(cur_marker);
        map.setCenter(locPosition);
      }
  
      loadMarkersFromDB();
    }).catch((err) => {
      console.log("ERRRR");
    });

    
    // if (markers != null){
    //   // if the user has a saved marker position, load it from DB
    //   console.log('loaded marker position from DB');

    // }
   
    

    function init() {
      return new Promise((resolve, reject) => {
        userId = authService.currentUser.uid;
        if (userId){
          resolve(userId);
        }
        else {
          reject(new Error ("userId doesn't exist"));
        }
      });
    }

    async function loadMarkersFromDB() {
      // const snapshot = await dbService.collection("markers").get();
      // return snapshot.docs.map(doc => doc.data());
      
      
      await dbService.collection("markers").onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          let lat = data.lat;
          let lng = data.lng;
          let pos = new kakao.maps.LatLng(lat, lng);
          let msg = data.storeName + '<br>' + data.lat;
         // console.log ("update/markers = ", markers);
         // console.log ("update/doc.id = ", doc.id);
         // console.log ("update/markers[uid] = ", markers[doc.id]);
          if (markers[doc.id]){
            //console.log ("update/markers[uid] = ", markers[doc.id]);
            updateMarker(markers[doc.id], pos, msg);
          } else {
            let new_marker = createMarker(pos, msg);
            markers[doc.id] = new_marker;
            displayMarker(new_marker);
          }
        });
        
      });
    }

    // async function loadMarkersFromDB() {
      
    // }

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

    function updateMarker(target_marker, pos, msg){
      if (target_marker && target_marker != null){
        target_marker.setPosition(pos);
        // console.log("update/target_marker = ", target_marker);
        // console.log("update/iws[target] = ", iws[target_marker]);
        if(iws[target_marker]){
          console.log("content? ", iws[target_marker].getContent());
          iws[target_marker].setContent(msg);
        } else{
          
        }
      }
      

    }

    function setInfoWindow(marker, msg) {
      var iwContent = msg;
      var iwRemoveable = true;
      iw = new kakao.maps.InfoWindow({
        content: iwContent,
        removable: iwRemoveable,
      });
      iws[marker]= iw;

      kakao.maps.event.addListener(marker, 'click', makeOverListener(map, marker, iw));
      kakao.maps.event.addListener(map, 'click', makeOutListener(iw));
    }

    function displayMarker(marker, msg) {
      // var imageSrc ="../img/personIcon.png" ; // 마커이미지의 주소입니다
      // var imageSize = new kakao.maps.Size(64, 69); // 마커이미지의 크기입니다
      // var imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

      // var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
     
      marker.setMap(map);
      if (msg) marker.map.setCenter(marker.getPosition());
    }

    function removeMarkerByStoreName(storeName) {

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
      className="home-map"
      id="myMap"
      style={{ width: "90%", height: "100%" }}
    ></div>
  );
}
export default Map;
