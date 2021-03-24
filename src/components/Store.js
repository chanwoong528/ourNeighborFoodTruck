import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";

import Menu from "./Menu";

function Store(props) {
  const [menus, setMenus] = useState([]);

  const [menuAddModal, setMenuAddModal] = useState(false);

  const DeleteStore = async () => {
    const ok = window.confirm("Are you sure you want to delete this store?");
    if (ok) {
      await dbService.doc(`stores/${props.store.id}`).delete();
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
          <h6>{props.store.adWeb/*이거 링크 걸어줄거임*/}</h6>

          <button>정보 수정</button>
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
              key={menu.id}
              menu={menu}
              store={props.store}
              isStore={menu.storeId === props.store.id}
            ></Menu>
          ))}
        </>
      ) : null}

      {menuAddModal ? (
        <MenuAddModal store={props.store} userObj={props.userObj} />
      ) : null}
    </div>
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
    <div className="menu-add-main">
      <h4>Menu Add</h4>
      <form onSubmit={onSubmitMenu}>
        <input
          onChange={(e) => {
            setMenuName(e.target.value);
          }}
          placeholder="메뉴이름"
        />

        <input
          onChange={(e) => {
            setPrice(e.target.value);
          }}
          placeholder="가격"
        />

        <input
          onChange={(e) => {
            setDetail(e.target.value);
          }}
          placeholder="detail"
        />

        <input type="submit" value="등록 " />
      </form>
    </div>
  );
}

export default Store;
