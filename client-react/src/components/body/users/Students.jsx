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

export default function Students() {
    const funcReuturnButtonUpdate = (user) => {
        return <Button onClick={() => {
            setActiveComponenentUpdate(true)
            // setUserUpdate(user)
        }} icon="pi pi-pencil" rounded severity="primary" aria-label="Cancel" />
    }
    const showNotUsersExists = () => {
        return (
            <>
                <div className="flex justify-content-center mb-4">
                    <h1>No Users Exists!!!!!</h1></div>
            </>
        )
    }
    const [students, setStudents] = useState([]);
    const [student, setStudent] = useState({});
    const [studentDialog, setStudentDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [deleteStudentDialog, setDeleteStudentDialog] = useState(false);
    const [selectedStudents, setselectedStudents] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false)
    const [roles] = useState(['Student', 'Donor', 'Admin']);
    const { token, role } = useSelector((state) => state.token);
    const toast = useRef(null);
    const [activeComponenentAdd, setActiveComponenentAdd] = useState(false);
    const [activeComponenentUpdate, setActiveComponenentUpdate] = useState(false);
    const dt = useRef(null);
    let defaultValues = {
        id:null ,
        fullname:  student?.fullname,
        phone: null,
        email: '',
        address: null,
        birthDate: '',
        role: '',
        userId: ''
    };
    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });

    const getStudents = async () => {
        const res = await axios.get("http://localhost:1111/api/user/student",
            { headers: { Authorization: `Bearer ${token}` } }
        )
        setStudents(res.data)
    }
    useEffect(() => {
        getStudents();
    }, []);

    const onSubmit = async (data) => {
        console.log(data);
        const res = await axios.post("http://localhost:1111/api/student",
            data,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        setStudents(res.data)
    }

    const handleDelete = async (rowData) => {
        if (window.confirm(`Are you sure you want to delete ${rowData.fullname}?`)) {
            const res = await axios.delete(`http://localhost:1111/api/user/${rowData._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            console.log(res);
            getStudents();
        }
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => {}} />
                {/* <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() =>{ confirmDeleteStudent(rowData)}} /> */}
            </React.Fragment>
        );
    };
    const studentDialogFooter = (
        <React.Fragment>
            {/* <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} /> */}
        </React.Fragment>
    );
    const exportCSV = () => {
        dt.current.exportCSV();
    }
    const confirmDeleteSelected = () => {
        setDeleteStudentDialog(true);
    };
    const openNew=()=>{

    }
    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedStudents || !selectedStudents.length} />
            </div>
        );
    };
    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };
    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };
    const roleBodyTemplate=()=>{
        return <Tag value={student.role} severity="success" />;
    }
    return (
        <div className="card p-fluid">
            <Toast ref={toast} />

            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
            <DataTable ref={dt} value={students} editMode="row" dataKey="id"  tableStyle={{ minWidth: '50rem' }}>
                <Column field="userId" header="ID" style={{ width: '10%' }}></Column>
                <Column field="fullname" header="Fullname" style={{ width: '10%' }}></Column>
                <Column field="email" header="Email" style={{ width: '10%' }}></Column>
                <Column field="phone" header="Phone" style={{ width: '10%' }}></Column>
                <Column field="address" header="Address" style={{ width: '10%' }}></Column>
                <Column field="birthDate" header="BirthDate" style={{ width: '30%' }}></Column>
                <Column field="role" header="Role" body={roleBodyTemplate} style={{ width: '10%' }}></Column>
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
            </DataTable>



            <Dialog visible={studentDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="student Details" modal className="p-fluid" footer={studentDialogFooter} onHide={false}>
                <div className="field">

                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="fullname" control={control} rules={{ required: 'FullName is required.' }} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })}  />
                                )} />
                                <label htmlFor="fullname" className={classNames({ 'p-error': errors.name })}>FullName*</label>
                            </span>
                            {getFormErrorMessage('fullname')}
                        </div>
                        <div className="field">
                            <span className="p-float-label p-input-icon-right">
                                {/* <i className="pi pi-envelope" /> */}
                                <Controller name="email" control={control}
                                    rules={{ required: 'Email is required.', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Invalid email address. E.g. example@email.com' } }}
                                    render={({ field, fieldState }) => (
                                        <InputText id={field.email} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )} />
                                <label htmlFor="email" className={classNames({ 'p-error': !!errors.email })}>Email*</label>
                            </span>
                            {getFormErrorMessage('email')}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="userId" control={control} rules={{ required: 'userId is required.' }} render={({ field, fieldState }) => (
                                    <InputText id={field.userId} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })}  />
                                )} />
                                <label htmlFor="userId" className={classNames({ 'p-error': errors.name })}>userId*</label>
                            </span>
                            {getFormErrorMessage('username')}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="phone" control={control} render={({ field, fieldState }) => (
                                    <InputText id={field.phone} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })}  defaultValue={student?.phone} />
                                )} />
                                <label htmlFor="phone" className={classNames({ 'p-error': errors.name })}>Phone</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="address" control={control} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="address" className={classNames({ 'p-error': errors.name })}>Address</label>
                            </span>

                        </div>
                        <Button type="submit" label="Submit" className="mt-2" />
                    </form>


                    {/* <label htmlFor="userId" className="font-bold">ID</label>
                    <InputText id="userId" value={student.userId} onChange={(e) => onInputChange(e, 'userId')} required autoFocus className={classNames({ 'p-invalid': submitted && !student.userId })} />
                    {submitted && !student.userId && <small className="p-error">ID is required.</small>}
                    
                    <label htmlFor="fullname" className="font-bold">Fullname</label>
                    <InputText id="fullname" value={student.fullname} onChange={(e) => onInputChange(e, 'fullname')} required autoFocus className={classNames({ 'p-invalid': submitted && !student.fullname })} />
                    {submitted && !student.fullname && <small className="p-error">Fullname is required.</small>}
                    
                    <label htmlFor="phone" className="font-bold">Phone</label>
                    <InputText id="phone" value={student.phone} onChange={(e) => onInputChange(e, 'phone')} required autoFocus className={classNames({ 'p-invalid': submitted && !student.phone })} />
                    {/* {submitted && !student.phone && <small className="p-error">Phone is required.</small>} */}

                    {/* <label htmlFor="email" className="font-bold">Email</label>
                    <InputText id="phone" value={student.phone} onChange={(e) => onInputChange(e, 'phone')} required autoFocus className={classNames({ 'p-invalid': submitted && !student.phone })} />
                    {/* {submitted && !student.phone && <small className="p-error">Phone is required.</small>} */}

                    {/* <label for="email">Email Address:</label>
                    <input type="email" id="email" name="email" placeholder="Enter your email" required>
                </div>
                

                <div className="formgrid grid"> */}

                </div>
            </Dialog>
        </div>
    );
}