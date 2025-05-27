import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
const UserForm = ({ userDialog, setUserDialog, getUsers, user, setAdd, setUser, updateTheUser }) => {
    const [showMessage, setShowMessage] = useState(false);
    const [showMessageError, setShowMessageError] = useState(false);
    const { token, role } = useSelector((state) => state.token);

    const [formData, setFormData] = useState();
    const defaultValues = {
        id: user?._id,
        fullname: user?.fullname,
        phone: user?.phone,
        email: user?.email,
        city: user?.address?.city || "",
        street: user?.address?.street || "",
        numOfBuilding: user?.address?.numOfBuilding || "",
        // role: user?.role || "Donor",
        userId: user?.userId,
        birthDate: user?.birthDate ? new Date(user.birthDate) : null,
        role: user?.role || null
    }
    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });

    const onSubmit = async (data) => {
        console.log(data);
        if (user?._id) {
            try {
                const res = await axios.put("http://localhost:1111/api/user",
                    data,
                    { headers: { Authorization: `Bearer ${token}` } })
            }
            catch (err) {
                console.error(err);
            }
        }
        else {
            if (!data.role) {
                data.role = "Donor"
                try {
                    const res = await axios.post("http://localhost:1111/api/auth/register",
                        data,
                        { headers: { Authorization: `Bearer ${token}` } }
                    )
                }
                catch (err) {
                    console.error(err);
                }
            }
            else {
                try {
                    const res = await axios.post("http://localhost:1111/api/user",
                        data,
                        { headers: { Authorization: `Bearer ${token}` } }
                    )
                }
                catch (err) {
                    console.error(err);
                }
            }
        }
        hideDialog()
        if (updateTheUser)
            updateTheUser()
        if (getUsers)
            getUsers()
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
    function isValidIsraeliID(id) {
        id = String(id).trim();
        if (id.length < 5 || id.length > 9 || !/^\d+$/.test(id)) return false;
        // השלמה ל-9 ספרות
        id = id.padStart(9, '0');
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            let num = Number(id[i]) * ((i % 2) + 1);
            if (num > 9) num -= 9;
            sum += num;
        }
        return sum % 10 === 0;
    }
    const hideDialog = () => {
        if (user) {
            setUser(false)
        }
        else {
            if (setAdd)
                setAdd(false)
        }
        setUserDialog(false);
    }
    const roleOptions = [
        { label: 'Donor', value: 'Donor' },
        { label: 'Student', value: 'Student' },
    ];
    useEffect(() => {
    }, [])
    // footer={userDialogFooter}
    return (
        <>
            <Dialog visible={userDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="User Details" modal className="p-fluid" onHide={() => { hideDialog() }}>
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
                            <span className="p-float-label">
                                <Controller
                                    name="userId"
                                    control={control}
                                    rules={{
                                        required: 'UserId is required.',
                                        validate: value =>
                                            isValidIsraeliID(value) || 'Please enter a valid Israeli ID number.'
                                    }}
                                    render={({ field, fieldState }) => (
                                        <InputText
                                            id={field.name}
                                            {...field}
                                            autoFocus
                                            className={classNames({ 'p-invalid': fieldState.invalid })}
                                        />
                                    )}
                                />
                                <label htmlFor="userId" className={classNames({ 'p-error': errors.userId })}>userId*</label>
                            </span>
                            {getFormErrorMessage('userId')}
                        </div>
                        <div className="field">
                            <span className="p-float-label p-input-icon-right">
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{
                                        pattern: {
                                            value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/,
                                            message: 'Invalid email address'
                                        }
                                    }}
                                    render={({ field, fieldState }) => (
                                        <InputText
                                            id={field.name}
                                            {...field}
                                            className={classNames({ 'p-invalid': fieldState.invalid })}
                                        />
                                    )}
                                />
                                <label htmlFor="email" className={classNames({ 'p-error': !!errors.email })}>Email</label>
                            </span>
                            {getFormErrorMessage('email')}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller
                                    name="phone"
                                    control={control}
                                    rules={{
                                        pattern: {
                                            value: /^0(5\d-?\d{7}|[23489]-?\d{7}|7[2-9]\d-?\d{7})$/,
                                            message: "Please enter a valid Israeli mobile or landline phone number."
                                        }
                                    }}
                                    render={({ field, fieldState }) => (
                                        <InputText
                                            id={field.name}
                                            {...field}
                                            autoFocus
                                            className={classNames({ 'p-invalid': fieldState.invalid })}
                                        />
                                    )}
                                />

                                <label htmlFor="phone" className={classNames({ 'p-error': errors.phone })}>Phone</label>
                            </span>
                            {getFormErrorMessage('phone')}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller
                                    name="birthDate"
                                    control={control}
                                    rules={{
                                        validate: value => {
                                            if (!value) return true
                                            // Assuming value is a Date object. If string, convert: new Date(value)
                                            const birth = new Date(value);
                                            const today = new Date();
                                            let age = today.getFullYear() - birth.getFullYear();
                                            const m = today.getMonth() - birth.getMonth();
                                            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                                                age--;
                                            }
                                            return age >= 18 ? true : 'You must be at least 18 years old';
                                        }
                                    }}
                                    render={({ field, fieldState }) => (
                                        <Calendar
                                            id={field.name}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            dateFormat="dd/mm/yy"
                                            className={classNames({ 'p-invalid': fieldState.invalid })}
                                            showIcon
                                        />
                                    )}
                                />
                                <label htmlFor="birthDate" className={classNames({ 'p-error': errors.birthDate })}>
                                    Birth Date
                                </label>
                            </span>
                            {getFormErrorMessage('birthDate')}
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
                                <Controller
                                    name="numOfBuilding"
                                    control={control}
                                    rules={{
                                        pattern: {
                                            value: /^[0-9]+$/,
                                            message: 'Building number must be a number'
                                        }
                                    }}
                                    render={({ field, fieldState }) => (
                                        <InputText
                                            id={field.name}
                                            {...field}
                                            autoFocus
                                            className={classNames({ 'p-invalid': fieldState.invalid })}
                                        />
                                    )}
                                />
                                <label htmlFor="numOfBuilding" className={classNames({ 'p-error': !!errors.numOfBuilding })}>
                                    Building Number
                                </label>
                            </span>
                            {getFormErrorMessage('numOfBuilding')}
                        </div>

                        {role === "Admin" && defaultValues.role !== "Admin" && <div className="field">
                            <span className="p-float-label">
                                <Controller name="role" control={control} render={({ field, fieldState }) => (
                                    <Dropdown id={field.role} required {...field} options={roleOptions} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })}
                                    />
                                )} />
                                <label htmlFor="role" className={classNames({ 'p-error': errors.name })}>Role*</label>
                            </span></div>}
                        <Button type="submit" label="Submit" className="mt-2" />
                    </form>

                </div>
            </Dialog>
        </>
    )
}
export default UserForm;