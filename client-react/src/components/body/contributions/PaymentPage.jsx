import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import axios from "axios";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { Dialog } from "primereact/dialog";
import { useDispatch, useSelector } from 'react-redux'

const PaymentPage = (props) => {
    const [cardNumber, setCardNumber] = useState("");
    const [cardHolderName, setCardHolderName] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [cvv, setCvv] = useState("");
    const { token, role, user } = useSelector((state) => state.token);

    const handlePayment = async () => {
        // ולידציות
        if (!cardNumber || !cardHolderName || !expirationDate || !cvv) {
            alert("Please fill in all fields");
            return; // עוצר את המשך הקוד
        }

        if (!/^[a-zA-Z\s]+$/.test(cardHolderName)) {
            alert("Card holder name must contain only letters and spaces");
            return; // עוצר את המשך הקוד
        }

        const isValidCardNumber = (number) => {
            const regex = /^\d{13,19}$/; // בין 13 ל-19 ספרות
            if (!regex.test(number)) {
                return false;
            }
            let sum = 0;
            let shouldDouble = false;
            for (let i = number.length - 1; i >= 0; i--) {
                let digit = parseInt(number[i]);
                if (shouldDouble) {
                    digit *= 2;
                    if (digit > 9) digit -= 9;
                }
                sum += digit;
                shouldDouble = !shouldDouble;
            }
            return sum % 10 === 0;
        };

        if (!isValidCardNumber(cardNumber)) {
            alert("Invalid card number");
            return; // עוצר את המשך הקוד
        }

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expirationDate)) {
            alert("Expiration date must be in MM/YY format");
            return; // עוצר את המשך הקוד
        }

        const isExpired = (date) => {
            const [month, year] = date.split("/").map(Number);
            const now = new Date();
            const currentYear = now.getFullYear() % 100;
            const currentMonth = now.getMonth() + 1;
            return year < currentYear || (year === currentYear && month < currentMonth);
        };

        if (isExpired(expirationDate)) {
            alert("Card is expired");
            return; // עוצר את המשך הקוד
        }

        if (!/^\d{3,4}$/.test(cvv)) {
            alert("CVV must be 3 or 4 digits");
            return; // עוצר את המשך הקוד
        }
        const paymentData = { cardHolderName, cardNumber, expirationDate, cvv };
        alert("Payment Successful!");
        // const res = await axios.post("http://localhost:1111/api/cashRegisterStatus", { action: "Income", date: new Date(), sumPerAction: props.sumContribution, currentSum: 0 },
        //     { headers: { Authorization: `Bearer ${token}` } })
        // console.log(res.data);
        props.setCheckPay(true)
        props.setVisible(false);
    };

    const addConributin = async () => {
        console.log(props.formData);
        if (role === "Admin") {
            if (props.formData.id === 0)
                try {
                    await axios.post("http://localhost:1111/api/contribution", props.formData,
                        { headers: { Authorization: `Bearer ${token}` } });
                }
                catch (err) {
                    console.error(err);
                }
            else {
                try {
                    await axios.put("http://localhost:1111/api/contribution", props.formData,
                        { headers: { Authorization: `Bearer ${token}` } });
                }
                catch (err) {
                    console.error(err);
                }
            }
        }
        else if (role === "Donor") {
            console.log("paymentDonor");
            if (props.formData.id === 0)
                try{
                await axios.post(`http://localhost:1111/api/contribution/donor/${user._id}`, props.formData,
                    { headers: { Authorization: `Bearer ${token}` } });}
                    catch (err) {
                        console.error(err);
                    }
            else {
                try{
                await axios.put(`http://localhost:1111/api/contribution/donor/${user._id}`, props.formData,
                    { headers: { Authorization: `Bearer ${token}` } });
                }
                catch (err) {
                    console.error(err);
                }
            }
        }
        props.getAllContributions()
        props.setVisibleFather(false);
    }
    useEffect(() => {
        if (props.checkPay) {
            addConributin();
            props.setCheckPay(false);
        }
    }, [props.checkPay])

    return (
        <Dialog visible={props.visible} onHide={() => props.setVisible(false)} header="Payment Page" footer={<Button label="Close" icon="pi pi-times" onClick={() => props.setVisible(false)} />}>
            <div className="card flex justify-content-center" >
                <Card title="Payment Page" className="p-shadow-5" style={{ width: "400px" }}>
                    <div className="p-field">
                        <label htmlFor="cardHolderName">Card Holder</label>
                        <InputText
                            id="cardHolderName"
                            value={cardHolderName}
                            onChange={(e) => setCardHolderName(e.target.value)}
                        />
                    </div>

                    <div className="p-fluid">
                        <div className="p-field">
                            <label htmlFor="cardNumber">Card Number</label>
                            <InputText
                                id="cardNumber"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                            />
                        </div>

                        <div className="p-field">
                            <label htmlFor="expirationDate">Expiry Date</label>
                            <InputText
                                id="expirationDate"
                                value={expirationDate}
                                onChange={(e) => setExpirationDate(e.target.value)}
                            />
                        </div>

                        <div className="p-field">
                            <label htmlFor="cvv">CVV</label>
                            <InputText
                                id="cvv"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                maxLength={4}
                            />
                        </div>

                        <Button label="Pay Now" icon="pi pi-check" className="p-mt-3" onClick={handlePayment} />
                    </div>
                </Card>
            </div>
        </Dialog>
    );
};

export default PaymentPage;
