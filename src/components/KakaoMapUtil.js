
const { kakao } = window;

export const createMap = (container, options, mapTypeCtrl, zoomCtrl) => {
  const con = container ? container : document.getElementById("map");
  const opt = options ? options : {
    center: new kakao.maps.LatLng(33.450701, 126.570667),
    level: 7,
  };
  let map = new kakao.maps.Map(con, opt)
  if (mapTypeCtrl === true) {
    map.addControl(new kakao.maps.MapTypeControl(), kakao.maps.ControlPosition.TOPRIGHT);
  }
  if (zoomCtrl === true) {
    map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT);
  }
  return map;
}

export const createMarker = (position, map, imgSrc, infoWindowMsg) => {
  let marker = new kakao.maps.Marker();
  if (position && position instanceof kakao.maps.LatLng) {
    marker.setPosition(position);
  }
  if (map == null || (map && map instanceof kakao.maps.Map)) {
    marker.setMap(map);
  }
  if (imgSrc) {
    let markerImage = new kakao.maps.MarkerImage(
      imgSrc,
      new kakao.maps.Size(35, 35),
      new kakao.maps.Point(13, 34)
    );
    marker.setImage(markerImage);
  }
  if (typeof infoWindowMsg == typeof "") {
    setInfoWindow(marker, infoWindowMsg, map);
  }

  return marker;
}

export const cloneMarker = (marker) => {
  let newMarker = createMarker(marker.getPosition(), marker.getMap(), marker.getImage());
  return newMarker;
}

export const displayMarker = (marker, map, boolSetCenter, infoWindowMsg) => {
  if (marker instanceof kakao.maps.Marker && map instanceof kakao.maps.Map) {
    marker.setMap(map);
    if (boolSetCenter === true) {
      map.setCenter(marker.getPosition());
    }
    if (infoWindowMsg && typeof infoWindowMsg == typeof "string") {
      setInfoWindow(marker, infoWindowMsg, map);
    }
  } else {
    console.log("displayMarker received a non-marker (or map) object");
  }
}

/**
 * 
 * @param {Boolean} isRemovable 
 * @returns {kakao.maps.InfoWindow}
 */
export const createInfoWindow = (isRemovable) => {
  // if (isRemovable !== true){
  //   isRemovable = false;
  // }
  var iw = new kakao.maps.InfoWindow({
    // content: "",
    removable: isRemovable === true ? true : false,
  });
  return iw;
}

export const setInfoWindow = (infoWindow, marker, msg, map) => {
  setInfoWindowListener(infoWindow, marker, map);
  setInfoWindowMsg(infoWindow, msg);
}

export const setInfoWindowListener = (infoWindow, marker, map) => {
  if (!(infoWindow instanceof kakao.maps.InfoWindow)) { return; }
  if (!(marker instanceof kakao.maps.Marker)) { return; }
  if (!(map instanceof kakao.maps.Map)) { return; }
  kakao.maps.event.addListener(marker, "click", iwOpener(map, marker, infoWindow));
  kakao.maps.event.addListener(map, "click", iwCloser(infoWindow));
}

export const setInfoWindowMsg = (infoWindow, msg) => {
  if (infoWindow instanceof kakao.maps.InfoWindow) {
    if (typeof msg == typeof "") {
      infoWindow.setContent(msg);
    }
  }
}

function iwOpener(map, marker, infowindow) {
  return function () {
    infowindow.open(map, marker);
  };
}

function iwCloser(infowindow) {
  return function () {
    infowindow.close();
  };
}

export const changeMarkerPos = (marker, position) => {
  if (marker instanceof kakao.maps.Marker && position instanceof kakao.maps.LatLng) {
    marker.setPosition(position);
  } else {
    console.log("changeMarkerPos() has invalid parameter(s).");
    return;
  }
}

export const comparePos = (latLng_1, latLng_2) => {
  if (!latLng_1 || latLng_2) {
    return false;
  }
  if (latLng_1 instanceof kakao.maps.LatLng
    && latLng_2 instanceof kakao.maps.LatLng) {
    // compare lat and lng
    return latLng_1.getLat() == latLng_2.getLat()
      && latLng_1.getLng() == latLng_2.getLng();
  } else {
    return false;
  }
}