import React, { useEffect, useState } from "react";
import { authService, dbService } from "../fbase";
import { Modal, Button } from "react-bootstrap";

import Menu from "./Menu";

function Store(props) {
  const [menus, setMenus] = useState([]);

  const [menuAddModal, setMenuAddModal] = useState(false);
  const [editStore, setEditStore] = useState(false);
  const DeleteStore = async () => {
    const ok = window.confirm("Are you sure you want to delete this store?");
    if (ok) {
      await dbService.doc(`stores/${props.store.id}`).delete();
      await dbService
        .collection("markers")
        .doc(authService.currentUser.uid)
        .delete();
      let menuDel = await dbService
        .collection("menus")
        .where("storeId", "==", props.store.id);
      menuDel.get().then((querySnapShot) => {
        querySnapShot.forEach((doc) => {
          doc.ref.delete();
        });
      });
    }
  };

  useEffect(() => {
    dbService.collection("menus").onSnapshot((snapshot) => {
      const menuArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMenus(menuArray);
    });
  }, []);

  return (
    <div className="store-main">
      {props.isOwner ? (
        <>
          <h4>{props.store.storeName}</h4>
          <h5>{props.store.storeType}</h5>
          <h5><a href={props.store.adWeb}>더보기</a></h5>
          
          <button
            onClick={() => {
              setEditStore(!editStore);
            }}
          >
            정보 수정
          </button>
          {editStore && <EditStoreModal
            storeName={props.store.storeName}
            storeType={props.store.storeType}
            adWeb={props.store.adWeb}
            storeId={props.store.id}
            setEditStore ={setEditStore}
          />}
          
          <button
            onClick={() => {
              DeleteStore();
            }}
          >
            정보 제거
          </button>
          <button
            onClick={() => {
              setMenuAddModal(!menuAddModal);
            }}
          >
            메뉴 추가
          </button>

          {menus.map((menu) => (
            <Menu
              menuId={menu.id}
              menu={menu}
              store={props.store}
              isStore={menu.storeId === props.store.id}
            ></Menu>
          ))}
        </>
      ) : null}

      {menuAddModal ? (
        <MenuAddModal
          store={props.store}
          userObj={props.userObj}
          show={() => {
            setMenuAddModal(true);
          }}
          onHide={() => {
            setMenuAddModal(false);
          }}
        />
      ) : null}
    </div>
  );
}
function EditStoreModal(props) {
  const [editStoreName, setEditStoreName] = useState(props.storeName);
  const [editStoreType, setEditStoreType] = useState(props.storeType);
  const [editAdWeb, setEditAdWeb] = useState(props.adWeb);

  async function onSubmitEdit(e) {
    e.preventDefault();

    console.log(editStoreName, props.storeName);
    await dbService.doc(`stores/${props.storeId}`).update({
      storeName: editStoreName,
      storeType: editStoreType,
      adWeb: editAdWeb,
    });
    props.setEditStore(false);
  }
  return (
    <form onSubmit={onSubmitEdit}>
      <input
      type ="text"
        onChange={(e) => {
          setEditStoreName(e.target.value);
        }} value={editStoreName}
        placeholder="점포이름수정"
       
      />
      <input
        onChange={(e) => {
          setEditStoreType(e.target.value);
        }}
        value={editStoreType}
        placeholder="점포타입수정"
        
      />
      <input
        onChange={(e) => {
          setEditAdWeb(e.target.value);
        }}value={editAdWeb}
        placeholder="인스타수정"
        
      />

      <button type="submit"> 정보 수정 </button>
    </form>
  );
}

function MenuAddModal(props) {
  const [menuName, setMenuName] = useState(" ");
  const [price, setPrice] = useState("");
  const [detail, setDetail] = useState("");
  const onSubmitMenu = async (e) => {
    e.preventDefault();
    try {
      await dbService.collection(`menus`).add({
        menuName,
        price,
        detail,
        storeId: props.store.id,
      });
      alert("menu created");
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
      <form onSubmit={onSubmitMenu}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h4>메뉴 추가</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="menu-add-input">
            <input
              onChange={(e) => {
                setMenuName(e.target.value);
              }}
              placeholder="메뉴이름"
            />
          </div>
          <div className="menu-add-input">
            <input
              onChange={(e) => {
                setPrice(e.target.value);
              }}
              placeholder="가격"
            />
          </div>
          <div className="menu-add-input">
            <input
              onChange={(e) => {
                setDetail(e.target.value);
              }}
              placeholder="detail"
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button type="submit" className="btn btn-primary">
            추가
          </button>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default Store;
