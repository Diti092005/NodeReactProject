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

export default function Students() {
    const [donors, setDonors] = useState([]);
    const [roles] = useState(['Student', 'Donor', 'Admin']);
    const getDonors = async () => {
        const res = await axios.get("http://localhost:1111/api/user/donor")
        setDonors(res.data)

    }
    useEffect(() => {
        getDonors();
    }, []); 



    const onRowEditComplete = (e) => {
        let _donors = [...donors];
        let { newData, index } = e;

        _donors[index] = newData;

        setDonors(_donors);
    };






    const dateEditor = (options) => {

        return (<div className="card flex justify-content-center">//
            <Calendar value={options.value}  //dateFormat="dd/mm/yy" 
                onChange={(e) => options.editorCallback(e.value.toLocaleDateString())} />
        </div>
        )
    };
    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };


    const roleEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={roles}
                onChange={(e) => options.editorCallback(e.value)}
                placeholder="Select a Role"
                itemTemplate={(option) => {
                    return <Tag value={option}
                    ></Tag>;
                }}
            />
        );
    };

    
    const roleBodyTemplate = (rowData) => {
        return <Tag value={rowData.roles} ></Tag>;
    };


    // 

    const allowEdit = (rowData) => {
        return rowData.name !== 'Blue Band';
    };
     // פונקציית מחיקה
     const handleDelete = async(rowData) => {
        if (window.confirm(`Are you sure you want to delete ${rowData.fullname}?`)) {
        const res = await axios.delete(`http://localhost:1111/api/user/${ rowData._id}`)
        console.log(res);
        getStudents();}
        // עדכון ה-state
    };

    // תבנית כפתור מחיקה
    const deleteButtonTemplate = (rowData) => {
        return (
            <Button
                icon="pi pi-trash"
                className="p-button-danger"
                onClick={() => handleDelete(rowData)}
            />
        );
    };

    return (
        <div className="card p-fluid">
            <DataTable value={students} editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete} tableStyle={{ minWidth: '50rem' }}>
                <Column field="userId" header="ID" editor={(options) => textEditor(options)} style={{ width: '10%' }}></Column>
                <Column field="password" header="Password" editor={(options) => textEditor(options)} style={{ width: '10%' }}></Column>
                <Column field="fullname" header="Fullname" editor={(options) => textEditor(options)} style={{ width: '10%' }}></Column>
                <Column field="email" header="Email" editor={(options) => textEditor(options)} style={{ width: '10%' }}></Column>
                <Column field="phone" header="Phone" editor={(options) => textEditor(options)} style={{ width: '10%' }}></Column>
                <Column field="address" header="Address" editor={(options) => textEditor(options)} style={{ width: '10%' }}></Column>
                <Column field="birthDate" header="BirthDate" editor={(options) => dateEditor(options)} style={{ width: '30%' }}></Column>
                <Column field="roles" header="Role" body={roleBodyTemplate} editor={(options) => roleEditor(options)} style={{ width: '10%' }}></Column>

                
                <Column rowEditor={allowEdit} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                <Column
                body={deleteButtonTemplate}
                header="Delete"
                style={{ textAlign: 'center', width: '10%' }}
            ></Column>
            </DataTable>
            <div className="flex justify-content-right mb-4">
                <p>
                    <Button icon="pi pi-users" rounded severity="primary" aria-label="User"
                        onClick={() => { setActiveComponenentAdd(true) }}>    Add Students</Button></p></div>

        </div>
    );
}