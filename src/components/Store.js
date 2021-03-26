import React, { useEffect, useState } from "react";
import { authService, dbService } from "../fbase";
import { Modal, Button } from "react-bootstrap";

import Menu from "./Menu";
import "../css/profile.css";

function Store(props) {
  const [menus, setMenus] = useState([]);

  const [menuAddModal, setMenuAddModal] = useState(false);
  const [editStore, setEditStore] = useState(false);
  const DeleteStore = async () => {
    const ok = window.confirm("점포를 지울까요?");
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
    dbService.collection("menus").where("storeId", "==", props.store.id).onSnapshot((snapshot) => {
      const menuArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMenus(menuArray);
    });
  }, [props.store.id]);

  return (
    <div className="store-main">
      {props.isOwner ? (
        <>
          <h4>{props.store.storeName}</h4>
          <h5>{props.store.storeType}</h5>
          <h5>
            <a href={props.store.adWeb}>더보기</a>
          </h5>

          <button
            className="btn btn-primary"
            onClick={() => {
              setEditStore(!editStore);
            }}
          >
            정보 수정
          </button>
          {editStore && (
            <EditStoreModal
              storeName={props.store.storeName}
              storeType={props.store.storeType}
              adWeb={props.store.adWeb}
              storeId={props.store.id}
              setEditStore={setEditStore}
              show={() => {
                setEditStore(true);
              }}
              onHide={() => {
                setEditStore(false);
              }}
            />
          )}
         
          <button
           className="btn btn-primary"
            onClick={() => {
              setMenuAddModal(!menuAddModal);
            }}
          >
            메뉴 추가
          </button>

          <button
           className="btn btn-primary-del "
            onClick={() => {
              DeleteStore();
            }}
          >
            점포 제거
          </button>
          { menus.length === 0 ? null:<h4>Menu</h4>}
          
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
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <form onSubmit={onSubmitEdit}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h4>점포 수정</h4>
            <h6>수정하고싶은 정보 적어주세요</h6>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
      <div className="store-add-input">
          <input 
            type="text"
            onChange={(e) => {
              setEditStoreName(e.target.value);
            }}
            value={editStoreName}
            placeholder="점포이름수정"
          />
          </div>
          <div className="store-add-input">
          <input 
            onChange={(e) => {
              setEditStoreType(e.target.value);
            }}
            value={editStoreType}
            placeholder="점포타입수정"
          />
          </div>
          <div className="store-add-input">
          <input 
            onChange={(e) => {
              setEditAdWeb(e.target.value);
            }}
            value={editAdWeb}
            placeholder="인스타수정"
          />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button className="btn btn-primary" type="submit">
            
            정보 수정
          </button>
          <Button className="btn btn-secondary" onClick={props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
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
      props.onHide(); 
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
          <div className="store-add-input">
            <input
              onChange={(e) => {
                setMenuName(e.target.value);
              }}
              placeholder="메뉴이름"
              required
              pattern=".*\S+.*"
              title="This field is required"
            />
          </div>
          <div className="store-add-input">
            <input
              onChange={(e) => {
                setPrice(e.target.value);
              }}
              placeholder="가격"
            />
          </div>
          <div className="store-add-input">
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
            메뉴 추가
          </button>
          <Button className="btn btn-secondary" onClick={props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default Store;
