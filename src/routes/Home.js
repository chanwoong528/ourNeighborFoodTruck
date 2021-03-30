import React from "react";
import Map from "../components/Map";

import "../css/home.css";
// 지도
// 점주 아이콘
//점주 로그인

function Home() {
  return (
    <div className="home-main">
      <h1>근처에 있는 푸드트럭</h1>
      <div className="home-map-container">
        <Map />
      </div>
    </div>
  );
}

export default Home;
