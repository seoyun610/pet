import React, { useState, useEffect } from 'react';  
import axios from 'axios';
import '../css/Shopping.css'

function Shopping() {
  const [keyword, setKeyword] = useState('강아지 사료');
  const [list, setList] = useState(null);
  const [itemP, setItemP] = useState([]);

  const handleInputChange = (e) => {
    setKeyword(e.target.value);
  }

  const handleSearch = () => {
    if (!keyword.trim()) {
      return;
    }
  
    axios.get(`http://localhost:8080/shopping/crawling?query=${keyword}`)
      .then(response => {
        setItemP(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  useEffect(() => {
    handleSearch();  
  }, []); 
  

  return (
    <div className="container">
      <div className="navi">
        <a href="#" id="logo">
          <img src="https://i.postimg.cc/C5FbwsQr/logo.png" height="20" alt="Logo"/>
        </a>
        <ul id="menu">
          <li><a href="#">Contact</a></li>
          <li><a href="#">Shop</a></li>
          <li><a href="#">Cart</a></li>
          <li><a href="#">Login</a></li>
        </ul>
      </div>
      <div className="header"></div>
      <div className="text">
        <h1>Our New Products</h1>
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
        <table className="InfoTable">
         
          <tbody>
            {itemP.map((item, index) => (
              <tr key={index}>
                <td>
                  <a href={item.link} style={{ display: 'block', width: '100%', height: 'auto' }}>
                    <img src={item.image} alt="상품 이미지" style={{ width: '100%', height: 'auto' }} />
                  </a>
                </td>
                <td>
                  <a href={item.link} style={{ fontSize: '20px', width: '60%' }}>
                    <span>{item.title}</span>
                  </a>
                </td>
                <td>
                  <a href={item.link} style={{ fontSize: '16px' }}>
                    <span>{item.lprice + '원'}</span>
                  </a>
                </td>
              </tr>
            ))}
            {list === null && (
              <tr>
                <td colSpan="3" className="no-data">
                  등록된 게시물이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="clearfix"></div>
      </div>
      <div className="footer">
        <a href="https://facebook.com">
          <img src="https://i.postimg.cc/0r11BZ2j/facebook.png" height="20" alt="Facebook"/>
        </a>
        <a href="https://instagram.com">
          <img src="https://i.postimg.cc/9XZmGqf0/instagram.png" height="20" alt="Instagram"/>
        </a>
        <a href="https://twitter.com">
          <img src="https://i.postimg.cc/c1RWKyD8/twitter.png" height="20" alt="Twitter"/>
        </a>
      </div>
    </div>
  );
}

export default Shopping;
