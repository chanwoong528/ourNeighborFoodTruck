import React, { useState } from "react";
import { authService } from "../fbase";
// register as modal.

function Register() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const onSubmitCreateUser = async (e) => {
    
    await authService.createUserWithEmailAndPassword(email, pw);
  
  
};


  return (
    <div className="Register">
      <form className="input-form" onSubmit={onSubmitCreateUser}>
        <input
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="이메일을 입력해주세요"
        />
        <input
          type="password"
          onChange={(e) => {
            setPw(e.target.value);
          }}
          placeholder="비밀번호 입력해주세요"
        />
        <input className="btn-login" type="submit" value="회원가입" />
      </form>
    </div>
  );

  
}

export default Register;
