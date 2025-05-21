import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
// import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css'; // Theme
import 'primereact/resources/primereact.min.css'; // PrimeReact components
import 'primeicons/primeicons.css'; // PrimeReact icons
import 'primeflex/primeflex.css'; // Responsive design
import axios from "axios";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PaymentPage from './PaymentPage';
import { Dialog } from 'primereact/dialog';

const CreateContribution = (props) => {
    const [rate, setRate] = useState(null);
    const [checkPay, setCheckPay] = useState(false);

    const { token, role, user } = useSelector((state) => state.token);
    const [visiblePay, setVisiblePay] = useState(false);
    const [coinType, SetConiType] = useState(null)
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        sumContribution: props.contribution?.sumContribution || 100,
        date: props.contribution?.date || null,
        donor: props.contribution?.donor || null,
        id: props.contribution?._id || 0,
    });
useEffect(()=>{
console.log(props.contribution );

},[])
    const coinOptions = [
        { label: '$', value: '$' },
        { label: '₪', value: '₪' },
    ];

    // const dayOptions = [
    //     { label: '15', value: 15 },
    //     { label: '14', value: 14 },
    // ];


    const handleChange = (e, fieldName) => {
        setFormData({ ...formData, [fieldName]: e.target.value });
    };

    const handleSubmit = async (e) => {
        
        e.preventDefault();
        formData.donor = user._id;
        formData.date = new Date();
        formData.id=props.contribution?._id||0
        if (coinType === '$') {
            fetch("https://api.exchangerate.host/latest?base=USD&symbols=ILS")
                .then((res) => res.json())
                .then((result) => {
                    const rate = result.rates.ILS;
                    setRate(rate); // This can be updated in your state if needed
                    formData.sumContribution *= rate;
                    console.log(formData.sumContribution);
                })
                .catch((error) => {
                    console.error("Error fetching exchange rate:", error);
                });
        }
        setVisiblePay(true);

    }

    // Logic for saving data to the server can be added here
    return (
        <>
            <Dialog visible={props.visible} onHide={()=>props.setVisible(false)}>
                <div className="card flex justify-content-center">
                    <div className="p-fluid">
                        <h2>Enter donation details</h2>
                        <div className="field">
                            <label htmlFor="sumContribution">Sum Contribution</label>
                            <InputText
                                id="sumContribution"
                                defaultValue={props.contribution?.sumContribution||100}
                                onChange={(e) => handleChange(e, 'sumContribution')}
                                type="number"
                                required
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="coinType">Currency Type</label>
                            <Dropdown
                                id="coinType"
                                value={coinType}
                                onChange={(e) => {
                                    SetConiType(e.value)
                                    handleChange(e, 'coinType')
                                }}
                                options={coinOptions}
                                placeholder="Select currency type"
                                required
                            />
                        </div>
                        <Button
                            label="Submit"
                            icon="pi pi-check"
                            className="p-button-success"
                            onClick={handleSubmit}
                        />
                    </div></div>
            </Dialog>
            <PaymentPage checkPay={checkPay}  formData={formData}  getAllContributions={ props.getAllContributions} setVisibleFather={props.setVisible} setCheckPay={setCheckPay} visible={visiblePay} setVisible={setVisiblePay} sumContribution={formData.sumContribution}
            />
        </>
    );
};

export default CreateContribution;