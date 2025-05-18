import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Dropdown } from 'primereact/dropdown'; // Dropdown for filtering
import { useSelector } from "react-redux";
import { Toolbar } from "primereact/toolbar";
import FormCRStatus from "./FormCRStatus";

const CRStatus = () => {
    const { token } = useSelector((state) => state.token);
    const [visible, setVisible] = useState(false);
    const ms = useRef(null);
    const printRef = useRef(null); // Ref for the print container
    const [CRStatuses, setCRStatuses] = useState([]);
    const [filteredCRStatuses, setFilteredCRStatuses] = useState([]); // Filtered data
    const [CRStatus, setCRStatus] = useState({});
    const [selectedYear, setSelectedYear] = useState(null); // Selected year for filtering
    const [selectedMonth, setSelectedMonth] = useState(null); // Selected month for filtering

    const getAllCRStauses = async () => {
        const res = await axios.get('http://localhost:1111/api/cashRegisterStatus',
            { headers: { Authorization: `Bearer ${token}` } });
        setCRStatuses(res.data);
        setFilteredCRStatuses(res.data); // Initialize filtered data
    };

    useEffect(() => {
        getAllCRStauses();
    }, []);

    const exportCSV = () => {
        ms.current.exportCSV();
    };

    const deleteCRStatus = async (rowData) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            const res = await axios.delete(`http://localhost:1111/api/cashRegisterStatus/${rowData._id}`,
                { headers: { Authorization: `Bearer ${token}` } });
            getAllCRStauses();
        }
    };

    const updateButton = (rowData) => {
        return (
            <Button label="Update" icon="pi pi-pencil" onClick={() => {
                setCRStatus(rowData);
                setVisible(true);
            }} ></Button>
        );
    };

    const deleteButton = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <Button icon="pi pi-trash" onClick={() => deleteCRStatus(rowData)} className="p-button-rounded" />
            </div>
        );
    };

    const createCRStatus = () => {
        setCRStatus({ _id: 0, action: 'Expense', date: new Date(), sumPerAction: 0, currentSum: 0 });
        setVisible(true);
    };

    // Filter by year
    const filterByYear = (year) => {
        setSelectedYear(year);
        const filtered = CRStatuses.filter(status => new Date(status.date).getFullYear() === year);
        setFilteredCRStatuses(filtered);
    };

    // Filter by month
    const filterByMonth = (month) => {
        setSelectedMonth(month);
        const filtered = CRStatuses.filter(status => new Date(status.date).getMonth() + 1 === month);
        setFilteredCRStatuses(filtered);
    };

    const years = Array.from(new Set(CRStatuses.map(status => new Date(status.date).getFullYear()))); // Unique years
    const months = Array.from({ length: 12 }, (_, i) => i + 1); // Months 1-12

    const startContent = (
        <React.Fragment>
            <Button icon="pi pi-plus" className="mr-2" onClick={createCRStatus} />
            <Button icon="pi pi-print" className="mr-2" />
            <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
        </React.Fragment>
    );

    return (
        <>
            <div className="card">
                <Toolbar center={startContent} />
            </div>
            <div className="card">
                {/* Filters */}
                <div className="flex gap-4 mb-4">
                    <Dropdown
                        value={selectedYear}
                        options={years}
                        onChange={(e) => filterByYear(e.value)}
                        placeholder="Filter by Year"
                        className="p-dropdown"
                    />
                    <Dropdown
                        value={selectedMonth}
                        options={months}
                        onChange={(e) => filterByMonth(e.value)}
                        placeholder="Filter by Month"
                        className="p-dropdown"
                    />
                </div>

                {/* Data Table */}
                <DataTable ref={ms} value={filteredCRStatuses} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="action" header="Action"></Column>
                    <Column field="sumPerAction" header="SumPerAction"></Column>
                    <Column field="currentSum" header="CurrentSum"></Column>
                    <Column field="date" header="Date"></Column>
                    <Column header="DELETE" body={deleteButton}></Column>
                    <Column header="UPDATE" body={updateButton}></Column>
                </DataTable>
                {visible && <FormCRStatus visible={visible} setVisible={setVisible} CRStatus={CRStatus} getAllCRStauses={getAllCRStauses} />}
            </div>
        </>
    );
};

export default CRStatus;