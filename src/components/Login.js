import React, { useState, useRef, useEffect } from 'react';
import '../App.css';
import '../css/Login.css';
import getCookie from './GetCookie';
import { Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const rememberEmailRef = useRef();
  const rememberPasswordRef = useRef();
  const rememberMeRef = useRef();
  const rememberRef = useRef(null);

  useEffect(() => {
    const emailCookie = getCookie('email');
    const passwordCookie = getCookie('password');
    const authkeyCookie = getCookie('authkey');

    if (emailCookie) {
      rememberEmailRef.current.checked = true;
      setEmail(emailCookie);
    } else {
      rememberEmailRef.current.checked = false;
    }

    if (passwordCookie) {
      rememberPasswordRef.current.checked = true;
      const decrypt = CryptoJS.enc.Base64.parse(passwordCookie);
      const hashData = decrypt.toString(CryptoJS.enc.Utf8);
      setPassword(hashData);
    } else {
      rememberPasswordRef.current.checked = false;
    }

    if (authkeyCookie) {
      const formData = new FormData();
      formData.append('authkey', authkeyCookie);

      axios.post('/member/login?autologin=PASS', formData)
        .then((response) => {
          const data = response.data;
          if (data.message === 'GOOD') {
            document.location.href = '/pet/list?page=1';
          } else {
            alert('시스템 장애로 자동 로그인이 실패했습니다.');
          }
        })
        .catch((error) => {
          console.log('error = ' + error);
        });
    }
  }, []);

  const loginCheck = async () => {
    if (email === '') {
      alert('이메일을 입력하세요');
      email.focus();
      return false;
    }

    if (password === '') {
      alert('암호를 입력하세요');
      password.focus();
      return false;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      const response = await axios.post('/member/login?autologin=NEW', formData);
      const data = response.data;
      if (data.message === 'GOOD') {
        cookieManage(email, password, data.authkey);
        document.location.href = '/pet/community?page=1';
      } else if (data.message === 'ID_NOT_FOUND') {
        setMsg('존재하지 않는 이메일입니다.');
      } else if (data.message === 'PASSWORD_NOT_FOUND') {
        setMsg('잘못된 패스워드입니다.');
      } else {
        alert('시스템 장애로 로그인이 실패했습니다.');
      }
    } catch (error) {
      console.log('error = ' + error);
    }
  };

  const checkRememberEmail = () => {
    if (rememberEmailRef.current.checked)
      rememberMeRef.current.checked = false;
  };

  const checkRememberPassword = () => {
    if (rememberPasswordRef.current.checked)
      rememberMeRef.current.checked = false;
  };

  const checkRememberMe = () => {
    if (rememberMeRef.current.checked) {
      rememberEmailRef.current.checked = false;
      rememberPasswordRef.current.checked = false;
    }
  };

  const cookieManage = (email, password, authkey) => {
    if (rememberEmailRef.current.checked) {
      document.cookie = `email=${email}; path=/; expires=Sun, 31 Dec 2023 23:59:59 GMT`;
    } else {
      document.cookie = `email=${email}; path=/; max-age=0`;
    }

    if (rememberRef.current.checked) {
      const key = CryptoJS.enc.Utf8.parse(password);
      const base64 = CryptoJS.enc.Base64.stringify(key);
      password = base64;
      document.cookie = `password=${password}; path=/; expires=Sun, 31 Dec 2023 23:59:59 GMT`;
    } else {
      document.cookie = `password=${password}; path=/; max-age=0`;
    }

    if (rememberMeRef.current.checked) {
      document.cookie = `authkey=${authkey}; path=/; expires=Sun, 31 Dec 2023 23:59:59 GMT`;
    } else {
      document.cookie = `authkey=${authkey}; path=/; max=0`;
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) loginCheck();
  };

  return (
    <div className="container" align="center">
      <div className="row row-cols-2" id="login">
        <div className="col head">
          <h3>로그인</h3>
        </div>
        <div className="col body">
          <form name="loginForm" id="loginForm" method="post">
            <input
              type="text"
              name="email"
              className="email"
              id="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={handleEmailChange}
            />
            <input
              type="password"
              name="password"
              className="password"
              id="password"
              placeholder="패스워드를 입력하세요"
              value={password}
              onChange={handlePasswordChange}
              onKeyDown={handleKeyPress}
            />
            <p id="msg" style={{ color: 'red', textAlign: 'center' }}>{msg}</p>
            <br />
            <input
              type="checkbox"
              id="rememberEmail"
              onClick={checkRememberEmail}
              ref={rememberEmailRef}
            />
            이메일 기억
            <input
              type="checkbox"
              id="rememberPassword"
              onClick={checkRememberPassword}
              ref={rememberPasswordRef}
            />
            패스워드 기억
            <input
              type="checkbox"
              id="rememberMe"
              name="remember-me"
              onClick={checkRememberMe}
              ref={rememberMeRef}
            />
            자동 로그인
            <br />
            <br />
            <input
              type="button"
              id="btn_login"
              className="btn_login"
              value="로그인"
              onClick={loginCheck}
            />
          </form>
          <Link to="/signup">여기</Link>를 눌러 등록을 해주세요.
          <br />
          <br />
          [<Link to="/searchID">아이디</Link> |
          <Link to="/searchPassword">패스워드</Link> 찾기]
          <br />
          <br />
        </div>
      </div>
    </div>
  );
}

export default Login;
