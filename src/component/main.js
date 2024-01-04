import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import logo from '../images/logo3.png';
import '../css/Shopping.css';
import '../css/ShoppingGrid.css';
import back from '../images/background.png'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 6rem;
  height: 100vh;
`;

const Title = styled.div`
  font-size: 3rem;
  font-weight: bold;
  margin: 0;
`;

const Wrapper = styled.div`
  flex: 2;
`;

const Image = styled.div`
  display: flex;
  justify-content: flex-end;
  flex: 3;
`;

const Text = styled.p`
  font-size: 1.4rem;
  color: #6c6c6c;
`;

const Button = styled.button`
  background-color: #7851a9;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  margin: 10px;
  cursor: pointer;
  font-size: 1.2rem;
  &:hover {
    background-color: #5c3e80;
  }
  &:active {
    background-color: #a380ce;
  }
`;

function Main() {
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

      <Container>
        <Wrapper>
          <div>
            <Title>
              <span style={{ color: '#ffdb54' }}>PetCareHub</span>
            </Title>
            <Title>반려인들을 위한 정보,</Title>
            <Title>소통을 위한 커뮤니티.</Title>
          </div>
          <Text>
          정보공유, 주변 동물병원, 반려동물 관련 상품 검색을 한 곳에서 확인할 수 있다면?
          </Text>
          <Button>시작하기   ➔</Button>
        </Wrapper>

        <Image>
          <img src={back} alt="강아지 이미지" width="600px" />
        </Image>
      </Container>
    </div>
  );
}

export default Main;
