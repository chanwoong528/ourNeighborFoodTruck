import React from "react";
import { Link } from "react-router-dom";


import { authService } from "../fbase";
import "../css/front.css";
//홍보 동영상
//btn 점주라면 로그인!-> auth
// btn 우리동네 프드트럭 보기-> home
//점주 로그인

function Front(props) {
  return (
    <div className="front-main">
      <h1>Front</h1>

      <div className="front-video">
        <video>홍보용 비디오</video>
      </div>
      <div className="front-btn">
        {props.isLoggedIn ? (
          <Link to="/edit">
            <button>{authService.currentUser.displayName} </button>
          </Link>
        ) : (
          <Link to="/auth">
            <button>로그인 </button>
          </Link>
        )}

        <Link to="/home">
          <button>지도보기 </button>
        </Link>
      </div>
    </div>
  );
}

export default Front;
