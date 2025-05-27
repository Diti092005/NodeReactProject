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
import ShowMSDetails from './components/body/msDetails/ShowMSDetails';
import CRStatus from './components/body/crStatus/CRStatus';
import CreateContribution from './components/body/contributions/CreateContribution';
import PaymentPage from './components/body/contributions/PaymentPage';
import StudentDetails from './components/body/users/student/StudentDetails';
import DonorNav from './components/header/DonorNav';import ShowContributionAccToDonor from './components/body/contributions/ShowContributionAccToDonor';
import Users from './components/body/users/Users';
import ScholarshipForStudent from './components/body/users/student/ScholarshipForStudent';
import StudentScholarships from './components/body/users/student/scholarships/StudentsScholarships';
;


function App() {
  const { token, role, user } = useSelector((state) => state.token);

  return (
    <div className="App">
      {role === "Admin" ? <Nav /> : role === "Student" ? <StudentNav /> :role==="Donor" ?<DonorNav/>:<></>}
      <div className='container'>
        <h1>
          Welcome {
            (role === "Admin" || role === "Student" || role === "Donor") && user ? user.fullname : ""
          }
        </h1>
      </div>
      {
        role === "Admin" ?
          <Routes>
            <Route path='/' element={<Login />} />
          {/* <Route path='/login' element={<Login />} /> */}
            <Route path='/logOut' element={<LogOut />} />
            {/* <Route path='/students' element={<Students />} /> */}
            <Route path='/cashregisterstatus' element={<CRStatus />} />
            <Route path='/contribution' element={<Contributions />} />
            <Route path='/paymentPage' element={<PaymentPage />} />
            <Route path='/showMSDetails' element={<ShowMSDetails />} />
            <Route path='/studentDetails' element={<StudentDetails />} />
            <Route path='studentsScholarships' element={<StudentScholarships/>}/>
            <Route path="/addContribution" element={<CreateContribution />} />
            <Route path="/users" element={<Users />} />
          </Routes>
          : role === "Student" ?
            <Routes>
              <Route path='/' element={<Login />} />
              {/* <Route path='/login' element={<Login />} /> */}
              <Route path='/logOut' element={<LogOut />} />
              <Route path='/studentDetails' element={<StudentDetails />} />
              <Route path='/scholarshipForStudent' element={<ScholarshipForStudent/>}/>
            </Routes>
            : role === "Donor" ?
              <Routes>
                <Route path='/' element={<Login />} />
                {/* <Route path='/login' element={<Login />} /> */}
                <Route path='/logOut' element={<LogOut />} />
                <Route path='/contributionDonor' element={<ShowContributionAccToDonor />} />
                {/* <Route path="/homeDonor" element={<HomeDonor />} /> */}
                {/* <Route path="/addContribution" element={<CreateContribution />} />
                <Route path="/paymentPage" element={<PaymentPage />} /> */}
              </Routes>
              :
              <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/login' element={<Login />} />
                <Route path='/logOut' element={<LogOut />} />
              </Routes>
      }
    </div>
  );
}

export default App;