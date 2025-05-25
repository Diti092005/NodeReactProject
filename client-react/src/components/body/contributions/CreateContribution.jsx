import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PaymentPage from './PaymentPage';
import { Dialog } from 'primereact/dialog';
import { useForm } from 'react-hook-form';

const CreateContribution = (props) => {
    const [rate, setRate] = useState(null);
    const [checkPay, setCheckPay] = useState(false);
    const { token, role, user } = useSelector((state) => state.token);
    const [visiblePay, setVisiblePay] = useState(false);
    const [coinType, setCoinType] = useState(props.contribution?.coinType || '₪');

    //const navigate = useNavigate();

    const coinOptions = [
        { label: '$', value: '$' },
        { label: '₪', value: '₪' },
    ];

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        watch,
        reset,
    } = useForm({
        defaultValues: {
            sumContribution: props.contribution?.sumContribution || 100,
        }
    });

    // Sync coinType with react-hook-form (since Dropdown is not a native input)
    useEffect(() => {
        setValue('coinType', coinType);
    }, [coinType, setValue]);

    // Reset form when dialog opens/closes
    useEffect(() => {
        if (props.visible) {
            reset({
                sumContribution: props.contribution?.sumContribution || 100,
                coinType: props.contribution?.coinType || '₪'
            });
            setCoinType(props.contribution?.coinType || '₪');
        }
    }, [props.visible, props.contribution, reset]);

    const onSubmit = async (data) => {
        // ממלאים את השדות הנדרשים
        let sum = Number(data.sumContribution);
        let usedRate = 1;

        // if (data.coinType === '$') {
        //     try {
        //         const res = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=ILS");
        //         const result = await res.json();
        //         usedRate = result.rates.ILS;
        //         sum *= usedRate;
        //         setRate(usedRate);
        //     } catch (error) {
        //         console.error("Error fetching exchange rate:", error);
        //     }
        // }

        const contributionData = {
            sumContribution: sum,
            coinType: data.coinType,
            donor: user._id,
            date: new Date(),
            id: props.contribution?._id || 0,
        };

        setVisiblePay(true);

    };

    return (
        <>
            <Dialog visible={props.visible} onHide={() => props.setVisible(false)}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="card flex justify-content-center">
                        <div className="p-fluid">
                            <h2>Enter donation details</h2>
                            <div className="field">
                                <label htmlFor="sumContribution">Sum Contribution</label>
                                <InputText
                                    id="sumContribution"
                                    type="number"
                                    min={1}
                                    {...register('sumContribution', { required: 'sumContribution is required.' })}
                                />
                                {errors.sumContribution && <p style={{ color: 'red' }}>{errors.sumContribution.message}</p>}
                            </div>
                            <div className="field">
                                <label htmlFor="coinType">Currency Type</label>
                                <Dropdown
                                    id="coinType"
                                    value={coinType}
                                    onChange={(e) => setCoinType(e.value)}
                                    options={coinOptions}
                                    placeholder={coinOptions[1].value}
                                    required
                                />
                            </div>
                            <Button
                                label="Submit"
                                icon="pi pi-check"
                                className="p-button-success"
                                type="submit"
                            />
                        </div>
                    </div>
                </form>
            </Dialog>
            <PaymentPage
                checkPay={checkPay}
                formData={{
                    sumContribution: watch('sumContribution'),
                    coinType: watch('coinType'),
                    donor: user?._id,
                    date: new Date(),
                    id: props.contribution?._id || 0
                }}
                getAllContributions={props.getAllContributions}
                setVisibleFather={props.setVisible}
                setCheckPay={setCheckPay}
                visible={visiblePay}
                setVisible={setVisiblePay}
                sumContribution={watch('sumContribution')}
            />
        </>
    );
};

export default CreateContribution;