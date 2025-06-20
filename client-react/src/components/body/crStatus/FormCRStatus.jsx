import axios from "axios";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import CRStatus from "./CRStatus";
import { current } from "@reduxjs/toolkit";
const FormCRStatus = (props) => {
    const CRStatus = props.CRStatus
    const { token } = useSelector((state) => state.token);
    const [showMessage, setShowMessage] = useState(false);
    const [showMessageError, setShowMessageError] = useState(false);
    const [formData, setFormData] = useState();
    const defaultValues = {
        _id: CRStatus._id,
        date: CRStatus.date,
        action: CRStatus.action,
        sumPerAction: CRStatus.sumPerAction,
        currentSum: CRStatus.currentSum,
    }
    useEffect(() => {
        if (formData && showMessage == false) {
            props.setVisible(false)
            props.getAllCRStatuses()
        }
    }, [showMessage])

    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });

    const onSubmit = async (data) => {
        data.date = new Date()
        if (data.sumPerAction >= 0) {
            if (data._id === 0) {
                try {
                    const res = await axios.post("http://localhost:1111/api/cashRegisterStatus", data,
                        { headers: { Authorization: `Bearer ${token}` } })
                    setShowMessage(true);
                    setFormData(data);
                    reset();
                }
                catch (err) {
                    console.error(err);
                }
            }
            else {
                try {
                    const res = await axios.put(`http://localhost:1111/api/cashRegisterStatus`, data,
                        { headers: { Authorization: `Bearer ${token}` } })
                    setShowMessage(true);
                    setFormData(data);
                    reset();
                }
                catch (err) {
                    console.error(err);
                }
            }
        }
        else {
            setShowMessageError(true)
        }
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false)} /></div>;
    const errorUsername = <div className="flex justify-content-center"><Button label="ERROR" className="p-button-text" autoFocus onClick={() => setShowMessageError(false)} /></div>;

    return (<>{showMessage ? <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
        <div className="flex justify-content-center flex-column pt-6 px-3">
            <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                The operation was successful
            </p>
        </div>
    </Dialog> : <></>}
        <Dialog visible={props.visible} className="form-demo" onHide={() => props.setVisible(false)}>
            <Dialog visible={showMessageError} onHide={() => setShowMessageError(false)} position="top" footer={errorUsername} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="flex justify-content-center flex-column pt-6 px-3">
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        <h4>Invalid Data, You Need To Change It</h4>
                    </p>
                </div>
            </Dialog>
            <form onSubmit={handleSubmit(onSubmit)}></form>
            <div className="flex justify-content-center">
                <div className="card">
                    <h5 className="text-center">Add Expense</h5>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                        <div className="field">
                            <div className="inline-flex flex-column gap-2">
                                <label htmlFor="sumPerAction" className={classNames({ 'p-error': errors.name })}>Sum Per Action*</label>
                                <Controller name="sumPerAction" control={control} rules={{ required: 'sumPerAction is required.' }} render={({ field, fieldState }) => (
                                    <InputText type="number" id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} /> {getFormErrorMessage('sumPerAction')}</div>
                        </div>
                        <Button type="submit" label="Submit" className="mt-2" />
                        <Button type="button" label="Cancel" className="mt-2" onClick={() => { props.setVisible(false) }} />
                    </form>
                </div>
            </div></Dialog>
    </>
    )
}

export default FormCRStatus;