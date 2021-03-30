import React, { useState, useEffect } from "react";

import "../css/map.css";

const { kakao } = window;

function MarkerSearch (props) {
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
    markerSearch();
    function markerSearch() {
        if (!place || place == null || place == "") {
          console.log("place doesn't exist");
          return;
        }
        try {
          let pos = props.storeNames[place];
          if (pos == undefined) { return; }
          console.log("pos", place, pos);
          props.m.setCenter(pos);
  
        } catch (err) {
          console.log("markerSearch():", err);
        }
      }
  }, [place]);

  return (
    <div>
        <form className="form-outline" onSubmit={handleSubmit}>
          <input
            placeholder="상호명을 입력해주세요"
            onChange={onChange}
            value={inputText}
          />
          <button type="submit">찾기</button>
        </form>
      </div>
  );
}

export default MarkerSearch;