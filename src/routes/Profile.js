import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import firebase, { authService, dbService } from "../fbase";

import Store from "../components/Store";
import Map from "../components/Map";
import "../css/profile.css"
//디비 create && update
//점주들을 위한 세팅 관리
// 상호 명
// 전화번호
// 오늘 주소
// 오늘 매뉴 -> 가격
//
// 점주 인스타  url -> home -> btn 점주 인스타 보러가기

//점주 로그인

function Profile(props) {
  const [stores, setStores] = useState([]);

  useEffect(() => {

    dbService.collection("stores").onSnapshot((snapshot) => {
      const storeArray = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      setStores(storeArray);
    });
  }, []);
  

  return (
    <div className="profile-main">
      <h1> Profile</h1>
      <h4>{props.userObj.email}</h4>
      <Link to="/home">
        <button>지도보기</button>
      </Link>
      <Link to="/profile/edit">
        <button>점포등록</button>
      </Link>

      {
        <>
          {stores.map((store) => (
            <Store store={store} isOwner={props.userObj.uid === store.userId} />
          ))}
        </>
      }
    </div>
  );
}

export default Profile;
