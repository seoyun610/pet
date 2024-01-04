import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Shopping.css';
import '../css/ShoppingGrid.css'; // 그리드 스타일을 위한 CSS 파일을 추가해주세요.
import logo from '../images/logo3.png'

function Shopping() {
  const [keyword, setKeyword] = useState('강아지 사료');
  const [list, setList] = useState(null);
  const [itemP, setItemP] = useState([]);

  const handleInputChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSearch = () => {
    if (!keyword.trim()) {
      return;
    }

    axios.get(`http://localhost:8080/shopping/crawling?query=${keyword}`)
      .then(response => {
        setItemP(response.data);
      })  
      .catch(error => {
        console.error('에러가 발생했습니다!', error);
      });
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div>
      <div className="container">
        <div
          className="navi"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div className="logodiv" id="logo" style={{ left: '30px', top: '10px' }}>
            <img src={logo} alt="logo image" style={{ width: '100px', height: 'auto' }} />
          </div>
          <div className="div50">
            <a className="a23" href="/">
              <div className="navi01">홈</div>
            </a>
          </div>
          <div className="div50">
            <a className="a23" href="/shopping/crawling">
              <div className="navi01">쇼핑</div>
            </a>
          </div>
          <div className="div50">
            <a className="a23" href="http://www.localhost:8080/community/totalView?page=1">
              <div className="navi01">커뮤니티</div>
            </a>
          </div>
          <div className="div50">
            <a className="a23" href="http://www.localhost:8080/community/map">
              <div className="navi01">동물병원 찾기</div>
            </a>
          </div>
          <div className="div50">
            <a className="a23" href="http://www.localhost:8080/member/login">
              <div className="navi01">로그인</div>
            </a>
          </div>
          <div className="div50">
            <a className="a23" href="http://www.localhost:8080/member/memberInfo">
              <div className="navi01">마이페이지</div>
            </a>
          </div>
        </div>
      </div>
      <div className="header"></div>
      <div className="text">
        <h1>Pet Shop</h1>
        <div className="search-container d-flex justify-content-center">
          <input
            type="text"
            name="keyword"
            id="keyword"
            placeholder="검색할 제목, 작성자 이름 및 내용을 입력하세요."
            value={keyword}
            onChange={handleInputChange}
            className="mr-2"
          />
          <input type="button" id="mainbutton" value="검색" onClick={handleSearch} />
        </div>
        <br />
        <div className="grid-container"> {/* 그리드 컨테이너로 변경 */}
          {itemP.map((item, index) => (
            <div key={index} className="grid-item">
              <a href={item.link} className="grid-link">
                <img src={item.image} alt="상품 이미지" className="grid-image" style={{ width: '100%', height: 'auto' }} /> {/* 이미지 크기를 조정하는 부분 */}
                <div className="grid-title">{item.title}</div>
                <div className="grid-price">{item.lprice + '원'}</div>
              </a>
            </div>
          ))}
        </div>
        <div className="clearfix"></div>
      </div>
    </div>
  );
}

export default Shopping;
