import Logo from '../images/logo.jpg';
import '../App.css';
import '../css/ModifyBoard.css';
import getCookie from './GetCookie';
import { useState,useRef,useEffect, useCallback } from 'react';
import { useNavigate,useSearchParams } from 'react-router-dom';
import axios from 'axios';

const ModifyBoard = () => {

    //쿠키 설정
    const emailCookie = getCookie('email');
    const usernameCookie = getCookie('username');

    //state 및 ref 설정
    const [writer, setWriter] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [statusbarState, setStatusbarState] = useState([{}]);
    const [fileZoneStyle , setFileZoneStyle] = useState({});
    const [fileView, setFileView] = useState([]);
    const [deleteFileList, setDeleteFileList] = useState([]);

    const titleRef = useRef();
    const contentRef = useRef();
    const fileEventRef = useRef();
    const fileZoneRef = useRef();
    
    //파일 업로드에 필요한 Ref
    ///////////////////////////////////////
    const fileCount = useRef(0);
    const uploadCountLimit = useRef(5);
    const rowCount = useRef(0);
    const fileNum = useRef(0);
    const content_files = useRef([]);
    //////////////////////////////////////

    //인자로 전달 받은 값들
    const [params] = useSearchParams();
    const page = params.get("page");
    const seqno = params.get("seqno");
    const keyword = params.get("keyword") === null?'': params.get("keyword");

    const navigate = useNavigate();

    const checkAuthority = () => {
        if(emailCookie === undefined || emailCookie === '')
            document.location.href='/';
    }

    useEffect(()=> {
        checkAuthority();
    });

    //파일 추가 등록
    const fileZoneClick = (e) => { fileEventRef.current.click(e); }
    const fileZoneDragEnter = (e) => {
        e.stopPropagation(); 
	    e.preventDefault();
	    setFileZoneStyle({border : '2px solid #0B85A1'});	
    }
    const fileZoneDragOver = (e) => {
        e.stopPropagation();
	    e.preventDefault();
    }
    const fileZoneDrop = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const files = e.dataTransfer.files;
        fileEvent(files);
    }

    const fileEventChange = (e) => {
        const files = e.target.files; 
        fileEvent(files);		
    }

    const fileEvent = (files) => {

        //스트링으로 입력된 Raw 형태의 파일들을 배열로 변환
        let filesArr = Object.values(files);
        
        // 파일 개수 확인 및 제한
	    if (fileCount.current + filesArr.length > uploadCountLimit.current) {
            alert('파일은 최대 '+uploadCountLimit.current+'개까지 업로드 할 수 있습니다.');
            return;
        } else {
           fileCount.current = fileCount.current + filesArr.length;
        }

        //파일 정보 보관용 객체
        let statusbar = [{}];

        //Raw 형태의 파일 배열을 읽어서 파일 형태로 변환 후 파일 정보를 추출하여 저장
        filesArr.forEach((file) => {
    
            var reader = new FileReader();
            
            //파일 읽기
            reader.readAsDataURL(file);
            //최종 파일리스트가 저장
            content_files.current.push(file);

            //파일 사이즈 제한
            if(file.size > 1073741824) { alert('파일 사이즈는 1GB를 초과할수 없습니다.'); return; }
        
            //파일 리스트 출력시 홀수행 색깔 지정
            rowCount.current = rowCount.current + 1;
            let row="odd";
            if(rowCount.current %2 === 0) row ="even";

            //파일명
            let filename = file.name;

            //파일 사이즈
            let sizeStr="";
            let sizeKB = file.size/1024;
            if(parseInt(sizeKB) > 1024){
                var sizeMB = sizeKB/1024;
                sizeStr = sizeMB.toFixed(2)+" MB";
            }else sizeStr = sizeKB.toFixed(2)+" KB"; 
            let filesize = sizeStr;
            
            //파일 정보를 파일 보관용 객체에 추가
            statusbar.push({ filenum: fileNum.current, filename, filesize, row: 'statusbar ' + row });
            
            //파일 정보 목록 키값 증가
            fileNum.current = fileNum.current + 1;
        });

        //statusbarState에 파일 정보 누적
        const nextStatusbar = statusbarState.concat(statusbar);        
        setStatusbarState(nextStatusbar);
        //파일 이벤트 초기화
        fileEventRef.current.value = '';
    }    

    //파일 목록에서 삭제 버튼 클릭시 파일 목록 삭제
    const fileDelete = (fileNum) => {
            
        //자바스크립트 배열의 속성인 is_delete에 true 입력 --> 파일 업로드 시 true가 아닌 파일만 업로드...
        content_files.current[fileNum].is_delete = true;

        //인자로 받은 파일 리스트 키값과 저장된 파일 리스트 키값을 비교해서 같지 않은 파일 목록, 즉 삭제 안할 파일 목록만 추출
        const deleteStatusbar = statusbarState.filter(statusbar => statusbar.filenum !== fileNum);
        //추출한 파일 목록을 다시 저장
        setStatusbarState(deleteStatusbar);	
        fileCount.current --;
    }  

    //첫번째 렌더링 시 게시물 정보 가져 오기
    useEffect(() => {

        const fetchData = async () => {
            //게시물 상세 가져오기
            const view = await axios.get(`http://localhost:8080/restapi/view?seqno=${seqno}&email=${emailCookie}`,);
                setTitle(view.data.title);
                setContent(view.data.content);
            //업로드된 파일 목록 보기
            const fileView = await axios.get(`http://localhost:8080/restapi/fileView?seqno=${seqno}`,);
                setFileView(fileView.data);    
}
        fetchData();
    },[keyword, page, seqno])   

    //제목 저장
    const handleTitle = useCallback((e)=> {
        setTitle(e.target.value);
    },[])

    //내용 저장
    const handleContent = useCallback((e)=> {
        setContent(e.target.value);
    },[])

    //파일 삭제 리스트 관리
    const handleFileList = useCallback((isChecked,fileseqno)=> {
        if(isChecked) {
            setDeleteFileList((prev) =>[...prev,fileseqno]);
            console.log("isChecked deleteFileList = " + deleteFileList);
        } 
        else {
            setDeleteFileList(deleteFileList.filter((e)=> e !== fileseqno));
            console.log("isNotChecked deleteFileList = " + deleteFileList); 
        }    
    },[deleteFileList])
    
    //게사물 수정
    const handleModify = async () => {
        if(titleRef.current.value === '') { alert("제목을 입력하세요!!!"); titleRef.current.focus(); return false;  }
		if(contentRef.current.value ==='') { alert("내용을 입력하세요!!!"); contentRef.current.focus(); return false;  }
		
	 	let formData = new FormData();
		for (let x = 0; x < content_files.current.length; x++) {
				if(!content_files.current[x].is_delete) {                     
					formData.append("SendToFileList", content_files.current[x]);
				}
		}	
        
		formData.append("seqno",seqno);
        formData.append("email",emailCookie);
        formData.append("writer",usernameCookie);
        formData.append("title",title);
        formData.append("content",content);
        formData.append("page",page);
        formData.append("keyword",keyword);	
        formData.append("deleteFileList",deleteFileList);	     

		let uploadURL = '';		
		if(content_files.current.length !== 0)
			uploadURL = 'http://localhost:8080/restapi/fileUpload?kind=U';
		else 			
			uploadURL = 'http://localhost:8080/restapi/modify';
	
		await fetch(uploadURL, {
			
			method: 'POST',
			body: formData			
			
		}).then((response)=> response.json())
		  .then((data) => {
			  if(data.message === 'good'){
				alert("게시물이 수정되었습니다.");
	        	document.location.href=`/board/view?seqno=${seqno}&page=${page}&keyword=${keyword}`;
			  }	
		}).catch((error)=> { 
			alert("시스템 장애로 게시물 수정이 실패했습니다.");
			console.log("error = " + error);
		});
        
    }

    //수정 취소
    const goBack = () => {
        navigate(-1);
    }

    return(
        <div>
            <div>
    	        <img id="topBanner" src ={Logo} alt="서울기술교육센터" />
  	        </div>

            <div className='main'>
                <h1>게시물 수정</h1>
                <div className="FormDiv">
                    <form id="ModifyForm" method="POST" >
                        <input type="text" className="writer" value={usernameCookie} readOnly />
                        <input type="text" className="title" ref={titleRef} value={title} onChange={handleTitle} />
                        <textarea className="content" cols="100" rows="500" ref={contentRef} value={content} onChange={handleContent}></textarea>
                        {fileView && fileView.map((file) => (
                            <div key={file.fileseqno}>	
                                <p style={{textAlign:'left'}} >
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        삭제 : <input type="checkbox" value={file.fileseqno} 
                                        onChange={(e)=> handleFileList(e.target.checked,file.fileseqno)}/> 
                                        {file.org_filename}( {file.filesize} Byte)<br />
                                </p>
                            </div>
                            ))           
                        }
                        <div className="fileuploadForm">
                            <input type="file" ref={fileEventRef} style={{display:'none'}} onChange={(e) => fileEventChange(e)} multiple />
                            <div className="fileZone" ref={fileZoneRef} style={fileZoneStyle} 
                                onClick={(e) => fileZoneClick(e)}
                                onDragEnter={(e) => fileZoneDragEnter(e)}    
                                onDragOver={(e) => fileZoneDragOver(e) }
                                onDrop={(e) => fileZoneDrop(e)}
                            > 파일 첨부를 하기 위해서는 클릭하거나 여기로 파일을 드래그 하세요.<br/>첨부파일은 최대 5개까지 등록이 가능합니다.
                            </div>
                            <div className="fileUploadList">
                            {
                            statusbarState.map((statusbar)=> ( statusbar.filename &&
                                <div className={statusbar.row} key={statusbar.filenum}>
                                    <div className="filename">{statusbar.filename}</div>
                                    <div className="filesize">{statusbar.filesize}</div>
                                    <div className="b_delete" onClick={()=> fileDelete(statusbar.filenum)}>삭제</div>
                                </div>    
                            ))
                            }
                        </div>    
                        </div>    
                        <input type="button" className="btn_write" value="수정" onClick={handleModify} />
                        <input type="button" className="btn_cancel" value="취소" onClick={goBack} />
                    </form>	
                </div>
            </div>
            <br/><br/><br/>    
        </div>
    );

};

export default ModifyBoard;