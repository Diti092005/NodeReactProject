import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { Password } from 'primereact/password';
import { useDispatch } from 'react-redux';
const AuthLogin = (props) => {
    const [showMessage, setShowMessage] = useState(false);
    const [showMessageError, setShowMessageError] = useState(false);
    const [formData, setFormData] = useState();
    const defaultValues = {
        password: '',
        userId: '',
    }
    // useEffect(() => {
    // //     if (formData && showMessage == false) {
    // //         props.setActiveComponenent(false)
    // //         props.getUsers()
    // //     }
    // // }, [showMessage])

    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });

    const onSubmit = async (data) => {
        // const users = await axios.get("http://localhost:1234/api/users")
        // const sameUser = users?.data.find(user => user.username === data.username)
        // if (sameUser == null) {
        //     const res = await axios.post("http://localhost:1234/api/users", data)
        //     setShowMessage(true);
        //     setFormData(data);
        //     reset();
        // }
        // else {
        //     setShowMessageError(true)
        // }
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false)} /></div>;
    const errorUsername = <div className="flex justify-content-center"><Button label="ERROR" className="p-button-text" autoFocus onClick={() => setShowMessageError(false)} /></div>;


    return (<>
        <Dialog visible={props.activeComponenent} className="form-demo" onHide={() => props.setActiveComponenent(false)}>
            <div className="flex justify-content-center">
                <div className="card">
                    <h5 className="text-center">Login</h5>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="userId" control={control} rules={{ required: 'userId is required.' }} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="userId" className={classNames({ 'p-error': errors.name })}>userId*</label>
                            </span>
                            {getFormErrorMessage('fullname')}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="password" control={control} rules={{ required: 'Password is required.' }} render={({ field, fieldState }) => (
                                    <Password id={field.name} {...field} toggleMask className={classNames({ 'p-invalid': fieldState.invalid })}  />
                                )} />
                                <label htmlFor="password" className={classNames({ 'p-error': errors.password })}>Password*</label>
                            </span>
                            {getFormErrorMessage('password')}
                        </div>
                        <Button type="submit" label="Submit" className="mt-2" />
                    </form>
                </div>
            </div>
        </Dialog></>
    );
}

export default AuthLogin