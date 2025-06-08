import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';

const UserForm = ({
    userDialog, setUserDialog, getUsers, user, setAdd, setUser, updateTheUser
}) => {
    const { token, role } = useSelector((state) => state.token);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [oldImageUrl, setOldImageUrl] = useState(user?.image || null);

    const defaultValues = {
        id: user?._id,
        fullname: user?.fullname,
        phone: user?.phone,
        email: user?.email,
        city: user?.address?.city || "",
        street: user?.address?.street || "",
        numOfBuilding: user?.address?.numOfBuilding || "",
        userId: user?.userId,
        birthDate: user?.birthDate ? new Date(user.birthDate) : null,
        role: user?.role || null,
        image: user?.image || null
    };

    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });

    const handleFileSelect = async (event) => {
        const prevImageUrl = selectedImage?.[0] || oldImageUrl;
    
        if (prevImageUrl) {
            try {
                await axios.delete('http://localhost:1111/api/user/delete-image', {
                    data: { url: prevImageUrl, _id: user?._id },
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) {
                console.error('Failed to delete previous image:', err);
            }
        }
    
        const formDataIm = new FormData();
        event.files.forEach((file) => formDataIm.append('image', file));
        try {
            const res = await axios.post('http://localhost:1111/api/user/upload-image', formDataIm, {
                headers: {
                    'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}`
                },
            });
            const uploadedImage = res.data.map((file) => file.url);
            setSelectedImage(uploadedImage);
            setOldImageUrl(uploadedImage[0]); 
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };
    //   const onClear = () => {
    //     setImages([]);
    //     console.log('Upload canceled');
    //   };

    // הסרת תמונה
    // const removeImage = () => {
    //     setSelectedImage(null);
    //     setPreviewUrl(null);
    // };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>;
    };

    function isValidIsraeliID(id) {
        id = String(id).trim();
        if (id.length < 5 || id.length > 9 || !/^\d+$/.test(id)) return false;
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
        if (user) setUser(false);
        else if (setAdd) setAdd(false);
        setUserDialog(false);
        reset();
        setSelectedImage(null);
        setPreviewUrl(null);
    };

    const roleOptions = [
        { label: 'Donor', value: 'Donor' },
        { label: 'Student', value: 'Student' },
    ];

    const onSubmit = async (data) => {
        try {
            data.image = selectedImage
            if (user?._id) {
                await axios.put("http://localhost:1111/api/user", data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
            } else if (user?.role === "Admin") {
                await axios.post("http://localhost:1111/api/user", data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
            }
            else {
                if (!data.role)
                    data.role = "Donor";
                await axios.post("http://localhost:1111/api/user", data);
            }
            hideDialog();
            if (updateTheUser) updateTheUser();
            if (getUsers) getUsers();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'שגיאה בשמירה');
        }
    };

    return (
        <>
            <Dialog
                visible={userDialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="User Details"
                modal
                className="p-fluid"
                onHide={hideDialog}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                    <div className="field">
                        <span className="p-float-label">
                            <Controller
                                name="fullname"
                                control={control}
                                rules={{ required: 'FullName is required.' }}
                                render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )}
                            />
                            <label htmlFor="fullname" className={classNames({ 'p-error': errors.fullname })}>FullName*</label>
                        </span>
                        {getFormErrorMessage('fullname')}
                    </div>
                    {setAdd && (
                        <div className="field">
                            <span className="p-float-label">
                                <Controller
                                    name="password"
                                    control={control}
                                    rules={{ required: 'Password is required.' }}
                                    render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} type="password" />
                                    )}
                                />
                                <label htmlFor="password" className={classNames({ 'p-error': errors.password })}>Password*</label>
                            </span>
                            {getFormErrorMessage('password')}
                        </div>
                    )}
                    <div className="field">
                        <span className="p-float-label">
                            <Controller
                                name="userId"
                                control={control}
                                rules={{
                                    required: 'UserId is required.',
                                    validate: value => isValidIsraeliID(value) || 'Please enter a valid Israeli ID number.'
                                }}
                                render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
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
                                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
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
                                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
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
                                        if (!value) return true;
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
                    <div>address:</div><br /><br />
                    <div className="field">
                        <span className="p-float-label">
                            <Controller name="city" control={control} render={({ field, fieldState }) => (
                                <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                            )} />
                            <label htmlFor="city" className={classNames({ 'p-error': errors.city })}>City</label>
                        </span>
                    </div>
                    <div className="field">
                        <span className="p-float-label">
                            <Controller name="street" control={control} render={({ field, fieldState }) => (
                                <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                            )} />
                            <label htmlFor="street" className={classNames({ 'p-error': errors.street })}>Street</label>
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
                                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )}
                            />
                            <label htmlFor="numOfBuilding" className={classNames({ 'p-error': !!errors.numOfBuilding })}>
                                Building Number
                            </label>
                        </span>
                        {getFormErrorMessage('numOfBuilding')}
                    </div>
                    {role === "Admin" && defaultValues.role !== "Admin" && (
                        <div className="field">
                            <span className="p-float-label">
                                <Controller
                                    name="role"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Dropdown id={field.name} required {...field} options={roleOptions} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )}
                                />
                                <label htmlFor="role" className={classNames({ 'p-error': errors.role })}>Role*</label>
                            </span>
                        </div>
                    )}
                    {/* הצגת תצוגה מקדימה של תמונה חדשה שהועלתה */}
                    {selectedImage && Array.isArray(selectedImage) && selectedImage.length > 0 && (
                        <div style={{ textAlign: 'center', margin: '10px 0' }}>
                            <img
                                src={selectedImage[0]}
                                alt="Preview"
                                style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '1px solid #eee' }}
                            />
                        </div>
                    )}

                    {/* הצגת תמונת משתמש קיימת אם אין תמונה חדשה */}
                    {(!selectedImage || selectedImage.length === 0) && user?.image && (
                        <div style={{ textAlign: 'center', margin: '10px 0' }}>
                            <img
                                src={user.image}
                                alt="User"
                                style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '1px solid #eee' }}
                            />
                        </div>
                    )}
                    {/* העלאת תמונה */}
                    <div className="field">
                        <span className="p-float-label">
                            <FileUpload
                                name="image"
                                url="http://localhost:1111/api/user/upload-image" // Replace with the correct API endpoint
                                multiple // Allow selecting multiple files
                                accept="image/*" // Accept only image files
                                maxFileSize={100000000} // Max file size: 1MB
                                onUpload={handleFileSelect}
                                chooseLabel={"update image"}
                                cancelLabel="cacel"
                                uploadLabel="Upload"
                                auto
                            />
                        </span>
                    </div>
                    <Button type="submit" label="Submit" className="mt-2" />
                </form>
            </Dialog>
        </>
    );
};

export default UserForm;