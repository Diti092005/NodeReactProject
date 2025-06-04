import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import axios from 'axios';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
import { useSelector } from 'react-redux';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
//import { emit } from '../../../../../server node/models/User';
import { Toolbar } from 'primereact/toolbar';
import UserForm from './userForm';
import { format } from 'date-fns';


export default function Users() {

    const [users, setUsers] = useState([]);
    const [user, setUser] = useState();
    const [add, setAdd] = useState(false);

    const [userDialog, setUserDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [selectedUsers, setselectedUsers] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false)
    const [roles] = useState(['Student', 'Donor', 'Admin']);
    const { token, role } = useSelector((state) => state.token);
    const toast = useRef(null);
    const dt = useRef(null);
    const [selectedRole, setSelectedRole] = useState("All");
    const [filteredUsers, setFilterdUsers] = useState(null)

    const getUsers = async () => {
        try {
            const res = await axios.get("http://localhost:1111/api/user",
                { headers: { Authorization: `Bearer ${token}` } })
            setUsers(res.data)
            console.log(users);
            setSelectedRole(selectedRole)
        }
        catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        getUsers();
        setSelectedRole(roles[0])
    }, []);

    useEffect(() => {
        if (selectedRole && selectedRole === "All")
            setFilterdUsers(users)
        else if (selectedRole && selectedRole === "Admin")
            setFilterdUsers(users.filter(u => u.role === selectedRole))
        else if (selectedRole && selectedRole === "Donor")
            setFilterdUsers(users.filter(u => u.role === selectedRole))
        else if (selectedRole && selectedRole === "Student")
            setFilterdUsers(users.filter(u => u.role === selectedRole))
        else
            setFilterdUsers(users)
    }, [users, selectedRole]);


    const onRowEditComplete = (e) => {
        let _users = [...users];
        let { newData, index } = e;
        _users[index] = newData;
        setUsers(_users);
    };

    const getRoleTagClass = (role) => {
        switch (role) {
            case 'Admin':
                return { backgroundColor: '#B3E5FC', color: '#01579B' };
            case 'Donor':
                return { backgroundColor: '#FFF8E1', color: '#222' };
            case 'Student':
                return { background: '#A8E6CF', color: '#1a4d1a' };
            default:
                return {};
        }
    };



    const roleBodyTemplate = (rowData) => {
        return (
            <Tag value={rowData.role} style={getRoleTagClass(rowData.role)} />
        );
    };

    const editUser = (user) => {
        setUser(user);
        setUserDialog(true);
    };

    const confirmDeleteUser = async (user) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            {
                try {
                    if (user.image[0]) {
                        await axios.delete('http://localhost:1111/api/user/delete-image', {
                            data: { url: user.image, _id: user._id }
                        },// שים לב - axios צריך data לא body
                            { headers: { "Content-Type": "application/json" } }
                        );
                    }
                    const res = await axios.put(`http://localhost:1111/api/user/${user._id}`, {},
                        { headers: { Authorization: `Bearer ${token}` } });
                    getUsers();
                }
                catch (err) {
                    console.error(err);
                }
            }
        }
    };
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => {
                    if (rowData?.active) {
                        setUser(rowData);
                        editUser(rowData)
                    }
                    else
                        alert("You can't update details when you are not active")
                }} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteUser(rowData)} />
            </React.Fragment>
        );
    };

    const openNew = (rowdata) => {
        setAdd(true);

        setSubmitted(false);
        setUserDialog(true);
    };
    const exportCSV = () => {
        dt.current.exportCSV();
    };
    const addressBodyTemplate = (rowData) => {
        const { street, city, numOfBuilding } = rowData.address || {};
        return [street, numOfBuilding, city].filter(Boolean).join(' ');
    };
    const birthDateBodyTemplate = (rowData) => {
        if (rowData.birthDate)
            return format(rowData.birthDate, 'dd/MM/yyyy')
        return ""
    };
    const imageBodyTemplate = (rowData) => {
        if (!rowData?.image) return null;
        const imageUrl = rowData.image.startsWith('http')
            ? rowData.image
            : `http://localhost:1111${rowData.image}`;
        return (
            <img
                src={imageUrl}
                alt={rowData.fullname}
                style={{
                    maxWidth: 80,      // כל תמונה לא תעלה על 80 פיקסל ברוחב
                    maxHeight: 80,     // ולא תעלה על 80 פיקסל בגובה
                    width: 'auto',     // ישמור על הפרופורציה המקורית
                    height: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                    background: '#fff', // רקע אחיד (לשקיפויות)
                    margin: '0 auto',   // מרכז את התמונה במיכל
                    border: '1px solid #eee',
                    borderRadius: 8     // פינות עגולות עדינות, אפשר גם 0
                }}
            />
        );
    };
    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Dropdown
                    placeholder={selectedRole}
                    value={selectedRole}
                    options={[{ label: "All", value: null }, ...roles.map(r => ({ label: r, value: r }))]}
                    onChange={e => setSelectedRole(e.value)}
                    className="w-12rem ml-3"
                    defaultValue={roles[0]}
                />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-download" iconPos="right" className="p-button-help" onClick={exportCSV} />
    };
    return (

        <div className="card p-fluid">
            <Toast ref={toast} />

            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

            <DataTable ref={dt} value={filteredUsers ? filteredUsers : users} editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete} tableStyle={{ minWidth: '50rem' }}>
                <Column field="userId" header="ID" style={{ width: '10%' }}></Column>
                <Column field="fullname" header="Fullname" style={{ width: '10%' }}></Column>
                <Column field="email" header="Email" style={{ width: '10%' }}></Column>
                <Column field="phone" header="Phone" style={{ width: '10%' }}></Column>
                <Column field="address" header="Address" body={addressBodyTemplate} style={{ width: '10%' }}></Column>
                <Column field="birthDate" header="BirthDate" body={birthDateBodyTemplate} style={{ width: '10%' }}></Column>
                <Column field="role" header="Role" body={roleBodyTemplate} ></Column>
                <Column field="image" header="Image" body={imageBodyTemplate} style={{ width: '7%' }}></Column>
                <Column body={actionBodyTemplate} exportable={false} style={{ width: '8%' }}></Column>
            </DataTable>

            {user ? <UserForm setUser={setUser} user={user} setUserDialog={setUserDialog} getUsers={getUsers} userDialog={userDialog}></UserForm> : <></>}
            {add ? <UserForm setUserDialog={setUserDialog} getUsers={getUsers} userDialog={userDialog} setAdd={setAdd} ></UserForm> : <></>}

        </div>
    );
}