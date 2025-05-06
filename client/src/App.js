import logo from './logo.svg';
import './App.css';
import { Link, Route, Routes } from 'react-router-dom'

import Nav from './components/Nav';
import authLogin from './features/auth/authLogin';

function App() {
  return (
    <div className="App">
      {<Nav></Nav>}
      <Routes>
        <Route path='/' element={<></>}/>
        <Route path='/login' element={<authLogin/>}/>
      </Routes>
    </div>
  );
}

export default App;