import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Calendar } from 'primereact/calendar';
import axios from 'axios';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
import { useSelector } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { useRef } from 'react';
//import { emit } from '../../../../../server node/models/User';
import { Toolbar } from 'primereact/toolbar';
import { useForm, Controller } from 'react-hook-form';
import UserForm from './userForm';
import { format } from 'date-fns';
import { useSearchParams } from 'react-router-dom';


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
    // let defaultValues = {
    //     id: null,
    //     fullname: student?.fullname,
    //     phone: null,
    //     email: '',
    //     city: student?.address?.city || "",
    //     street: student?.address?.street || "",
    //     buildingNumber: student?.address?.buildingNumber || "",
    //     birthDate: '',
    //     roles: '',
    //     userId: ''
    // };
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
    // const dateEditor = (options) => {
    //     //const [date, setDate] = useState(options.value);
    //     console.log(options.value);
    //     // const dateValue = options.value ? new Date(options.value) : null;

    //     return (<div className="card flex justify-content-center">//
    //         <Calendar value={options.value}  //dateFormat="dd/mm/yy" 
    //             onChange={(e) => options.editorCallback(e.value.toLocaleDateString())} />
    //     </div>
    //         //<InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    //     )
    // };
    // const textEditor = (options) => {
    //     return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    // };


    // const roleEditor = (options) => {
    //     return (
    //         <Dropdown
    //             value={options.value}
    //             options={roles}
    //             onChange={(e) => options.editorCallback(e.value)}
    //             placeholder="Select a Role"
    //             itemTemplate={(option) => {
    //                 return <Tag value={option}
    //                 ></Tag>;
    //             }}
    //         />
    //     );
    // };

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
    // const handleDelete = async (rowData) => {
    //     const res = await axios.delete(`http://localhost:1111/api/user/${rowData._id}`,
    //         { headers: { Authorization: `Bearer ${token}` } })
    //     getUsers();
    // };

    const editUser = (user) => {
        setUser(user);
        setUserDialog(true);
    };

    // const hideDialog = () => {
    //     setSubmitted(false);
    //     setUserDialog(false);
    // };
    const confirmDeleteUser = async (user) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            {
                try {
                    const res = await axios.put(`http://localhost:1111/api/user/${user._id}`, {},
                        { headers: { Authorization: `Bearer ${token}` } });
                    getUsers();
                }

                catch (err) {
                    console.error(err);
                }
            }
        }
        // setUser(student);
        // setDeleteStudentDialog(true);
    };
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => {
                    if (rowData?.active) {
                        setUser(rowData); editUser(rowData)
                    }
                    else
                        alert("You can't update details when you are not active")
                }} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteUser(rowData)} />
            </React.Fragment>
        );
    };
    // const hideDeleteUsersDialog = () => {
    //     setDeleteUserDialog(false);
    // };

    const openNew = (rowdata) => {
        setAdd(true);

        setSubmitted(false);
        setUserDialog(true);
    };
    const exportCSV = () => {
        dt.current.exportCSV();
    };
    // const confirmDeleteSelected = () => {
    //     setDeleteStudentDialog(true);
    // };
    const addressBodyTemplate = (rowData) => {
        const { street, city, numOfBuilding } = rowData.address || {};
        return [street, numOfBuilding, city].filter(Boolean).join(' ');
    };
    const birthDateBodyTemplate = (rowData) => {
        if (rowData.birthDate)
            return format(rowData.birthDate, 'dd/MM/yyyy')
        return ""
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
                <Column field="birthDate" header="BirthDate" body={birthDateBodyTemplate} style={{ width: '30%' }}></Column>
                <Column field="role" header="Role" body={roleBodyTemplate} ></Column>
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
            </DataTable>

            {/* <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirm" modal footer={
                <React.Fragment>
                    <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteUsersDialog} />
                    <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={() => { handleDelete(user); hideDeleteUsersDialog(); }} />
                </React.Fragment>
            } onHide={hideDeleteUsersDialog}> */}
            {/* <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle" style={{ fontSize: '2rem' }} />
                    {user && (<span>Are you sure you want to delete <b>{user.fullname}</b>?</span>)}
                </div> */}
            {/* </Dialog> */}

            {user ? <UserForm setUser={setUser} user={user} setUserDialog={setUserDialog} getUsers={getUsers} userDialog={userDialog}></UserForm> : <></>}
            {add ? <UserForm setUserDialog={setUserDialog} getUsers={getUsers} userDialog={userDialog} setAdd={setAdd} ></UserForm> : <></>}

        </div>
    );
}