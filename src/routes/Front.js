//홍보 동영상 

//btn 점주라면 로그인!-> auth 
// btn 우리동네 프드트럭 보기-> home 

//점주 로그인 
import React from 'react';
import "../css/front.css"

import { Link } from 'react-router-dom';

function Front() {
  return (
    <div className="front-main">
      <h1>Front</h1>

      <div className="front-video">
        <video>홍보용 비디오</video>

      </div>
      <div className="front-btn">
        <button> <Link to="/auth">로그인 </Link> </button>
        <button to="/home"> <Link to="/home">지도보기 </Link></button>
      </div>
    </div>
  );
}

export default Front;