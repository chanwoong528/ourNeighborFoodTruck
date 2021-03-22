import React, { useEffect, useState } from "react";

import firebase, { authService, dbService } from "../fbase";

import "../css/editprofile.css"
// 상호명 && 음식 업종 && 인스타그램 url
//  3 field {
//     NameStore: 찬웅 음식, => 동균 음식
//     StoreType: 이탈리안,  dropdown
//     AdWeb: www.insta.com/chanFood, input : blank
//   }

function EditProfile(props) {
  const [storeName, setStoreName] = useState("");
  const [storeType, setStoreType] = useState("");
  const [adWeb, setAdWeb] = useState("");

  const onSubmitStore = async (e) => {
    e.preventDefault();
    await dbService.collection(`stores`).add({
      storeName,
      storeType,
      adWeb,
      userId: props.userObj.uid,
    });
  };

  return (
    <div className="edit-main">
      <h4>Create</h4>
      <form onSubmit={onSubmitStore}>
        <div>
          <input
            onChange={(e) => {
              setStoreName(e.target.value);
            }}
            placeholder="상호명"
          />
        </div>
        <div>
          <input
            onChange={(e) => {
              setStoreType(e.target.value);
            }}
            placeholder="음식카테고리"
          />
        </div>
        <div>
          <input
            onChange={(e) => {
              setAdWeb(e.target.value);
            }}
            placeholder="인스타url"
          />
          <div>
            <div>
              <input type="submit" value="등록 " />
            </div>
          </div>
        </div>
      </form>
     
    </div>
  );
}
export default EditProfile;
