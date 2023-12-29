import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import '../css/ViewBoard.css';
import Logo from '../images/logo.jpg';
import getCookie from './GetCookie';

const MemberInfo = () => {

    //쿠키 가져 오기
    const emailCookie = getCookie('email');
    //사용자 정보 
    const [member, setMember] = useState({}); 

   
    useEffect(()=> {

        const fetchData = async () => {
            const member = await axios.get(`http://localhost:8080/restapi/memberInfo?&email=${emailCookie}`);
            setMember(member.data);            
        }
        fetchData();        

    },[emailCookie]);

    return (
        <div>
            <div>
		        <img id="topBanner" src={Logo} alt="서울기술교육센터" />	
	        </div>
            <div className='main'>
                    <h1>회원 정보 보기</h1>
                <br />
                <div className="boardView">
                    <div className="imgView" style={{"width":"80%","height":"auto","margin":"auto","padding":"20px","border":"none"}}><img src={"http://localhost:8080/profile/" + member.stored_filename} style={{"display":"block","width":"500px","height":"auto","margin":"auto"}} alt="사용자"/></div>
                    <div className="field">이메일(아이디) : {member.email}</div>
                    <div className="field">이름 : {member.username}</div>
                    <div className="field">성별 : {member.gender}</div>
                    <div className="field">직업 : {member.job}</div>
                    <div className="field">취미 : {member.hobby}</div>
                    <div className="field">전화번호 : {member.telno}</div>
                    <div className="field">별명 : {member.nickname}</div>
                    <div className="content">{member.description}</div>
                </div>

                <br />
                <div className="bottom_menu" align="center">
                    &nbsp;&nbsp;
                    <a href="/board/list?page=1">처음으로</a> &nbsp;&nbsp;
                    <Link to="/member/memberInfoModify">기본정보 변경</Link> &nbsp;&nbsp;
                    <Link to="/member/memberPasswordModify">패스워드 변경</Link> &nbsp;&nbsp;
                    <Link>회원탈퇴</Link> &nbsp;&nbsp;
                </div>
                <br/><br/>

            </div>
        </div>    
    )

}

export default MemberInfo;