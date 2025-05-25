import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Calendar } from 'primereact/calendar';
import axios from 'axios';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
import { useSelector } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { useRef } from 'react';
//import { emit } from '../../../../../server node/models/User';
import { Toolbar } from 'primereact/toolbar';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import NumberOfHoursBtn from './NumberOfHoursBtn';


export default function ScholarshipForStudent() {

    const [scholarship, setScholarship] = useState();
    const [add, setAdd] = useState(false);

    const [roles] = useState(['Student', 'Donor', 'Admin']);
    const {user, token, role } = useSelector((state) => state.token);
    const toast = useRef(null);
    const dt = useRef(null);

    const getScholarships = async () => {
        const student=user._id
        const res = await axios.get(`http://localhost:1111/api/studentScholarship/byStudent/${student}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        setScholarship(res.data)
    }
    useEffect(() => {
        getScholarships();

    }, []);


const leftToolbarTemplate = () => {
        return (
                <NumberOfHoursBtn></NumberOfHoursBtn>
        );
    };
    



    

   
    
    return (

        <div className="card p-fluid">
            <Toast ref={toast} />

            <Toolbar className="mb-4" left={leftToolbarTemplate} ></Toolbar>

            <DataTable ref={dt} value={scholarship} editMode="row" dataKey="id"  tableStyle={{ minWidth: '50rem' }}>
                <Column field="date" header="date" style={{ width: '10%' }}></Column>
                <Column field="sumMoney" header="Sum Of Money" style={{ width: '10%' }}></Column>
                <Column field="numHours" header="Number Hours" style={{ width: '10%' }}></Column>
                
            </DataTable>

           
        </div>
    );
}