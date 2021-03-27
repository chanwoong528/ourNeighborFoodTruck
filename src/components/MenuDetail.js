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
          <Card className="display-menu mr-2 mt-2 scroll" border="warning" style={{ width: "12em", display:"inline-block" }}>
            <Card.Body>
              <h5 style ={{fontSize:"1em"}}>{menu.menuName} </h5>
              <h5 style ={{fontSize:"0.8em"}}>{menu.price} </h5>
              <h5 style ={{fontSize:"0.7em"}}>{menu.detail} </h5>
            </Card.Body>
          </Card>
          
        </>
      ))}
    </>
  );
}
export default MenuDetail;
