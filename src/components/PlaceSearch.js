import React, { useState, useEffect } from "react";

import "../css/searchbar.css"

const { kakao } = window;



function PlaceSearch(props) {
  //
  const [inputText, setInputText] = useState("");
  const [place, setPlace] = useState("");

  const onChange = (e) => {
    
    setInputText(e.target.value);
    // console.log(inputText);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPlace(inputText);
    console.log(inputText);
    setInputText("");
  }


  useEffect(() => {
    var places = new kakao.maps.services.Places();

    places.keywordSearch(place, placesSearchCB);

    function placesSearchCB(data, status, pagination) {
        if (status === kakao.maps.services.Status.OK) {
          console.log("OK, ", place);
          let bounds = new kakao.maps.LatLngBounds();
  
          for (let i = 0; i < data.length; i++) {
            // displayMarker(data[i]);
            bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
          }
  
          props.map.setBounds(bounds);
        }
      }
    

  }, [place]);

  return (
    <>
      <form className="form-outline" onSubmit={handleSubmit}>
       <div className ="searchbar">
        <input
          placeholder="주소를 입력해주세요"
          onChange={onChange}
          value={inputText}
        />
        <button type="submit">찾기</button>
        </div>
      </form>
    </>
  );
}

export default PlaceSearch;