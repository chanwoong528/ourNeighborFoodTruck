import React, { useEffect, useState } from "react";
import { authService, dbService } from "../fbase";

import Store from "../components/Store";
<<<<<<< HEAD

=======
import ProfileMap from "../components/ProfileMap";
>>>>>>> dev/map
import "../css/profile.css";
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

  const [storeAddModal, setStoreAddModal] = useState(false);
 
  const handleClose = () => setStoreAddModal(false);
  const handleShow = () => setStoreAddModal(true);


  useEffect(() => {
    dbService
      .collection("stores")
      .where("userId", "==", authService.currentUser.uid)
      .onSnapshot((snapshot) => {
        console.log(snapshot);
        const storeArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStores(storeArray);
      });
  }, []);

  return (
    <div className="profile-main">
<<<<<<< HEAD
      <h1> {authService.currentUser.email}'s Profile</h1>
      {stores.length === 0 ? (
        <button
          onClick={() => {
            handleShow();
          }}
        >
          점포 추가
        </button>
      ) : null}
=======
      <h1> {props.userObj.email}'s Profile</h1>
      {
        stores.length === 0 ? (
          <button
            onClick={() => {
              setStoreAddModal(!storeAddModal);
            }}
          >
            점포 추가
          </button>
        ) : 
          <div className="profile-map-container">
            <ProfileMap />
          </div>
        
        }
>>>>>>> dev/map

      {storeAddModal ? (
        <StoreAddModal
          setStoreAddModal={setStoreAddModal}
          userObj={props.userObj}
        />
      ) : null}
      {
        <>
          {stores.map((store) => (
            <Store
              key={store.id}
              store={store}
              userObj={props.userObj}
              isOwner={props.userObj.uid === store.userId}
            />
          ))}
        </>
      }
    </div>
  );
}
function StoreAddModal(props) {
  const [storeName, setStoreName] = useState("");
  const [storeType, setStoreType] = useState("");
  const [adWeb, setAdWeb] = useState("");

  

  const onSubmitStore = async (e) => {
    e.preventDefault();
    try {
      await dbService.collection(`stores`).add({
        storeName,
        storeType,
        adWeb,
        userId: props.userObj.uid,
      });
      props.setStoreAddModal(false);
      alert("STORE Created");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="store-add-main">
      <h4>Create Store</h4>
      <form onSubmit={onSubmitStore}>
        <div className ="store-add-input">
          <input
            onChange={(e) => {
              setStoreName(e.target.value);
            }}
            placeholder="상호명"
          />
        </div>
        <div className ="store-add-input">
          <input
            onChange={(e) => {
              setStoreType(e.target.value);
            }}
            placeholder="음식카테고리"
          />
        </div>
        <div className ="store-add-input">
          <input
            onChange={(e) => {
              setAdWeb(e.target.value);
            }}
            placeholder="인스타url"
          />
          <div className =
"store-add-input">
            <div>
              <input type="submit" value="등록 " />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Profile;
