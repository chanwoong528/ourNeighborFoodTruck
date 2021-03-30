import React, { useState } from "react";
import { authService, firebaseInstance } from "../fbase";

import Register from "../components/Register";
import "../css/auth.css";

import google_login from "../img/login_google.png";
import facebook_login from "../img/login_facebook.png";
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
    try {
      await authService.signInWithEmailAndPassword(email, pw);
      alert("login sucessful");
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div className="auth-main">
      <h1>로그인</h1>
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

        <button className="btn-login" type="submit" name="login">
          로그인
        </button>
     
      
        <button
          type= "button"
          className="auth-btn-SNS"
          onClick={() => {
            setRegisterModal(!registerModal);
          }}
        >
          회원가입
        </button>
        
      
      </form>
      <div className="auth-btn-SNS">
        <img
          className="btn-google"
          src={google_login}
          name="google"
          onClick={onSocialLogin}
        />
      </div>
      <div className="auth-btn-SNS">
        <img
          className="btn-google"
          src={facebook_login}
          name="facebook"
          onClick={onSocialLogin}
        />
      </div>
       {/* <button className="btn-facebook" name="twitter" onClick={onSocialLogin}>
          트위터
        </button>   */}

      {registerModal ? (
        <Register
          show={() => setRegisterModal(true)}
          onHide={() => {
            setRegisterModal(false);
          }}
          setRegisterModal={setRegisterModal}
        ></Register>
      ) : null}
    </div>
  );
}

export default Auth;
