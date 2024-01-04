import {Route, Routes} from 'react-router-dom';
import Login from './component/Login.js';
import Signup from './component/Signup.js';
import MemberInfo from './component/MemberInfo.js';
import MemberInfoModify from './component/MemberInfoModify.js';
import ListBoard from './component/ListBoard.js';
import ViewBoard from './component/ViewBoard.js';
import WriteBoard from './component/WriteBoard.js';
import ModifyBoard from './component/ModifyBoard.js';
import Shopping from './component/Shopping.js'
import Main from './component/main.js'

const App = () => {
  return(
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/member/signup" element={<Signup />} />
      <Route path="/member/memberInfo" element={<MemberInfo />} />
      <Route path="/member/memberInfoModify" element={<MemberInfoModify />} />
      <Route path="/board/list" element={<ListBoard />} />
      <Route path="/board/view" element={<ViewBoard />} />
      <Route path="/board/write" element={<WriteBoard />} />
      <Route path="/board/modify" element={<ModifyBoard />} />
      <Route path="/shopping/crawling" element={<Shopping />} />
    </Routes>
  );
}
export default App;
