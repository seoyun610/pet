import '../App.css';
import '../css/Login.css';
import getCookie from './GetCookie';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../images/logo.jpg';
//import CryptoJS from 'crypto-js'; //AES 암호화 알고리즘으로 패스워드 쿠키를 암호화/복호화

const Login = () =>{

    //Ref 초기화
    const emailRef = useRef();
    const emailSaveRef = useRef('N');
    const passwordRef = useRef(); 
    const pwSaveRef = useRef('N');

    //state 초기화
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
 
    let emailCookie = getCookie('email');
    let emaliSaveCookie = getCookie('emailSave');    
    let passwordCookie = getCookie('password');
    let pwSaveCookie = getCookie('pwSave');
    let authkeyCookie = getCookie('authkey'); 

    //첫번째 렌더링 시 쿠키를 읽어 email, password,자동로그인 여부 확인한 후 쿠키에 저장된 email, password값을 input value에 넣어준다.
    useEffect(()=> {
        
        checBoxConfirm() },[]);

    const checBoxConfirm = async () => {

        //email 쿠키 존재 여부 확인 후 email 쿠키가 존재하면 email state에 할당
        if(emailCookie !== undefined && emaliSaveCookie === 'Y'){ //email 쿠키가 존재하면 
            setEmail(emailCookie); //email state에 email 쿠키값을 할당
        } else rememberEmailRef.current.checked = false;
        
        //패스워드 쿠키 존재 여부 확인 후 패스워드 쿠키가 존재하면 패스워드 state에 할당
        if(passwordCookie !== undefined && pwSaveCookie === 'Y'){ //패스워드 쿠키가 존재하면
            //Base64로 인코딩 된 password를 디코딩
            //const decrypt = CryptoJS.enc.Base64.parse(passwordCookie);
            //const hashData = decrypt.toString(CryptoJS.enc.Utf8);          
            setPassword(passwordCookie);  //password state에 디코팅 된 패스워드 쿠키 값 할당 
            rememberPasswordRef.current.checked = true; //password 기억 체크
        } else rememberPasswordRef.current.checked = false;
        
        //자동로그인 쿠키 존재 여부 확인 후 자동로그인 쿠키가 존재하면 
        if(authkeyCookie !== undefined){ //자동로그인 쿠키가 존재하면 autoLogin=PASS 쿼리를 포함하여 서버로 비동기 전송
     
         let formData = new FormData();
         formData.append("authkey",authkeyCookie);
         await fetch('/restapi/loginCheck?autoLogin=PASS',{
            method : 'POST',
            body : formData
         }).then((response) => response.json())
           .then((data) => {
             if(data.message === 'good'){             
                    document.location.href='/board/list?page=1';  
            } else {
               alert("시스템 장애로 자동 로그인이 실패 했습니다.");       
            }        
          }).catch((error)=> { console.log("error = " + error);} );
      }   

    }

    //아이디, 패스워드 검증 이후 아이디, 패스워드 쿠키 등록
    const cookieManage = (username, role, authkey, accessToken, refreshToken) => { 

        //email 쿠키 등록
        document.cookie = 'email=' + email + ';path=/; expires=Sun, 31 Dec 2023 23:59:59 GMT';       
        if(rememberEmailRef.current.checked) 
                document.cookie = 'emailSave=Y;path=/; expires=Sun, 31 Dec 2023 23:59:59 GMT';  
        else  document.cookie = 'emailSave=Y;path=/; max-age=0';             

        //password 쿠키 등록
        document.cookie = 'password=' + password + ';path=/; expires=Sun, 31 Dec 2023 23:59:59 GMT';
        if(rememberPasswordRef.current.checked) 
                document.cookie = 'pwSave=Y;path=/; expires=Sun, 31 Dec 2023 23:59:59 GMT';     
        else document.cookie = 'pwSave=Y;path=/; max-age=0';              
     
    } 
    
    //REST API 서버와의 비동기 통신으로 아이/패스워드 검증
    const loginCheck = async () =>{
        if(email === null || email ===''){
            alert('아이디를 입력하세요.');            
            emailRef.current.focus();
            return false;
        }
        if(password === null || password === ''){
            alert('패스워드를 입력하세요');
            passwordRef.current.focus();
            return false;
        }

        let formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
 
        //JWT 로그인
        if(jwtRef.current.checked){
 
            await fetch('http://localhost:8080/restapi/loginCheck?autoLogin=JWTNew',{
                method : 'POST',
                body : formData
                
            }).then((response) => response.json())
            .then((data) => {
                if(data.message === 'JWT'){   
                    cookieManage(data.username, data.role, data.authkey, data.accessToken, data.refreshToken);
                    document.location.href='/board/list?page=1';   
                } else if(data.message === 'ID_NOT_FOUND') {
                        setMessage('존재하지 않는 이메일입니다.');
                } else if(data.message === 'PASSWORD_NOT_FOUND') {
                        setMessage('잘못된 패스워드입니다.');
                } else {
                    console.log("message = " + data.message);
                    alert("시스템 장애로 로그인이 실패 했습니다.");       
                }        
            }).catch((error)=> { console.log("error = " + error);} );    

            
        }else { //일반 로그인(email,password,자동로그인 인증)
            await fetch('http://localhost:8080/restapi/loginCheck?autoLogin=NEW',{
                method : 'POST',
                body : formData
            }).then((response) => response.json())
            .then((data) => {
                if(data.message === 'good'){   
                    cookieManage(data.username, data.role, data.authkey);
                    document.location.href='/board/list?page=1';   
                } else if(data.message === 'ID_NOT_FOUND') {
                        setMessage('존재하지 않는 이메일입니다.');
                } else if(data.message === 'PASSWORD_NOT_FOUND') {
                        setMessage('잘못된 패스워드입니다.');
                } else {
                    console.log("message = " + data.message);
                    alert("시스템 장애로 로그인이 실패 했습니다.");       
                }        
            }).catch((error)=> { console.log("error = " + error);} );    
        }
    }  
        
    //패스워드 입력창에서 엔터를 눌렀을때 로그인
    const onKeyDown = (e) => {
            if(e.key === 'Enter'){
                loginCheck();
            }    
        };
    
    return(
        <div className='main'>
            <div className='login'>
                <input type="text" ref={emailRef} value={email} className="email" 
                        onChange={(e) => setEmail(e.target.value)} placeholder="이메일을 입력하세요." />
                <input type="password" ref={passwordRef} value={password} className="memberpasswd"  
                        onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호를 입력하세요." onKeyDown={onKeyDown}/>
                <p style={{color: 'red',textAlign:'center'}}>{message}</p> 
                <br />
                <input type="button" className="login_btn" value="로그인" onClick={loginCheck} />  
                <div className="bottomText">
                        사용자가 아니면 ▶<Link to="/member/signup">여기</Link>를 눌러 등록을 해주세요.<br /><br />
                    [<a href="/member/searchID">아이디</a> | <a href="/member/searchPassword" >패스워드</a>  찾기]  <br /><br />    
                </div>
            </div> 
        </div>    
    );
};

export default Login;