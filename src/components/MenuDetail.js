import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";
import { Card } from "react-bootstrap";

import "../css/showstore.css"

function MenuDetail(props) {
  const [menus, setMenus] = useState([]);
  console.log(menus);
  useEffect(() => {
    dbService
      .collection("menus")
      .where("storeId", "==", props.storeId)
      .onSnapshot((snapshot) => {
        const menuArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMenus(menuArray);
      });
  }, []);

  return (
    <>
      <div>menudetail</div>
      {menus.map((menu) => (
        <>
          <Card className="display-menu mr-2 mt-2" border="warning" style={{ width: "10rem", display:"inline-block" }}>
            <Card.Body>
              <h4>{menu.menuName} </h4>
              <h4>{menu.price} </h4>
              <h4>{menu.detail} </h4>
            </Card.Body>
          </Card>
          
        </>
      ))}
    </>
  );
}
export default MenuDetail;
