
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Nav from "./components/Nav.js";
import Signup from "./components/Signup.js";
import MemberInfo from "./components/MemberInfo.js";
import MemberInfoModify from "./components/MemberInfoModify.js";
import Login from './components/Login';
import React from 'react';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/member/signup" element={<Signup />} />
          <Route path="/member/memberInfo" element={<MemberInfo />} />
          <Route path="/member/memberInfoModify" element={<MemberInfoModify />} />
          <Route path="/member/Login" element={<Login />} />
        </Routes>
      
    </BrowserRouter>
  );
}

export default App;
