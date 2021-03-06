import React, { useState } from "react";
import { authService } from "../fbase";
import { Modal, Button } from "react-bootstrap";

// register as modal.

function Register(props) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const onSubmitCreateUser = async (e) => {
    try {
      await authService.createUserWithEmailAndPassword(email, pw);
      alert("회원등록 완료"); 
    } catch (err) {
      alert(err);
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <form className="input-form" onSubmit={onSubmitCreateUser}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">회원가입</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="store-add-input">
          <input
            type="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="이메일을 입력해주세요"
          />
          </div>
          <div className="store-add-input">
          <input
            type="password"
            onChange={(e) => {
              setPw(e.target.value);
            }}
            placeholder="비밀번호 입력해주세요"
          />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="submit" class="btn btn-primary">
            회원가입
          </button>
          <Button
            onClick={() => {
              props.setRegisterModal(false);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default Register;
