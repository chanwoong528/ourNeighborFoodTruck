import React, { useState } from "react";
import { Modal, Button, Card } from "react-bootstrap";
import { dbService } from "../fbase";

import "../css/menu.css";
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
          <Card
            className="mr-2 mt-2"
            border="warning"
            style={{ width: "9rem", display: "inline-block" }}
          >
            <Card.Body>
              <h4> {props.menu.menuName}</h4>
              <h6> {props.menu.price}</h6>
              <h6>{props.menu.detail} </h6>

              <button
                className="btn btn-primary-menu"
                onClick={() => {
                  setEditMenu(!editMenu);
                }}
              >
                메뉴 수정
              </button>
              <button
                className="btn btn-primary-menu-del"
                onClick={() => {
                  DeleteMenu();
                }}
              >
                메뉴 제거
              </button>
            </Card.Body>
          </Card>

          {editMenu && (
            <EditMenuModal
              menuName={props.menu.menuName}
              price={props.menu.price}
              detail={props.menu.detail}
              menuId={props.menu.id}
              setEditMenu={setEditMenu}
              show={() => {
                setEditMenu(true);
              }}
              onHide={() => {
                setEditMenu(false);
              }}
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
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <form onSubmit={onSubmitEdit}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h4>메뉴 수정</h4>
            <h6>수정하고싶은 정보 적어주세요</h6>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="store-add-input">
            <input
              type="text"
              onChange={(e) => {
                setEditMenuName(e.target.value);
              }}
              value={editMenuName}
              placeholder="메뉴이름수정"
            />
          </div>
          <div className="store-add-input">
            <input
              onChange={(e) => {
                setEditPrice(e.target.value);
              }}
              value={editPrice}
              placeholder="가격 수정"
            />
          </div>
          <div className="store-add-input">
            <input
              onChange={(e) => {
                setEditDetail(e.target.value);
              }}
              value={editDetail}
              placeholder="메뉴 설명 수정"
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

export default Menu;
