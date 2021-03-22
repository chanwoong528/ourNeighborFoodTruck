import React from 'react';
import { Link } from 'react-router-dom';

import firebase, { authService } from "../fbase";

import Map from "../components/Map";


//디비 create && update
//점주들을 위한 세팅 관리 
// 상호 명
// 전화번호 
// 오늘 주소
// 오늘 매뉴 -> 가격 
// 
// 점주 인스타  url -> home -> btn 점주 인스타 보러가기

//점주 로그인 

function Profile() {
  return (
    <div className="Profile">
      Profile <h4>{authService.currentUser.email}</h4>
      
      <button>Edit Profile</button>
       <Link to="/home"><button >지도보기</button> </Link>
    </div>
  );
}

export default Profile;