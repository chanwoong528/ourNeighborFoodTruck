import React from "react";

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
  const DeleteMenu = async () => {
    const ok = window.confirm("Are you sure you want to delete this menu?");
    if (ok) {
      await dbService.doc(`menus/${props.menu.id}`).delete();
    }
  };
  return (
    <div className ="menu-main">
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
        </>
      ) : null}
    </div>
  );
}
export default Menu;
