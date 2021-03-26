import React, { useState } from "react";

import { dbService } from "../fbase";
// Create db and edit each category
//  menu in DB has 3 Field:
//  {
//      Title: 김치 볶음밥,
//      Price : 10000원,
//      Description: 특제소스와 함께 만든 김치 볶은밥 (can be null);
//      storeId:storeId
//      userId :userId

//  }
function Menu(props) {
  const [editMenu, setEditMenu] = useState(false);

  const DeleteMenu = async () => {
    const ok = window.confirm("Are you sure you want to delete this menu?");
    if (ok) {
      await dbService.doc(`menus/${props.menu.id}`).delete();
    }
  };
  return (
    <div className="menu-main">
      {props.isStore ? (
        <>
          <h2>Menu</h2>
          <h4>{props.menu.menuName}</h4>
          <h4>{props.menu.price}</h4>
          <h4>{props.menu.detail}</h4>
          <button
            onClick={() => {
              DeleteMenu();
            }}
          >
            메뉴 제거
          </button>
          <button
            onClick={() => {
              setEditMenu(!editMenu);
            }}
          >
            메뉴 수정
          </button>
          {editMenu && (
            <EditMenuModal
              menuName={props.menu.menuName}
              price={props.menu.price}
              detail={props.menu.detail}
              menuId={props.menu.id}
              setEditMenu ={setEditMenu}
            />
          )}
        </>
      ) : null}
    </div>
  );
}

function EditMenuModal(props) {
  const [editMenuName, setEditMenuName] = useState(props.menuName);
  const [editPrice, setEditPrice] = useState(props.price);
  const [editDetail, setEditDetail] = useState(props.detail);

  async function onSubmitEdit(e) {
    e.preventDefault();

    console.log(editMenuName, props.menuName);
    await dbService.doc(`menus/${props.menuId}`).update({
      menuName: editMenuName,
      price: editPrice,
      detail: editDetail,
    });
    props.setEditMenu(false);
  }
  return (
    <form onSubmit={onSubmitEdit}>
      <input
        type="text"
        onChange={(e) => {
          setEditMenuName(e.target.value);
        }}
        value={editMenuName}
        placeholder="메뉴이름수정"
      />
      <input
        onChange={(e) => {
          setEditPrice(e.target.value);
        }}
        value={editPrice}
        placeholder="가격 수정"
      />
      <input
        onChange={(e) => {
          setEditDetail(e.target.value);
        }}
        value={editDetail}
        placeholder="메뉴 설명 수정"
      />

      <button type="submit"> 정보 수정 </button>
    </form>
  );
}

export default Menu;
