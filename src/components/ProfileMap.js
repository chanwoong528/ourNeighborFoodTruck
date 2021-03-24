import React, { useEffect, useState } from "react";
import Axios from "axios";
import { dbService, authService } from "../fbase";

const { kakao } = window;

function ProfileMap() {
  //  const checkMarker = async ()=>{
  // let data; 
  //  data = await dbService.collection("markers").where("userId", "==", authService.currentUser.uid).onSnapshot((snapshot) => {

  //   const markerArray = snapshot.docs.map((doc) => ({

  //     id: doc.id,
  //     ...doc.data(),
  //   }));

  //  })
  // }

  const [arr, setArr] = useState([]);

  useEffect(() => {
    const container = document.getElementById("pfMap");
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), //여기를 바꿔야함 내 장소로
      level: 4,
    };
    var map = new kakao.maps.Map(container, options);
    var iw = null;
    var cur_marker = null;
    var marker = null;
    var userId = authService.currentUser.uid;

    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition(function (position) {
        var lat = position.coords.latitude, // 위도
          lng = position.coords.longitude; // 경도

        var locPosition = new kakao.maps.LatLng(lat, lng);
        var message = '<div style="padding:5px;">현재 위치</div>';
        cur_marker = createMarker(locPosition, message);
        // marker = cloneMarker(cur_marker);
        // addToDB(marker);

        displayMarker(cur_marker);
        // console.log("msg = " + message);
      });
    } else {
      var locPosition = new kakao.maps.LatLng(33.450701, 126.570667);
      var message = "위치 정보를 사용할수 없어요..";
      cur_marker = createMarker(locPosition, message);
      // marker = cloneMarker(cur_marker);
      // addToDB(marker);

      displayMarker(cur_marker);
    }
    // marker = ;

    checkMarkersDB(marker);

    // on click
    kakao.maps.event.addListener(map, "click", (mouseEvent) => {
      // alert(event.point instanceof kakao.maps.Point); // true
      console.log(mouseEvent.latLng);
      var pos = mouseEvent.latLng;
      var update = window.confirm("새 위치로 변경할까요?");

      if (update) {
        // 예
        // profile의 상호명 등을 받아와서 갱신
        if (pos != marker.getPosition() && pos != cur_marker.getPosition()) {
          // if new pos isn't equal to original pos
          removeMarker(marker);
          changeMarkerPos(marker, pos);

          // dbService.collection("markers").update({
          //   position: pos,
          //   userId: authService.currentUser.uid,
          // });

          addMarkerPosToDB(marker);

          // var new_marker = createMarker(pos, '내 위치');
          displayMarker(marker, "트럭 위치");
        }
      } else {
        // 아니오
      }
    });

    async function checkMarkersDB() {
      let latLng = await getMarkerPosFromDB(userId);
      if (latLng) {
        // if the user has a saved marker position, load it from DB
        console.log("YES, ", latLng);
        // let lat = data.lat;
        // let lng = data.lng;
        marker = createAndDisplayMarker(latLng, "트럭 위치");
      } else {
        // checkMarker(); 
        console.log("NO");
        addMarkerPosToDB(marker);
        marker = cloneMarker(cur_marker);
      }
    }

    function createMarker(position, message) {
      var marker = new kakao.maps.Marker({
        // map: map,
        //image: markerImage,
        position: position,
      });

      setInfoWindow(marker, message);

      map.setCenter(position);
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
      var lat = marker.getPosition().getLat();
      var lng = marker.getPosition().getLng();
      var uid = authService.currentUser.uid;

      var markersRef = await dbService.collection("markers");
      await markersRef.doc(uid).set({
        lat: lat,
        lng: lng,
      });

      // dbService.collection("markers").add({
      //   lat: lat,
      //   lng: lng,
      // });
    }

    // function updateMarkerPosDB (marker){
    //   var lat = marker.getPosition().getLat();
    //   var lng = marker.getPosition().getLng();
    //   var uid = authService.currentUser.uid;


    // }

    async function getMarkerPosFromDB(uid) {
      var docRef = await dbService.collection("markers").doc(uid);
      var ll = null;
      // var getOptions = {
      //   source: 'cache',
      // }
      await docRef.get().then((doc) => {
        // console.log("cached doc data: ", doc.data());
        ll = new kakao.maps.LatLng(doc.data().lat, doc.data().lng);
        
      }).catch((error) => {
        // console.log("error getting cached doc: ", error);
        // return null;
      });
      return ll;
    }

    function changeMarkerPos(marker, pos) {
      if (pos instanceof kakao.maps.LatLng) {
        marker.setPosition(pos);
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

    function createAndDisplayMarker(latLng, msg) {
      var pos = latLng;
      let new_marker = createMarker(pos, msg);
      displayMarker(new_marker);
      return new_marker;
    }

    function removeMarker(marker) {
      marker.setMap(null);
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
