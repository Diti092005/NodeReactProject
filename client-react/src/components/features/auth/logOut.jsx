import React, { useState, useRef } from 'react';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
//import SignUpCustomer from './SignUpCustomer';
import { setToken, setUser,setRole } from '../../../redux/tokenSlice';
import { Toast } from 'primereact/toast';
import { useEffect } from 'react';
//import SignUpParticipant from './SignUpParticipant';
import { logOut } from '../../../redux/tokenSlice';
export default function LogOut() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

useEffect(()=>{
    dispatch(logOut())
    navigate('../login');
},[])
    return (
        <div className="card">

        </div>
            
    )
}
