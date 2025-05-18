import logo from './logo.svg';
import './App.css';
import { Link, Route, Routes } from 'react-router-dom'

import Nav from './components/header/Nav';
import Students from './components/body/users/Students';
import Login from './components/features/auth/login';
import LogOut from './components/features/auth/logOut';
import { useDispatch, useSelector } from 'react-redux';
import Contributions from './components/body/contributions/ShowContributions';
import StudentNav from './components/header/StudentNav';
import Home from './components/body/Home';
import ShowMSDetails from './components/body/msDetails/ShowMSDetails';
import User from './components/body/users/User';
function App() {
  const { token, role, user } = useSelector((state) => state.token);

  return (
    <div className="App">
      {role === "Admin" ? <Nav></Nav> : role === "Student" ? <StudentNav></StudentNav> : <></>}
      <Routes>
        <Route path='/' element={<Login></Login>} /> 
         <Route path='/login' element={<Login></Login>} />
        <Route path='/logOut' element={<LogOut></LogOut>} />
        {/* <Route path='/students' element={<Students></Students>} /> */}
        <Route path='/contribution' element={<Contributions></Contributions>} />
        <Route path='/home' element={<Home></Home>}/>
        <Route path='/user' element={<User></User>}/>
        <Route path='/showMSDetails' element={<ShowMSDetails></ShowMSDetails>}/>
        
      </Routes>
    </div>
  );
}

export default App;
