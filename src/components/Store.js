import React from 'react';



function Store(props) {
    console.log("123"+props.isOwner);
    return (
      
      <div>
        {props.isOwner ? (
         
         <>
          
            <h4>{props.store.storeName}</h4>
            <h4>{props.store.storeType}</h4>
            <h4>{props.store.adWeb}</h4>
            <h4>{props.store.userId}</h4>
            <button>정보수정</button>
          </>
        ) : (
        null
        )}
      </div>
    );
    
  }
  export default Store; 