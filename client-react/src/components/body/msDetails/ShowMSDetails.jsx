import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios"
import React, { useRef } from "react";
import { useEffect, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import FormMSDetails from "./FormMSDetails";
import { useSelector } from "react-redux";
import { Toolbar } from "primereact/toolbar";
const ShowMSDetails = () => {
    const { token } = useSelector((state) => state.token);
    const [visible, setVisible] = useState(false);
    const ms = useRef(null)
    const [MSDetails, setMSDetails] = useState([])
    const [MSDetail, setMSDetail] = useState({})
    const getAllMSDetails = async () => {
        const res = await axios.get('http://localhost:1111/api/monthlyScholarshipDetails',
            { headers: { Authorization: `Bearer ${token}` } })
        setMSDetails(res.data)
    }
    useEffect(() => {
        getAllMSDetails()
    }, [])
    const exportCSV = () => {
        ms.current.exportCSV();
    }
    const deleteMSDetails = async (rowData) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            const res = await axios.delete(`http://localhost:1111/api/monthlyScholarshipDetails/${rowData._id}`,
                { headers: { Authorization: `Bearer ${token}` } })
            getAllMSDetails()
        }
    }

    const updateButton = (rowData) => {
        return (
            <Button label="Update" icon="pi pi-pencil" onClick={() => {
                setMSDetail(rowData)
                setVisible(true)
            }} ></Button>)
    }
    const deleteButton = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <Button icon="pi pi-trash" onClick={() => deleteMSDetails(rowData)} className="p-button-rounded" /> </div>
        )
    }
    const createMSDatalis = () => {
        setMSDetail({_id: 0, date: new Date(), MaximumNumberOfHours: 10, sumPerHour: 100})
        setVisible(true)
    }
    const startContent = (
        <React.Fragment>
            <Button icon="pi pi-plus" className="mr-2" onClick={createMSDatalis} />
            <Button icon="pi pi-print" className="mr-2" />
            <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
        </React.Fragment>
    );
    return (<>
        <div className="card">
            <Toolbar center={startContent} />
            <Toolbar className="mb-4" />
        </div>
        <div className="card">
            <DataTable ref={ms} value={MSDetails} tableStyle={{ minWidth: '50rem' }}>
                <Column field="sumPerHour" header="SumPerHour"></Column>
                <Column field="MaximumNumberOfHours" header="MaximumNumberOfHours"></Column>
                <Column field="date" header="Date"></Column>
                <Column header="DELETE" body={deleteButton}></Column>
                <Column header="UPDATE" body={updateButton}></Column>
            </DataTable>
            {visible && <FormMSDetails visible={visible} setVisible={setVisible} MSDetail={MSDetail} getAllMSDetails={getAllMSDetails} />}
        </div>
    </>)
}
export default ShowMSDetails
