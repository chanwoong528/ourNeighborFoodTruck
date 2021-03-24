import React, { useState } from "react";
import { authService, firebaseInstance } from "../fbase";

import Register from "../components/Register";
import "../css/auth.css";
//점주 로그인

function Auth() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [registerModal, setRegisterModal] = useState(false);

  const onSocialLogin = async (e) => {
    const {
      target: { name },
    } = e;
    let provider;
    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === "facebook") {
      provider = new firebaseInstance.auth.FacebookAuthProvider();
    }
    await authService.signInWithPopup(provider);
  };

  const onSubmitLogin = async (e) => {
    e.preventDefault();

    await authService.signInWithEmailAndPassword(email, pw);
  };
  return (
    <div className="auth-main">
      <h1>Auth</h1>
      <form className="input-form" onSubmit={onSubmitLogin}>
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
        <input className="btn-login" type="submit" value="로그인" />
      </form>
      <div className="auth-btn-SNS">
        <button className="btn-google" name="google" onClick={onSocialLogin}>
          구글
        </button>
        <button className="btn-facebook" name="facebook" onClick={onSocialLogin}>
          페이스북
        </button>
        <button
          onClick={() => {
            setRegisterModal(!registerModal);
          }}
        >
          회원가입
        </button>
      </div>
      {registerModal ? <Register></Register> : null}
    </div>
  );
}

export default Auth;
