import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
const EnterNumberOfHours = ({
    //studentDialog, setStudentDialog , student,setStudent, 
    setIsOpen, isOpen, currentScholarship }) => {
    const [showMessage, setShowMessage] = useState(false);
    const [showMessageError, setShowMessageError] = useState(false);
    const { user, token, role } = useSelector((state) => state.token);
    const [maxHoursInCurMonth, setMaxHoursInCurMonth] = useState(0)
    const [formData, setFormData] = useState({});
    const defaultValues = {
        id: currentScholarship?._id,
        numHours: currentScholarship?.numHours ?? 0
    }
    const getNumHoursInCurMonth = async () => {
        const res = await axios.get("http://localhost:1111/api/monthlyScholarshipDetails/thisMonth",
             { headers: { Authorization: `Bearer ${token}` } })
        if (res.data != "")
            setMaxHoursInCurMonth(res.data.MaximumNumberOfHours)
        console.log(res.data);
    }
    useEffect(() => {
        getNumHoursInCurMonth()
    }, [])
    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });
    const onSubmit = async (data) => {
        data = { numHours: data.numHours, student: user._id, date: new Date(), sumMoney: 0 }//==================================
        //===============================>>
        if (currentScholarship !== "") {
            data = { ...data, id: currentScholarship._id }
            const res = await axios.put("http://localhost:1111/api/studentScholarship/",
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            )
        } else {
            const res = await axios.post("http://localhost:1111/api/studentScholarship/",
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            )
        }
        setIsOpen(false)
    }
    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };
    const studentDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={() => { setIsOpen(false) }} />
        </React.Fragment>
    );

    return (
        <>
            <Dialog visible={isOpen} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="student Details" modal className="p-fluid" footer={studentDialogFooter} onHide={() => { setIsOpen(false) }}>
                <div className="field">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                        <div className="field">
                            <span className="p-float-label">
                                <Controller
                                    name="numHours"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <InputText
                                            {...field}
                                            id="numHours"
                                            type="number"
                                            min={0}//
                                            max={maxHoursInCurMonth}//
                                            required
                                            className={classNames({ 'p-invalid': fieldState.invalid })}
                                        />
                                    )}
                                />
                                <label htmlFor="numHours" className={classNames({ 'p-error': errors.name })}>num of Hours*</label>
                            </span>
                            {getFormErrorMessage('numHours')}
                        </div>
                        {/* <div className="flex-auto">
                            <label htmlFor="minmax-buttons" className="font-bold block mb-2">Min-Max Boundaries</label>
                            <InputNumber inputId="minmax-buttons" value={value3} onValueChange={(e) => setValue3(e.value)} mode="decimal" showButtons min={0} max={100} />
                        </div> */}
                        <Button type="submit" label="Submit" className="mt-2" />
                    </form>

                </div>
            </Dialog>
        </>
    )
}
export default EnterNumberOfHours;