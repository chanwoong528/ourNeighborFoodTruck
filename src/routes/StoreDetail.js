import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";
import { Card } from "react-bootstrap";
import { useParams } from "react-router";

import MenuDetail from "../components/MenuDetail";

import "../css/showstore.css"


function StoreDetail() {
  let { id } = useParams();

  const [stores, setStores] = useState([]);

  console.log("store", stores);

  useEffect(() => {
    dbService
      .collection("stores")
      .where("userId", "==", id)
      .onSnapshot((snapshot) => {
        const storeArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStores(storeArray);
      });
  }, []);
  return (
    <>
      {stores.map((store) => (
        <>
          

          <Card className ="display-store text-center" style={{ width: "90%",margin:"auto " }}>
            <Card.Body>
              <Card.Title><h2>{store.storeName}</h2> </Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                <h6>{store.storeType}</h6>
              </Card.Subtitle>
              <Card.Text>
                
               <h6> <a href={store.adWeb}> {store.storeName}' SNS </a></h6>
              </Card.Text>
              {
                <MenuDetail storeId={store.id} />}

            </Card.Body>
            
          </Card>
        </>
      ))}
    </>
  );
}

export default StoreDetail;
