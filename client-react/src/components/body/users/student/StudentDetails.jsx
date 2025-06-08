import React, { useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import UserForm from '../userForm';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { logOut, setUser} from '../../../../redux/tokenSlice';
import { format } from 'date-fns';

export default function StudentDetails() {
    const { token, user } = useSelector((state) => state.token);
    const [student, setStudent] = useState();
    const [editForm, setEditForm] = useState(false);
    const dispatch = useDispatch();
    const imageBodyTemplate = (rowData) => {
        console.log(user?.image+"jkhgfdsa");
        if (!user?.image && !rowData?.image) return null;
        const imageUrl = rowData.image.startsWith('http')
            ? user.image
            : `http://localhost:1111${user.image}`;
        return (
            <div style={{
                width: '100%',
                maxWidth: 350,
                minHeight: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f5f5f5',
                borderRadius: 10,
                overflow: 'hidden'
            }}>
                <img
                    src={imageUrl}
                    alt={rowData.fullname}
                    style={{
                        width: '100%',
                        height: '100%',
                        maxWidth: '100%',
                        maxHeight: 350,
                        objectFit: 'contain', // לא יחתוך את התמונה!
                        borderRadius: 10,
                        background: 'white',
                    }}
                />
            </div>
        );
    };
    const header =imageBodyTemplate(user)
    const showEditForm = () => {
        setStudent(user)
        setEditForm(true)
    };
    const footer = (
        <>
            <Button label="update" icon="pi pi-pencil" onClick={() => {
                if (user.active)
                    showEditForm()
                else
                    alert("You can't update details when you are not active")
            }} />
        </>
    );
    const getStudent=async()=>{
        const res = await axios.get(`http://localhost:1111/api/user/${user._id}`,
            { headers: { Authorization: `Bearer ${token}` } });
            dispatch(setUser(res.data));

    }
useEffect(()=>{
     getStudent()
},[])
    const updateTheUser = async () => {
        try {
            const res = await axios.get(`http://localhost:1111/api/user/${user._id}`,
                { headers: { Authorization: `Bearer ${token}` } });
            dispatch(setUser(res.data));
        }
        catch (err) {
            console.error(err)
        }
    };

    return (
        <div className="card flex justify-content-center">
            <Card title={user.fullname} footer={footer} header={header} className="md:w-25rem">
                    <p>ID: {user.userId}</p>
                    {user.email && <p>email: {user.email}</p>}
                    {user.phone && <p>phone: {user.phone}</p>}
                    {(user.address?.city || user.address?.street || user.address?.numOfBuilding !== 0) && <p>address: </p>}
                    {user.address?.city && <p>city: {user.address?.city}</p>}
                    {user.address?.street && <p>street: {user.address.street}</p>}
                    {user.address?.numOfBuilding ? <p>building number: {user.address?.numOfBuilding}</p> : ''}
                    {user.birthDate?.birthDate && <p>birthDate: {format(user.birthDate, 'dd/MM/yyyy')}</p>}
            </Card>
            {editForm ? <UserForm updateTheUser={updateTheUser} setUser={setStudent} user={student} setUserDialog={setEditForm} userDialog={editForm}></UserForm> : <></>}
        </div>
    )
}
