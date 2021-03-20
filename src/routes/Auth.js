import React, { useState } from "react";
import "../css/auth.css";
//점주 로그인

function Auth() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const onSocialLogin = async () => {};

  return (
    <div className="auth-main">
      <h1>Auth</h1>
      <form className="input-form">
        <input
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder= "이메일을 입력해주세요"
        />
        <input
          type="password"
          onChange={(e) => {
            setPw(e.target.value);
          }}
          placeholder= "비밀번호 입력해주세요"
        />
        <input classname = "btn-login" type="submit" value="로그인" />
      </form>
      <div className="auth-btn-SNS">
        <button className="btn-google">구글</button>
        <button className="btn-kakao">카카오</button>
      </div>
    </div>
  );
}

export default Auth;
