import Logo from '../images/logo.jpg';
import '../App.css';
import { useState, useRef} from 'react';


const Signup = () => {

    const imageZone = {
        border: '2px solid #92AAB0',
        width: '70%',
        height: 'auto',
        color: '#92AAB0',
        textAlign: 'center',
        verticalAlign: 'middle',
        margin: 'auto',
        padding: '10px 10px',
        fontSize: '200%'                 
    }
    
    const addrSearchStyle = {
      width: '80%',
      border: 'none',
      borderBottom: '2px solid #adadad',
      margin: '5px',
      padding: '10px 10px',
      outline: 'none',
      color: '#636e72',
      fontSize: '16px',
      height: '25px',
      background: 'none'
    }

   //회원 등록 정보 - state 등록
    const [email, setEmail] = useState('');
    const emailRef = useRef();
    const [message, setMessage] = useState('');
    const emailChange = async (e) =>{
        setEmail(e.target.value);
        let formData = new FormData();
        formData.append("email",emailRef.current.value);
        await fetch('http://localhost:8080/restapi/idCheck',{method : 'POST', body: formData})
                .then((response) => response.json())
                .then((data) => {
                    if(data.status === 'good') setMessage('사용 가능한 이메일입니다.');
                        else setMessage('이미 사용중인 이메일입니다.');                        
                }).catch((error)=> { console.log("error = " + error);} );     
    }

    const [username, setUsername] = useState('');
    const usernameRef = useRef();
    const [password, setPassword] = useState('');
    const [password1, setPassword1] = useState('');
    const passwordRef = useRef();
    const password1Ref = useRef();
    const [gender, setGender] = useState('');
    const genderValue = gender;

    //직업 체크박스 
    const [disabled, setDisabled] = useState(false);
    const data = [
        {id: 0, title: '음악감상'},
        {id: 1, title: '영화보기'},
        {id: 2, title: '스포츠'},
        ];
    // 체크된 취미 아이템을 담을 배열 --> 취미값이 담기는 배열
    const [checkItems, setCheckItems] = useState([]);

    // 체크박스 단일 선택
    const handleSingleCheck = (checked, title) => {
        if (checked) {
        // 단일 선택 시 체크된 아이템을 배열에 추가
        setCheckItems(prev => [...prev, title]);
        } else {
        // 단일 선택 해제 시 체크된 아이템을 제외한 배열 (필터)
        setCheckItems(checkItems.filter((el) => el !== title));
        }
    };
    // 체크박스 전체 선택
    const handleAllCheck = (checked) => {
        if(checked) {
        // 전체 선택 클릭 시 데이터의 모든 아이템(id)를 담은 배열로 checkItems 상태 업데이트
        const idArray = [];
        data.forEach((el) => idArray.push(el.title));
        setCheckItems(idArray);
        }
        else {
        // 전체 선택 해제 시 checkItems 를 빈 배열로 상태 업데이트
        setCheckItems([]);
        }
    }  

    const [job, setJob] = useState('');
    const jobRef = useState('');
    const [telno, setTelno] = useState('');
    const telnoRef = useRef();
    const [nickname, setNickname] = useState('');
    const nicknameRef = useRef();
    const FromSocial = "N";
    const [description, setDescription] = useState('');
    const descriptionRef = useRef();

    //이미지 저장용 state
    const [imgProfile, setImgProfile] = useState('');
    //이미지 등록 여부 확인
    const [imgCheck, setImgCheck] = useState("N");

    //이미지 미리 보기
    const [imgFile, setImgFile] = useState("");
    const imgZoneRef = useRef();
    const fileEventRef = useRef();
    const imgZoneClick = (e) => { fileEventRef.current.click(e); }
    const fileEventChange = (e) => { 
        showImage(e.target.files[0]); 
        setImgProfile(e.target.files[0]);
    }
    const showImage = (files) => {
        const reader = new FileReader(); //new 연산자를 통해서 FileReader() 객체를 reader가 참조(상속)
        reader.readAsDataURL(files);
        reader.onload = () => { setImgFile(reader.result); };        
        setImgCheck("Y");
    }    
    
    const handleRegister = async () => {

        //유효성 검사
		if(imgCheck === 'N') { alert("프로필 이미지를 등록하세요"); return false; }
		if(emailRef.current.value === '') { alert("이메일을 입력하세요."); emailRef.current.focus();  return false; }
		if(usernameRef.current.value === '') { alert("이름을 입력하세요."); usernameRef.current.focus(); return false; }
	
		const Pass = passwordRef.current.value;
		const Pass1 = password1Ref.current.value;
		if(Pass === '') { alert("암호를 입력하세요."); passwordRef.current.focus(); return false; }
		if(Pass1 === '') { alert("암호를 입력하세요."); password1Ref.current.focus(); return false; }
		if(Pass !== Pass1) 
			{ alert("입력된 비밀번호를 확인하세요"); password1Ref.current.focus(); return false; }
		
		// 암호유효성 검사
		//자바스크립트의 정규식(Regular Expression)
		let num = Pass.search(/[0-9]/g); // 0-9까지의 숫자가 들어 있는지 검색. 검색이 안되면 -1을 리턴
	 	let eng = Pass.search(/[a-z]/ig); //i : 알파벳 대소문자 구분 없이... 
	 	let spe = Pass.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);	//특수문자가 포함되어 있는가 검색
		if(Pass.length < 8 || Pass.length > 20) { alert("암호는 8자리 ~ 20자리 이내로 입력해주세요."); return false; }
		else if(Pass.search(/\s/) !== -1){ alert("암호는 공백 없이 입력해주세요."); return false; }
		else if(num < 0 || eng < 0 || spe < 0 ){ alert("암호는 영문,숫자,특수문자를 혼합하여 입력해주세요."); return false; }
			
        if(!Boolean(genderValue)) { alert("성별을 선택하세요."); return false; }
		if(checkItems.length === 0) { alert("취미를 선택하세요."); return false; }
		if(jobRef.current.value === 'description') { alert("직업을 선택하세요."); return false; }
        if(telnoRef.current.value === '') { alert("전화번호를 입력하세요."); telnoRef.current.focus(); return false; }
        //전화번호 문자열 정리
		const beforeTelno = telnoRef.current.value;
        const afterTelno = beforeTelno.replace(/-/gi,"").replace(/ /gi,"").trim();
        telnoRef.current.value = afterTelno;
        if(nicknameRef.current.value === '') { alert("별명을 입력하세요."); nicknameRef.current.focus(); return false; }
		if(descriptionRef.current.value ==='') { alert("자기소개를 입력하세요."); descriptionRef.current.focus(); return false; }	
	 			
		let formData = new FormData();

        formData.append("email", emailRef.current.value);
        formData.append("username", usernameRef.current.value);
        formData.append("password", passwordRef.current.value);
        formData.append("gender",genderValue);
        formData.append("hobby",checkItems.toString());
        formData.append("job",jobRef.current.value);
        formData.append("telno",telnoRef.current.value);
        formData.append("description",descriptionRef.current.value);
        formData.append("nickname",nicknameRef.current.value);
        formData.append("FromSocial",FromSocial);
        formData.append("imgProfile", imgProfile);
		
		await fetch('http://localhost:8080/restapi/signup', {
			method: 'POST',
			body: formData,
			
		}).then((response) => response.json())
		  .then((data) => {
			  if(data.status === 'good'){
				  alert(decodeURIComponent(data.username) + "님, 회원 가입을 축하 드립니다.");
				  document.location.href="/";
			  } else {
				  alert("서버 장애로 회원 가입에 실패했습니다.");
			  }
		});	

    }

    return (
        <div>
            <div>
                <img id="topBanner" src ={Logo} alt="서울기술교육센터" />
            </div>
            <form className="WriteForm">
                <h1>회원 등록</h1><br />
                    <div id="RegistryForm">
                    <br /><br />
                        <input type="file" name="fileUpload" ref={fileEventRef} onChange={(e) => fileEventChange(e)} style={{display: 'none'}} />
                        <div className="imageZone" style={imageZone} ref={imgZoneRef} onClick={(e) => imgZoneClick(e)}>
                            {imgFile ? <img src={imgFile} alt="회원 프로파일" style={{width:'350px',height:'auto'}}/> : "클릭 후 탐색창에서 사진을 선택해 주세요."}
                        </div>    
                        <input type="text" className="input_field" ref={emailRef} value={email} onChange={(e) => emailChange(e)} placeholder="여기에 이메일을 입력해 주세요." /><br/>
                        <span style={{color:'red'}}>{message}</span>			
                        <input type="text" className="input_field" ref={usernameRef} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="여기에 이름을 입력해 주세요."/>
                        <input type="password" className="input_field" ref={passwordRef} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="여기에 패스워드를 입력해 주세요."/>
                        <input type="password" className="input_field" ref={password1Ref} value={password1} onChange={(e) => setPassword1(e.target.value)} placeholder="여기에 패스워드를 입력해 주세요."/>
                        <div style={{width: '90%',textAlign: 'left', position: 'relative', left: '35px', borderBottom: '2px solid #adadad', margin: '10px', padding: '10px'}}>
                            성별 : 
                            <input type="radio" id="male" name="gender" value="남성" onChange={(e)=>setGender(e.target.value)} /><label htmlFor="male">남성</label>
                            <input type="radio" id="female" name="gender" value="여성" onChange={(e)=>setGender(e.target.value)} /><label htmlFor="female">여성</label><br />
                            취미 : 
                            <input type='checkbox' name='select-all' id="all" 
                                    onChange={(e) => handleAllCheck(e.target.checked)}
                                    // 데이터 개수와 체크된 아이템의 개수가 다를 경우 선택 해제 (하나라도 해제 시 선택 해제)
                                    checked={checkItems.length === data.length ? true : false} /><label htmlFor="all">전체선택</label>
                            {data.map((data, key) => (
                                <span key={key}>
                                    <input type='checkbox' id={`${data.id}`} name={`select-${data.title}`}
                                        onChange={(e) => handleSingleCheck(e.target.checked, data.title)}
                                        // 체크된 아이템 배열에 해당 아이템이 있을 경우 선택 활성화, 아닐 시 해제
                                        checked={checkItems.includes(data.title) ? true : false} /><label htmlFor={`${data.id}`}>{data.title}</label>                                       
                                </span>
                            ))}   
                            <br/>
                            직업 : 
                            <select onChange={(e) => setJob(e.target.value)} value={job} ref={jobRef}>
                                <option value="description">-- 아래의 내용 중에서 선택 --</option>
                                <option value="회사원">회사원</option>
                                <option value="공무원">공무원</option>
                                <option value="자영업">자영업</option>
                            </select>
                            <br />
                        </div>
                        <input type="text" value={telno} ref={telnoRef} onChange={(e) => setTelno(e.target.value)} className="input_field" placeholder="전화번호를 입력하세요." />
                        <input type="text" value={nickname} ref={nicknameRef} onChange={(e) => setNickname(e.target.value)} className="input_field" placeholder="별명을 입력하세요." />                        
                        <p style={{color: 'red'}}>일반 사용자 권한으로 등록됩니다.</p>
                        <br />
                        <textarea className="input_content" value={description} ref={descriptionRef} onChange={(e) => setDescription(e.target.value)} 
                            cols="100" rows="500" name="description" placeholder="자기소개를 입력해 주세요.">
                        </textarea><br />
                        <input type="button" className="btn_write" onClick={handleRegister} value="여기를 클릭하세요!!!"/>

                    </div>
            </form>
            <br/><br/>    
        </div>
    )

}

export default Signup;