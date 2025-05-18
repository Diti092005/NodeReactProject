import React, { useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PaymentPage from './PaymentPage';

const CreateContribution = (props) => {
    const { token, role, user } = useSelector((state) => state.token);
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        sumContribution: 100,
        date: null,
        donor: null,
    });

    const coinOptions = [
        { label: '$', value: '$' },
        { label: '₪', value: '₪' },
    ];

    // const dayOptions = [
    //     { label: '15', value: 15 },
    //     { label: '14', value: 14 },
    // ];

    const eventOptions = [
        { label: 'Pesach', value: 'Pesach' },
        { label: 'Shavuot', value: 'Shavuot' },
        { label: 'RoshHshna', value: 'RoshHshna' },
        { label: 'Sukut', value: 'Sukut' },
        { label: 'Porim', value: 'Porim' },
        { label: 'General', value: 'General' },
    ];

    const handleChange = (e, fieldName) => {
        setFormData({ ...formData, [fieldName]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        formData.donor = user._id;
        formData.date = new Date();
        await axios.post("http://localhost:1111/api/contribution", formData,
            { headers: { Authorization: `Bearer ${token}` } });
        <PaymentPage visible={visible} setVisible={setVisible}sumContribution={formData.sumContribution} />
    };

    // Logic for saving data to the server can be added here
    return (
        <>
        <div className="card flex justify-content-center">
            <div className="p-fluid">
                <h2>Enter donation details</h2>
                <div className="field">
                    <label htmlFor="sumContribution">Sum Contribution</label>
                    <InputText
                        id="sumContribution"
                        value={formData.sumContribution}
                        onChange={(e) => handleChange(e, 'donationAmount')}
                        type="number"
                        required
                    />
                </div>

                {/* <div className="field">
                    <label htmlFor="donationDate">Donation Date</label>
                    <Calendar
                        id="donationDate"
                        value={formData.donationDate}
                        onChange={(e) => handleChange(e, 'donationDate')}
                        dateFormat="dd/mm/yy"
                        showIcon
                    />
                </div> */}

                <div className="field">
                    <label htmlFor="coinType">Currency Type</label>
                    <Dropdown
                        id="coinType"
                        value={formData.coinType}
                        onChange={(e) => handleChange(e, 'coinType')}
                        options={coinOptions}
                        placeholder="Select currency type"
                    />
                </div>

                {/* <div className="field">
                    <label htmlFor="Day">Day</label>
                    <Dropdown
                        id="Day"
                        value={formData.Day}
                        onChange={(e) => handleChange(e, 'Day')}
                        options={dayOptions}
                        placeholder="Select day"
                    />
                </div> */}

                {/* <div className="field">
                    <label htmlFor="donorUserName">Donor Username</label>
                    <InputText
                        id="donorUserName"
                        value={formData.donorUserName}
                        onChange={(e) => handleChange(e, 'donorUserName')}
                        required
                    />
                </div> */}
                <Button
                    label="Submit"
                    icon="pi pi-check"
                    className="p-button-success"
                    onClick={handleSubmit}
                />
            </div></div>
        </>
    );
};

export default CreateContribution;