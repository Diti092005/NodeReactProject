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
    const dt = useRef(null);
    let defaultValues = {
        id:null ,
        fullname:  student?.fullname,
        phone: null,
        email: '',
        address: null,
        birthDate: '',
        roles: '',
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
        const res = await axios.post("http://localhost:1111/api/user",
            data,
            { headers: { Authorization: `Bearer ${token}` } }

        )
        setStudents(res.data)

    }


    const onRowEditComplete = (e) => {
        let _students = [...students];
        let { newData, index } = e;

        _students[index] = newData;

        setStudents(_students);
    };






    const dateEditor = (options) => {
        //const [date, setDate] = useState(options.value);
        console.log(options.value);
        // const dateValue = options.value ? new Date(options.value) : null;

        return (<div className="card flex justify-content-center">//
            <Calendar value={options.value}  //dateFormat="dd/mm/yy" 
                onChange={(e) => options.editorCallback(e.value.toLocaleDateString())} />
        </div>
            //<InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
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



    // פונקציית מחיקה
    const handleDelete = async (rowData) => {
        if (window.confirm(`Are you sure you want to delete ${rowData.fullname}?`)) {
            const res = await axios.delete(`http://localhost:1111/api/user/${rowData._id}`)
            console.log(res);
            getStudents();
        }
        // עדכון ה-state
    };

    // // תבנית כפתור מחיקה
    // const deleteButtonTemplate = (rowData) => {
    //     return (
    //         <Button
    //             icon="pi pi-trash"
    //             className="p-button-danger"
    //             onClick={() => handleDelete(rowData)}
    //         />
    //     );
    // };
    const editStudent = (student) => {
        console.log("hhhh",student);
        setStudent({ ...student });
        setStudentDialog(true);
    };
    const hideDialog = () => {
        setSubmitted(false);
        setStudentDialog(false);
    };
    const confirmDeleteStudent = (student) => {
        setStudent(student);
        setDeleteStudentDialog(true);
    };
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editStudent(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteStudent(rowData)} />
            </React.Fragment>
        );
    };
    const hideDeleteStudentsDialog = () => {
        setDeleteStudentDialog(false);
    };
    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < students.length; i++) {
            if (students[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };
    // const saveStudent = () => {
    //     setSubmitted(true);
    //     console.log("student", student);
    //     if (student.fullname.trim()) {
    //         let _students = [...students];
    //         let _student = { ...student };
    //         console.log(student);
    //         // if (student.id) {
    //         //     const index = findIndexById(student.id);

    //         // _students[index] = _student;
    //         toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Student Updated', life: 3000 });
    //     } else {
    //         // _student.id = createId();
    //         // _students.push(_student);
    //         toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Student Created', life: 3000 });
    //     }

    //     setStudents(_students);
    //     setStudentDialog(false);
    //     setStudent(emptyStudent);
    // }

    const studentDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            {/* <Button label="Save" icon="pi pi-check" onClick={saveStudent} /> */}
        </React.Fragment>
    );
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _student = { ...student };

        _student[`${name}`] = val;

        setStudent(_student);
    };
    const openNew = () => {
console.log("kkkk");
        // setStudent(emptyStudent);
        setSubmitted(false);
        setStudentDialog(true);
    };
    const exportCSV = () => {
        dt.current.exportCSV();
    };
    const confirmDeleteSelected = () => {
        setDeleteStudentDialog(true);
    };
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
    return (
        <div className="card p-fluid">
            <Toast ref={toast} />

            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

            <DataTable value={students} editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete} tableStyle={{ minWidth: '50rem' }}>
                <Column field="userId" header="ID" style={{ width: '10%' }}></Column>
                <Column field="fullname" header="Fullname" style={{ width: '10%' }}></Column>
                <Column field="email" header="Email" style={{ width: '10%' }}></Column>
                <Column field="phone" header="Phone" style={{ width: '10%' }}></Column>
                <Column field="address" header="Address" style={{ width: '10%' }}></Column>
                <Column field="birthDate" header="BirthDate" style={{ width: '30%' }}></Column>
                <Column field="roles" header="Role" body={roleBodyTemplate} style={{ width: '10%' }}></Column>
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>

            </DataTable>



            <Dialog visible={studentDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="student Details" modal className="p-fluid" footer={studentDialogFooter} onHide={hideDialog}>
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