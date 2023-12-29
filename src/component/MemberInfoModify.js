import axios from 'axios';
import '../App.css';
import {useState, useEffect, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {Link} from 'react-router-dom';
import Logo from '../images/logo.jpg';
import getCookie from './GetCookie';

const MemberInfoModify = () => {

    //쿠키 가져 오기
    const emailCookie = getCookie('email');
    //사용자 정보 
    const [member, setMember] = useState({}); 
    const [hobbies, setHobbies] = useState('');
    
    const navigate = useNavigate();
    
    useEffect(()=> {

        const fetchData = async () => {
            const member = await axios.get(`http://localhost:8080/restapi/memberInfo?&email=${emailCookie}`);
            setMember(member.data); 
            setHobbies(member.data.hobby);        
        }
        fetchData(); 
 
    },[emailCookie]);

    //우편번호 입력
    const handleZipcode = useCallback((e)=> {
        setMember({"zipcode":e.target.value});
    },[])


    //자기 소개 입력
    const handleDescription = useCallback((e)=> {
        setMember({"description":e.target.value});
    },[])

    const goBack = () => {
        navigate(-1);
    }

    return(
        <div>
            <div>
		        <img id="topBanner" src={Logo} alt="서울기술교육센터" />	
	        </div>

            <div className="main">
                <h1>회원 기본 정보 수정</h1><br/>
        
                <div className="WriteForm">                    
                    <br/><br/>
                        <input type="file" name="fileUpload" id="imageFile" style={{"display":"none"}} />
                        <span>이미지 수정을 원하시면 화면을 클릭해 주세요.</span>
                        <div className="imageZone" id="imageZone"><img src={"http://localhost:8080/profile/" + member.stored_filename} style={{"display":"block","width":"500px","height":"auto","margin":"auto"}} alt="회원사진"/></div>
                        <input type="text" className="input_field" id="username" name="username" value={member.username} readOnly />
                        <div style={{"width":"90%","textAlign":"left","position":"relative","left":"35px","borderBottom":"2px solid #adadad","margin":"10px","padding":"10px"}}>
                            성별 : 
                            <label><input type="radio" name="gender" value="남성" checked={member.gender === '남성'} />남성</label>
                            <label><input type="radio" name="gender" value="여성" checked={member.gender === '여성'} />여성</label><br/>
                            취미 : 
                            <label><input type="checkbox" name="hobby" value="음악감상" checked={hobbies.includes('음악감상')}/>음악감상</label>
                            <label><input type="checkbox" name="hobby" value="영화보기" checked={hobbies.includes('영화보기')}/>영화보기</label>
                            <label><input type="checkbox" name="hobby" value="스포츠" checked={hobbies.includes('스포츠')}/>스포츠</label><br/>
                            직업 : 
                            <select name="job">
                                <option value="회사원" selected={member.job === '회사원'}>회사원</option>
                                <option value="공무원" selected={member.job === '공무원'}>공무원</option>
                                <option value="자영업" selected={member.job === '자영업'}>자영업</option>
                            </select>
                            <br/>
                        </div>
                        <input type="text" id="zipcode" className="input_field" name="zipcode" 
                            value={member.zipcode} onChange={handleZipcode} />
                        <input type="text" id="address" className="input_field" name="address" value={member.address}/>
                        <input type="text" id="telno" name="telno" className="input_field" value={member.telno} />
                        <input type="text" id="nickname" name="nickname" className="input_field" value={member.nickname} />

                        <br/>
                        <textarea className="input_content" id="description" cols="100" rows="500" name="description" 
                            value={member.description} onClick={handleDescription}>
                        </textarea><br/>
                        <input type="button" id="btnModify" className="btn_modify" value="수정" />
                        <input type="button" id="btnCancel" className="btn_cancel" value="취소" onClick={goBack}/>                                    
                </div>
            </div>
        </div>
    )

}

export default MemberInfoModify;