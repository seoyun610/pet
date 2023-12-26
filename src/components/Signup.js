import '../App.css';
import '../css/Signup.css';
import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [imgCheck, setImgCheck] = useState("N");
  const [imgFile, setImgFile] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [birth, setBirth] = useState("");
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");

  const handleImageClick = () => {
    const fileInput = document.querySelector('#imageFile');
    fileInput.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const imgFile = files[0];
      if (imgFile.type.indexOf("image") < 0) {
        alert("이미지 파일만 올려 주세요.");
        return;
      }
      setImgFile(imgFile);
      setImgCheck("Y");
    }
  };

  const handleRegister = async () => {
    if (imgCheck === "N") {
      alert("프로필 이미지를 등록하세요");
      return;
    }
    if (email === "") {
      alert("이메일 주소를 입력하세요.");
      return;
    }
    // 이메일 유효성 검사 로직 추가

    if (name === "") {
      alert("이름을 입력하세요.");
      return;
    }

    if (nickname === "") {
      alert("닉네임을 입력하세요.");
      return;
    }

    if (birth === "") {
      alert("생일을 입력하세요.");
      return;
    }

    if (password === "") {
      alert("암호를 입력하세요");
      return;
    }

    if (password1 === "") {
      alert("암호를 입력하세요");
      return;
    }

    if (password !== password1) {
      alert("입력된 암호를 확인하세요.");
      return;
    }

    // 암호 규칙 검사 로직 추가

    const formData = new FormData();
    formData.append("imgFile", imgFile);
    formData.append("email", email);
    formData.append("name", name);
    formData.append("nickname", nickname);
    formData.append("birth", birth);
    formData.append("password", password);

    try {
      const response = await axios.post('/member/signup', formData);
      const data = response.data;

      if (data.message === 'GOOD') {
        alert(decodeURIComponent(data.name) + '님, 회원 가입을 축하 드립니다.');
        document.location.href = '/pet/list?page=1';
      } else {
        alert("서버 장애로 회원 가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("error = ", error);
    }
  };

  const handleEmailCheck = async () => {
    try {
      const response = await axios.post('/member/emailCheck', email);
      const data = response.data;
      const emailCheckNotice = document.querySelector('#emailCheckNotice');
      if (data === '0') {
        emailCheckNotice.innerHTML = "사용 가능한 이메일입니다.";
      } else {
        emailCheckNotice.innerHTML = "이미 사용중인 이메일입니다.";
      }
    } catch (error) {
      console.error("error = ", error);
    }
  };

  const handleNicknameCheck = async () => {
    try {
      const response = await axios.post('/member/nicknameCheck', nickname);
      const data = response.data;
      const nicknameCheckNotice = document.querySelector('#nicknameCheckNotice');
      if (data === '1') {
        nicknameCheckNotice.innerHTML = '이미 사용하고 있는 닉네임입니다.';
      } else {
        nicknameCheckNotice.innerHTML = "사용 가능한 닉네임입니다.";
      }
    } catch (error) {
      console.error("error = ", error);
    }
  };

  return (
    <div className="container">
      <section className="row row-cols-2" id="signup">
        <div className="col head">
          <h3>회원가입</h3>
        </div>

        <div className="col body">
          <form id="RegistryForm" name="RegistryForm" method="POST" encType="multipart/form-data">
            <div className="imageZone" id="imageZone" onClick={handleImageClick}>
              프로필 이미지
              <input type="file" name="fileUpload" id="imageFile" style={{ display: 'none' }} onChange={handleFileChange} />
            </div>
            <input type="text" className="input_field" id="email" name="email" placeholder="여기에 이메일을 입력해 주세요" onChange={(e) => setEmail(e.target.value)} onBlur={handleEmailCheck}/>
            <br /><span id="emailCheckNotice"></span>
            <input type="text" className="input_field" id="nickname" name="nickname" placeholder="여기에 닉네임을 입력해 주세요" onChange={(e) => setNickname(e.target.value)} onBlur={handleNicknameCheck} />
            <input type="text" className="input_field" id="name" name="name" placeholder="여기에 이름을 입력해 주세요" onChange={(e) => setName(e.target.value)} />
            <br /><span id="handleNicknameCheck"></span>
            <input type="date" className="input_field" id="birth" name="birth" placeholder="여기에 생년월일을 입력해 주세요" onChange={(e) => setBirth(e.target.value)} />
            <input type="password" className="input_field" id="password" name="password" placeholder="여기에 패스워드를 입력해 주세요" onChange={(e) => setPassword(e.target.value)} />
            <input type="password" className="input_field" id="password1" name="password1" placeholder="여기에 패스워드를 한번 더 입력해 주세요" onChange={(e) => setPassword1(e.target.value)} />
            <input type="button" id="btnRegister" className="signup-btn" value="회원가입" onClick={handleRegister} />
          </form>
          <br /><br />
        </div>
      </section>
    </div>
  );
};

export default Signup;
