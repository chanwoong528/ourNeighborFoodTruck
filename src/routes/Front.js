import React from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { authService } from "../fbase";

import "../css/front.css";
import adimg1 from "../img/adimg1.png";
import adimg2 from "../img/adimg2.png";
import adimg3 from "../img/adimg3.png";
//홍보 동영상
//btn 점주라면 로그인!-> auth
// btn 우리동네 프드트럭 보기-> home
//점주 로그인

function Front(props) {
  return (
    <div className="front-main">
       <div className="front-btn">
        {props.isLoggedIn ? (
          <Link to="/edit">
            <button>{authService.currentUser.displayName} </button>
          </Link>
        ) : (
          <Link to="/auth">
            <button>오늘 장사는 여기서! </button>
          </Link>
        )}

        <Link to="/home">
          <button>오늘 식사는 여기서!</button>
        </Link>
      </div>

      <div className="front-card-container">
        <Card className="mr-2 mb-2"  style={{ width: "100%", display: "inline-block", maxWidth:"500px"}} >
         
          <Card.Img variant="top" src={adimg1} />
          <Card.Body>
            <Card.Title>실시간 지도 업데이트</Card.Title>
            <Card.Text>
            실시간으로 푸드트럭 위치가 업데이트 됩니다.
            </Card.Text>
          
          </Card.Body>
        </Card>
        <Card className="mr-2 mb-2" style={{ width: "100%", display: "inline-block", maxWidth:"500px"}} >
         
         <Card.Img variant="top" src={adimg2} />
         <Card.Body>
           <Card.Title>메뉴판 보기</Card.Title>
           <Card.Text>
            푸드트럭에서 판매하는 메뉴를 볼 수 있어요. 
           </Card.Text>
      
         </Card.Body>
       </Card>
       <Card className="mr-2 mb-5" style={{ width: "100%", display: "inline-block", maxWidth:"500px"}} >
         
         <Card.Img variant="top" src={adimg3} />
         <Card.Body>
           <Card.Title>메뉴판 수정하기</Card.Title>
           <Card.Text>
            실시간으로 나의 푸드트럭 메뉴를 수정 할 수 있어요. 
           </Card.Text>
      
         </Card.Body>
       </Card>
     </div>

     
    </div>
  );
}

export default Front;
