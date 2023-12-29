import '../App.css';
import '../css/ViewBoard.css';
import Logo from '../images/logo.jpg';
import getCookie from './GetCookie';
import {Link, useSearchParams, useNavigate} from 'react-router-dom';
import {useState, useEffect, useRef, useCallback} from 'react';
import dayjs from 'dayjs';
import axios from 'axios';

const ViewBoard = () => {

    //날짜 기준을 한국으로 지정
    dayjs.locale('ko'); 
    
    //쿠키 설정
    const emailCookie = getCookie('email');
    const usernameCookie = getCookie('username');
 
    //게시판 상세 내용
    const [view, setView] = useState([]);
    const [email, setEmail] = useState('');
    const [writer, setWriter] = useState('');
    const [title, setTile] = useState('');
    const [regdate, setRegdate] = useState('');
    const [content, setContent] = useState('');
    //댓글 
    const [replyListView, setReplyListView] = useState([]);    
    const [replyseqno, setReplyseqno] = useState('');
    const [replywriter, setReplywriter] = useState(usernameCookie);
    const [replycontentRegister, setReplycontentRegister] = useState('');
    const [replycontent, setReplycontent] = useState('');
    const replyContentRef = useRef(); // ref를 이용해서 유효성 처리
    const [replyListStyle, setReplyListStyle] = useState({"fontSize":"0.8em","display":"block"});
    const [replyModifyStyle, setReplyModifyStyle] = useState({"fontSize":"0.8em","display":"none"});
    //좋아요/싫어요
    const [likeCnt,setLikeCnt] = useState(0);
    const [dislikeCnt,setDislikeCnt] = useState(0);    
    const myLikeCheckRef = useRef('');
    const myDislikeCheckRef = useRef('');
    const checkCnt = useRef('');
    const [likeStyle, setLikeStyle] = useState({});
    const [dislikeStyle, setDisLikeStyle] = useState({});
    const [myChoice, setMyChoice] = useState('');
    const [pre_seqno, setPre_seqno] = useState(0);
    const [next_seqno, setNext_seqno] = useState(0);
    const [fileView, setFileView] = useState([]);
    
    const [param] = useSearchParams();
    const seqno = param.get('seqno'); 
    const page = param.get('page');
    const keyword = param.get('keyword')===null?'':param.get('keyword');

    useEffect(()=> {
        
        const fetchData = async() => {

            //게시물 상세 보기
            const view = await axios.get(`http://localhost:8080/restapi/view?seqno=${seqno}&email=${emailCookie}`);
            setView(view.data);
            setEmail(view.data.email);
            setWriter(view.data.writer);
            setTile(view.data.title);
            setRegdate(view.data.regdate);
            setContent(view.data.content);
            setLikeCnt(view.data.likecnt);
            setDislikeCnt(view.data.dislikecnt);
            //이전 보기
            const preseqno = await axios.get(`http://localhost:8080/restapi/preseqno?seqno=${seqno}&keyword=${keyword}`);
            setPre_seqno(preseqno.data.pre_seqno);
            //다음 보기
            const nextseqno = await axios.get(`http://localhost:8080/restapi/nextseqno?seqno=${seqno}&keyword=${keyword}`);
            setNext_seqno(nextseqno.data.next_seqno);
            //파일 목록 보기
            const fileView = await axios.get(`http://localhost:8080/restapi/fileView?seqno=${seqno}`);
            setFileView(fileView.data);

            const likeCheckView = await axios.get(`http://localhost:8080/restapi/likeCheckView?seqno=${seqno}&email=${emailCookie}`);
            myLikeCheckRef.current = likeCheckView.data.myLikeCheck;
            myDislikeCheckRef.current = likeCheckView.data.myDislikeCheck;
            if(myLikeCheckRef.current === undefined || myLikeCheckRef.current === '')
                myLikeCheckRef.current = "N";
            if(myDislikeCheckRef.current === undefined || myDislikeCheckRef.current === '')
                myDislikeCheckRef.current = "N";    
         
            if(myLikeCheckRef.current === "Y") setLikeStyle({backgroundColor:'#00B9FF'});
            if(myDislikeCheckRef.current === "Y") setDisLikeStyle({backgroundColor:'#00B9FF'});
        
            if(myLikeCheckRef.current === "Y")  setMyChoice(usernameCookie + '님의 선택은 좋아요입니다.');
            if(myDislikeCheckRef.current === "Y") setMyChoice(usernameCookie + '님의 선택은 싫어요입니다.');
            if(myLikeCheckRef.current === "N" && myDislikeCheckRef.current === "N") setMyChoice(usernameCookie + '님은 아직 선택을 안 했네요');

        }

        fetchData();
        replyStartPage();
    
    },[page,seqno,keyword]);

    const likeView = () => {
        if(myLikeCheckRef.current === "Y" && myDislikeCheckRef.current === "N") {
	        alert("좋아요를 취소합니다."); 
	        checkCnt.current = '1';  //likeCnt --> 6개의 조건 중 1번 조건
            myLikeCheckRef.current = "N";
	        sendDataToServer(); 
            setLikeStyle({backgroundColor: '#d2d2d2'});
        }else if(myLikeCheckRef.current === "N" && myDislikeCheckRef.current === "Y") {
	        alert("싫어요가 취소되고 좋아요가 등록됩니다.");
	        checkCnt.current = '2'; // likeCnt ++ , dislikeCnt --
	        myLikeCheckRef.current = "Y";
            myDislikeCheckRef.current = "N";
	        sendDataToServer();  
	        setLikeStyle({backgroundColor: '#00B9FF'});
            setDisLikeStyle({backgroundColor: '#d2d2d2'});
        } else if(myLikeCheckRef.current === "N" && myDislikeCheckRef.current === "N") {
	        alert("좋아요를 선택 했습니다.")
	    	checkCnt.current = '3'; //likeCnt ++
            myLikeCheckRef.current = "Y";
            sendDataToServer();
            setLikeStyle({backgroundColor: '#00B9FF'});
        }
	    if(myLikeCheckRef.current === "Y") setMyChoice(`${usernameCookie}님의 선택은 좋아요입니다.`);
	    if(myDislikeCheckRef.current === "Y") setMyChoice(`${usernameCookie}님의 선택은 싫어요입니다.`);
	    if(myLikeCheckRef.current === "N" && myDislikeCheckRef.current === "N") setMyChoice(`${usernameCookie}님은 아직 선택을 안 했네요`);
    }

    const disLikeView = () => {
        if(myDislikeCheckRef.current === "Y" && myLikeCheckRef.current === "N") {
	        alert("싫어요를 취소합니다."); 
	        checkCnt.current = '4'; // dislikeCnt --
            myDislikeCheckRef.current = "N";
	        sendDataToServer();
            setDisLikeStyle({backgroundColor: '#d2d2d2'});
        } else if(myDislikeCheckRef.current === "N" && myLikeCheckRef.current === "Y") {
	        alert("좋아요가 취소되고 싫어요가 등록됩니다.");
	        checkCnt.current = '5'; //likeCnt -- , dislikeCnt ++            
	        myLikeCheckRef.current = "N";
            myDislikeCheckRef.current = "Y";
	        sendDataToServer();
	        setLikeStyle({backgroundColor: '#d2d2d2'});
            setDisLikeStyle({backgroundColor: '#00B9FF'});
	    } else if(myDislikeCheckRef.current === "N" && myLikeCheckRef.current === "N") {
	        alert("싫어요를 선택했습니다.");
	    	checkCnt.current = '6'; //dislikeCnt ++
            myDislikeCheckRef.current = "Y";
	        sendDataToServer();
	        setDisLikeStyle({backgroundColor: '#00B9FF'});
	    }
	    if(myLikeCheckRef.current === "Y") setMyChoice(`${usernameCookie}님의 선택은 좋아요입니다.`);
	    if(myDislikeCheckRef.current === "Y") setMyChoice(`${usernameCookie}님의 선택은 싫어요입니다.`);
	    if(myLikeCheckRef.current === "N" && myDislikeCheckRef.current === "N") setMyChoice(`${usernameCookie}님은 아직 선택을 안 했네요`);
    }

    const sendDataToServer = async () => {
	
        let formData = new FormData();
        formData.append("seqno", seqno);
        formData.append("email", emailCookie);
        formData.append("myLikecheck", myLikeCheckRef.current);
        formData.append("myDislikecheck", myDislikeCheckRef.current);
        formData.append("checkCnt", checkCnt.current);

        await fetch('http://localhost:8080/restapi/likeCheck', {
			
			method: 'POST',
			body: formData		
		}).then((response) => response.json())
		  .then((data)=> {			  
              setLikeCnt(data.likeCnt);
              setDislikeCnt(data.dislikeCnt);
       }).catch((error)=> {
    	   console.log("error = " + error);
       });	
		
	}

    // 렌더링 시 댓글 목록 가져오기
    const replyStartPage = async () => {
		let formData = new FormData();
		formData.append("seqno", seqno);
		
		await fetch('http://localhost:8080/restapi/reply?option=L', {
			method: 'POST',
			//headers: {"content-type":"application/json"},
			body: formData	
		}).then((response) => response.json())
		  .then((data) => setReplyListView(data))
		  .catch((error)=> {
			  console.log("error = " + error);
			  alert("시스템 장애로 댓글 등록이 실패했습니다.");
		});
	}

    //댓글 등록
    const replyRegister = async () => {
        // 유효성 처리
        if(replyContentRef.current.value === '' || replyContentRef.current.value === undefined)
            {alert("댓글을 입력하세요."); replyContentRef.current.focus(); return false;}
        
        let formData = new FormData();
        formData.append("seqno", seqno); 
        formData.append("email", emailCookie);
        formData.append("replywriter", replywriter);
        formData.append("replycontent", replycontentRegister);
        
        await fetch('http://localhost:8080/restapi/reply?option=I', {
            method: 'POST',
            //headers: {"content-type":"application/json"},
            body: formData		
        }).then((response) => response.json())
            .then((data) => setReplyListView(data))
            .catch((error)=> {
                console.log("error = " + error);
                alert("시스템 장애로 댓글 등록이 실패했습니다.");
        });
        
        setReplycontentRegister('');
    
    }

    //댓글 등록 취소
    const replyCancel = () => {
        if(window.confirm("정말로 취소 하시겠습니까?") === true) { 
			replyContentRef.current.value = ''; 
			replyContentRef.current.focus(); 
		}
    }

    //댓글 삭제
    const replyDelete = async (replyseqno) => {
        if(window.confirm("정말로 삭제하시겠습니까?")===true){
            const deleteReplyList = replyListView.filter((reply) => reply.replyseqno !== replyseqno);
            setReplyListView(deleteReplyList);

            let formData = new FormData();
            formData.append("replyseqno",replyseqno);
            await fetch('http://localhost:8080/restapi/reply?option=D', {
                method: 'POST',
                body: formData		
            }).catch((error)=> {
               console.log("error = " + error);
               alert("시스템 장애로 댓글 등록이 실패했습니다.");
            });
        }
    }

    //댓글 수정버튼 클릭
    const replyModifyClick = (replyseqno) => {
        setReplyseqno(replyseqno);
        setReplyListStyle({"fontSize":"0.8em","display":"block"});
        setReplyModifyStyle({"fontSize":"0.8em","display":"block"});

    }

    //댓글 내용 수정 등록
    const handleContent = useCallback((e)=> {
        setReplycontent(e.target.value);
    },[])


    //댓글 수정
    const replyModify = async (replyseqno) => {
        let formData = new FormData();
        formData.append("replyseqno",replyseqno);
        formData.append("replywriter",usernameCookie);
        formData.append("replycontent",replycontent);
        await fetch('http://localhost:8080/restapi/reply?option=U', {
            method: 'POST',
            body: formData		
        }).then(()=>{
            setReplyseqno('0');
            setReplyListStyle({"fontSize":"0.8em","display":"block"});
            setReplyModifyStyle({"fontSize":"0.8em","display":"none"});
            replyStartPage();
        }).catch((error)=> {
            console.log("error = " + error);
            alert("시스템 장애로 댓글 수정이 실패했습니다.");
        });
        
    }

    //댓글 수정 취소
    const replyModifyCancel = () => {
        setReplyseqno('0');
        setReplyListStyle({"fontSize":"0.8em","display":"block"});
        setReplyModifyStyle({"fontSize":"0.8em","display":"none"});
    }

    //파일 다운로드
    const fileDownload = (fileseqno) => {
        document.location.href='http://localhost:8080/restapi/filedownload?fileseqno=' + fileseqno;
    };

    //게시물 삭제
    const deleteBoard = () => {

        const seqno = param.get('seqno');
    
        if(window.confirm("정말로 삭제 하시겠습니까?") === true){
            fetch(`http://localhost:8080/restapi/delete?seqno=${seqno}`, {			
                method: 'GET'        
            }).then((response) => response.json())
                .then((data) => {
                    if(data.message === 'good')
                        document.location.href='/board/list?page=1';
                }).catch((error)=> {
                console.log("error = " + error);
            });	
        }
    };

    return(
        <div>
            <div>
		        <img id="topBanner" src={Logo} alt="서울기술교육센터" />	
	        </div>
	
            <div className="main">
                <h1>게시물 내용 보기({email.email})</h1>
                <br />
                <div className="boardView">
                    <div className="field">이름 : {writer}</div>
                    <div className="field">제목 : {title}</div>
                    <div className="field">날짜 : {dayjs(regdate).format('YYYY-MM-DD HH:mm:ss')}</div>
                    <div className="content"><pre>{content}</pre></div>
                    <div className="likeForm" style={{width:'30%',height:'auto',margin:'auto',cursor:'pointer'}}>
                        <span>{likeCnt === undefined? '0': likeCnt}</span>&nbsp; {/* 좋아요 갯수 */}
                        <span onClick={likeView} className="likeClick" style={likeStyle}>좋아요</span> {/* 클릭하면 좋아요 등록/취소 */}
                        <span onClick={disLikeView} className="dislikeClick" style={dislikeStyle}>싫어요</span>&nbsp;{/* 클릭하면 싫어요 등록/취소 */}
                        <span>{dislikeCnt === undefined? '0': dislikeCnt}</span><br /> {/* 싫어요 갯수 */}
                        <span style={{textAlign:'center',color:'red'}}>{myChoice}</span> {/* 접속자의 선택을 표시 */}
                    </div>
                    {
                        fileView !== ''  ? 
                        fileView.map( (f)=>(
                        <div className="field" key={f.fileseqno}>파일명 : {f.org_filename} ({f.filesize}) Bytes <input type="button" value="다운로드" onClick={()=> {fileDownload(`${f.fileseqno}`)}}/></div>
                        )) : <div className="field">업로드된 파일이 없습니다.</div>
                    }
                    <br />
                     <br/><br/>
                </div>
                <br/>
                <div className="bottom_menu">
                    {
                        pre_seqno !== '0' && <Link to ={`/board/view?seqno=${pre_seqno}&page=${page}&keyword=${keyword}`}>이전글▼</Link>
                    }
                    &nbsp;&nbsp;
                    <Link to={`/board/list?page=${page}&keyword=${keyword}`}>목록보기</Link>
                    &nbsp;&nbsp;                    
                    {
                        next_seqno !== '0' && <Link to={`/board/view?seqno=${next_seqno}&page=${page}&keyword=${keyword}`}>다음글▲</Link>
                    }
                    &nbsp;&nbsp; 
                    <a href="/board/write">글 작성</a>
                    &nbsp;&nbsp; 
                    {
                        emailCookie ===  email.email && 
                        <Link to={`/board/modify?seqno=${seqno}&page=${page}&keyword=${keyword}`}>글 수정</Link>
                    } 
                    &nbsp;&nbsp;   
                    {
                        emailCookie === email.email && 
                        <a href='javascript:void(0)' onClick={deleteBoard}>글 삭제</a> 
                    }
                    
                </div>	
                <br/>

                <div className="replyDiv" style={{width:'60%',height:'300px',margin:'auto',textAlign:'left'}}>
                    <p id="replyNotice">댓글을 작성해 주세요</p>
                    <form id="replyForm" name="replyForm" method="POST"> 
                        작성자 : <input type="text"  value={replywriter} readOnly /><br />
                        <textarea ref={replyContentRef} value={replycontentRegister} onChange={(e) => setReplycontentRegister(e.target.value)} 
                            cols='80' rows='5' maxLength='150' placeholder='글자수:150자 이내'></textarea><br />
                    </form>
                    <input type="button" id="btn_reply" value="댓글등록" onClick={replyRegister} />
                    <input type="button" id="btn_cancel" value="취소" onClick={replyCancel} />
                    <hr/>                    
                    {
                        replyListView && 
                        replyListView.map((reply)=> (
                            <div key={reply.replyseqno}>
                                {
                                    replyseqno !== reply.replyseqno ?
                                        <div style={replyListStyle}>
                                            작성자: {reply.replywriter} {dayjs(reply.replyregdate).format('YYYY-MM-DD HH:mm:ss')} 
                                            [ <span onClick={()=> replyModifyClick(reply.replyseqno)} style={{"textDecoration":"underline","cursor":"pointer"}}>수정</span> | 
                                            <span onClick={()=> replyDelete(reply.replyseqno)} style={{"textDecoration":"underline","cursor":"pointer"}}>삭제</span> ]
                                            <div style={{"width":"90%","height":"auto","borderTop":"1px solid gray","overflow":"auto"}}>
                                                <pre>{reply.replycontent}</pre>
                                            </div>                                    
                                        </div>
                                    : <div></div>
                                }
                                {   
                                    replyseqno === reply.replyseqno ?
                                        <div style={replyModifyStyle}>
                                            작성자 : {usernameCookie}
                                            <input type="button" value="수정" onClick={() => replyModify(reply.replyseqno)} />
                                            <input type='button' value='취소' onClick={replyModifyCancel}/>
                                            <br/>
                                            <textarea cols='80' rows='5' maxLength='150' placeholder='글자수:150자 이내'                                                 
                                                defaultValue={reply.replycontent} onChange={handleContent}>
                                            </textarea><br></br>
                                        </div>
                                    : <div></div>
                                }
                            </div>                       

                        ))
                    }
                    <br/><br/>
                </div>

            </div>
        </div>
    )

}

export default ViewBoard;