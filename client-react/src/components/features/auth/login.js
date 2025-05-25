import React, { useState, useRef } from 'react';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
//import SignUpCustomer from './SignUpCustomer';
import { setToken, setUser, setRole } from '../../../redux/tokenSlice';
import { Toast } from 'primereact/toast';
import UserForm from '../../body/users/userForm';
//import SignUpParticipant from './SignUpParticipant';

export default function Login() {
    const [userName, setUserName] = useState();
    const [password, setPassword] = useState();
    const [add,setAdd]=useState(false)
    const [userDialog, setUserDialog] = useState(false);

    const navigate = useNavigate();
    // const [visibleCust, setVisibleCust] = useState(false);
    // const [visiblePart, setVisiblePart] = useState(false);
    const dispatch = useDispatch();
    const toast = useRef(null);
    const addDonor = () => {
        setAdd(true)
        setUserDialog(true)
    }
    const login = async () => {
        try {
            const res = await axios.post('http://localhost:1111/api/auth/login', { userId: userName, password: password });
            dispatch(setUser(res.data.user));
            dispatch(setRole(res.data.role));
            dispatch(setToken(res.data.accessToken));

            if (res.data.role.includes("Admin")) {
                navigate('../users'); //
            }
            if (res.data.role.includes("Donor")) {
                navigate('../contributionDonor'); //
            }
            if (res.data.role.includes("Student")) {
                navigate('../studentDetails')
            }

        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.response ? error.response.data.message : 'An error occurred during login.';
            toast.current.show({ severity: 'error', summary: 'Login Failed', detail: errorMessage });
        }
    };

    return (
        <div className="card" style={{ minHeight: "100vh" }}>
            <div className="flex flex-column md:flex-row h-full">
                {/* צד שמאל - Login */}
                <div className="w-full md:w-6 flex flex-column align-items-center justify-content-center gap-3 py-5" style={{ flex: 1 }}>
                    <div style={{ marginBottom: 20 }} className="flex flex-wrap justify-content-center align-items-center gap-2">
                        <label className="w-6rem">UserId</label>
                        <InputText onChange={(e) => setUserName(e.target.value)} id="username" type="text" className="w-12rem" />
                    </div>
                    <div style={{ marginBottom: 20 }} className="flex flex-wrap justify-content-center align-items-center gap-2">
                        <label className="w-6rem">Password</label>
                        <InputText onChange={(e) => setPassword(e.target.value)} id="password" type="password" className="w-12rem" />
                    </div>
                    <Button onClick={login} label="Login" icon="pi pi-user" className="w-10rem mx-auto"></Button>
                </div>

                {/* מחיצה */}
                <div className="hidden md:flex align-items-center" style={{ height: "100%" }}>
                    <Divider layout="vertical">
                        <b>OR</b>
                    </Divider>
                </div>
                <div className="flex md:hidden">
                    <Divider layout="horizontal" align="center">
                        <b>OR</b>
                    </Divider>
                </div>

                {/* צד ימין - Sign Up */}
                <div className="w-full md:w-6 flex align-items-center justify-content-center py-5" style={{ flex: 1 }}>
                    <Button label="Sign Up As A Donor" icon="pi pi-user-plus" severity="success" className="w-10rem" onClick={addDonor}></Button>
                </div>
            </div>
            <Toast ref={toast} />
            {add ? <UserForm setUserDialog={setUserDialog} userDialog={userDialog} setAdd={setAdd} ></UserForm> : <></>}

        </div>
    )
}
