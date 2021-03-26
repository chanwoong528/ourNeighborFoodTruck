import React, { useEffect, useState } from "react";
import { authService, dbService } from "../fbase";
import { Modal, Button } from "react-bootstrap";

import Store from "../components/Store";
import ProfileMap from "../components/ProfileMap";
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

  useEffect(() => {
    dbService
      .collection("stores")
      .where("userId", "==", authService.currentUser.uid)
      .onSnapshot((snapshot) => {
        const storeArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStores(storeArray);
      });
  }, []);

  return (
    <div className="profile-main">
      <h1> {authService.currentUser.displayName}'s Profile</h1>

      <div className="profile-map-container">
        <ProfileMap hasStore = { stores.length === 0 }/>

      </div>

      {stores.length === 0 ? (
        <button className="btn btn-primary"
          onClick={() => {
            setStoreAddModal(true);
          }}
        >
          점포 추가
        </button>
      ) : null}

      {storeAddModal ? (
        <StoreAddModal
          setStoreAddModal={setStoreAddModal}
          userObj={props.userObj}
          show={() => {
            setStoreAddModal(true);
          }}
          onHide={() => {
            setStoreAddModal(false);
          }}
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
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <form onSubmit={onSubmitStore}>
        <div className ="store-add-modal">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
           점포 추가
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="store-add-input">
            <input
              onChange={(e) => {
                setStoreName(e.target.value);
              }}
              placeholder="상호명"
              required pattern=".*\S+.*" title="This field is required"
            />
          </div>
          <div className="store-add-input">
            <input
              onChange={(e) => {
                setStoreType(e.target.value);
              }}
              placeholder="음식카테고리"
            />
          </div>

          <div className="store-add-input">
            <input
              onChange={(e) => {
                setAdWeb(e.target.value);
              }}
              placeholder="인스타url"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="store-add-input">
            <button type="submit" className="btn btn-primary">
              점포 등록
            </button>
          </div>
          <Button className="btn btn-secondary" onClick={props.onHide}>Close</Button>
        </Modal.Footer>
        </div>
      </form>
    </Modal>
  );
}

export default Profile;
