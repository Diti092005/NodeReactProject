import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Calendar } from 'primereact/calendar';
const UserForm = ({ studentDialog, setStudentDialog, getStudents, student, setAdd, setStudent, updateTheUser }) => {
    const [showMessage, setShowMessage] = useState(false);
    const [showMessageError, setShowMessageError] = useState(false);
    const { token, role } = useSelector((state) => state.token);

    const [formData, setFormData] = useState();
    const defaultValues = {
        id: student?._id,
        fullname: student?.fullname,
        phone: student?.phone,
        email: student?.email,
        city: student?.address?.city || "",
        street: student?.address?.street || "",
        buildingNumber: student?.address?.numOfBulding || "",
        role: student?.role,
        userId: student?.userId,
        birthDate: student?.birthDate,
        role: student?.role || null
    }
    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });

    const onSubmit = async (data) => {
        data = { ...data, role: "Student" }
        if (student._id) {
            console.log(student);
            const res = await axios.put("http://localhost:1111/api/user",
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            )
        }
        else {
            const res = await axios.post("http://localhost:1111/api/user",
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            )
        }
        hideDialog()
        if (updateTheUser)
            updateTheUser()
        if (getStudents)
            getStudents()

    }
    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };
    const studentDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={() => { hideDialog() }} />
            {/* <Button label="Save" icon="pi pi-check" onClick={save } /> */}
        </React.Fragment>
    );

    const hideDialog = () => {
        if (student) {
            setStudent(false)
        }
        else {
            if (setAdd)
                setAdd(false)
        }
        setStudentDialog(false);
    }
    useEffect(() => {
        console.log(student);
    }, [])
    return (
        <>
            <Dialog visible={studentDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="student Details" modal className="p-fluid" footer={studentDialogFooter} onHide={() => { hideDialog() }}>
                <div className="field">

                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="fullname" control={control} rules={{ required: 'FullName is required.' }} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="fullname" className={classNames({ 'p-error': errors.name })}>FullName*</label>
                            </span>
                            {getFormErrorMessage('fullname')}
                        </div>
                        {setAdd && <div className="field">
                            <span className="p-float-label">
                                <Controller name="password" control={control} rules={{ required: 'Password is required.' }} render={({ field, fieldState }) => (
                                    <InputText id={field.password} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="password" className={classNames({ 'p-error': errors.name })}>Password*</label>
                            </span>
                            {getFormErrorMessage('password')}
                        </div>}
                        <div className="field">
                            <span className="p-float-label p-input-icon-right">
                                {/* <i className="pi pi-envelope" /> */}
                                <Controller name="email" control={control}
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
                                    <InputText id={field.userId} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="userId" className={classNames({ 'p-error': errors.name })}>userId*</label>
                            </span>
                            {getFormErrorMessage('username')}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="phone" control={control} render={({ field, fieldState }) => (
                                    <InputText id={field.phone} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} defaultValue={student?.phone} />
                                )} />
                                <label htmlFor="phone" className={classNames({ 'p-error': errors.name })}>Phone</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller
                                    name="birthDate"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Calendar
                                            id={field.birthDate}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            dateFormat="dd/mm/yy" // אפשר לשנות לפורמט אחר
                                            className={classNames({ 'p-invalid': fieldState.invalid })}
                                            showIcon // מציג אייקון של לוח שנה
                                        />
                                    )}
                                />
                                <label htmlFor="birthDate" className={classNames({ 'p-error': errors.birthDate })}>
                                    Birth Date
                                </label>
                            </span>
                        </div>

                        <div>address:</div>
                        <br></br>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="city" control={control} render={({ field, fieldState }) => (
                                    <InputText id={field.city} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="city" className={classNames({ 'p-error': errors.name })}>City</label>
                            </span>

                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="street" control={control} render={({ field, fieldState }) => (
                                    <InputText id={field.street} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="street" className={classNames({ 'p-error': errors.name })}>Street</label>
                            </span>

                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="numOfBuilding" control={control} render={({ field, fieldState }) => (
                                    <InputText id={field.buildingNumber} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="numOfBuilding" className={classNames({ 'p-error': errors.name })}>Building Number</label>
                            </span>

                        </div>
                        <Button type="submit" label="Submit" className="mt-2" />
                    </form>

                </div>
            </Dialog>
        </>
    )
}
export default UserForm;