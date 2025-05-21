import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import FormMSDetails from "./FormMSDetails";
import { useSelector } from "react-redux";
import { Toolbar } from "primereact/toolbar";

const ShowMSDetails = () => {
    const { token } = useSelector((state) => state.token);
    const [visible, setVisible] = useState(false);
    const ms = useRef(null);
    const printRef = useRef(null); // Ref for the print container
    const [MSDetails, setMSDetails] = useState([]);
    const [MSDetail, setMSDetail] = useState({});
    const [enableAdd, setEnableAdd] = useState(true)
    const getAllMSDetails = async () => {
        const res = await axios.get('http://localhost:1111/api/monthlyScholarshipDetails',
            { headers: { Authorization: `Bearer ${token}` } });
        const addedMsdetails = await axios.get('http://localhost:1111/api/monthlyScholarshipDetails/thisMonth',
            { headers: { Authorization: `Bearer ${token}` } });
        if (addedMsdetails.data !== "")
            setEnableAdd(false)
        setMSDetails(res.data);
    };

    useEffect(() => {
        getAllMSDetails();
    }, []);

    const exportCSV = () => {
        ms.current.exportCSV();
    };

    const deleteMSDetails = async (rowData) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            {
                console.log((rowData.date));
                const newDate = new Date(rowData.date)
                if (newDate.getMonth() === new Date().getMonth()) {
                    const res = await axios.delete(`http://localhost:1111/api/monthlyScholarshipDetails/${rowData._id}`,
                        { headers: { Authorization: `Bearer ${token}` } });
                    getAllMSDetails();
                    setEnableAdd(true)
                }
            }
        }
    };

    const updateButton = (rowData) => {
        return (
            <Button label="Update" icon="pi pi-pencil" onClick={() => {
                setMSDetail(rowData);
                setVisible(true);
            }} ></Button>
        );
    };

    const deleteButton = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <Button icon="pi pi-trash" onClick={() => deleteMSDetails(rowData)} className="p-button-rounded" />
            </div>
        );
    };

    const createMSDatalis = () => {
        setMSDetail({ _id: 0, date: new Date(), MaximumNumberOfHours: 10, sumPerHour: 100 });
        setVisible(true);
    };

    const handlePrint = () => {
        const printContent = printRef.current;
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Print</title></head><body>');
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    const startContent = (
        <React.Fragment>
            <Button icon="pi pi-plus" className="mr-2" onClick={createMSDatalis} visible={enableAdd} />
            <Button icon="pi pi-print" className="mr-2" onClick={handlePrint} />
            <Button label="Export" icon="pi pi-download" iconPos="right" className="p-button-help" onClick={exportCSV} />
        </React.Fragment>
    );

    return (
        <>
            <div className="card">
                <Toolbar center={startContent} />
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

            {/* Hidden content for printing */}
            <div ref={printRef} style={{ display: 'none' }}>
                <h1>Monthly Scholarship Details</h1>
                <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>Sum Per Hour</th>
                            <th>Maximum Number Of Hours</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MSDetails.map((detail, index) => (
                            <tr key={index}>
                                <td>{detail.sumPerHour}</td>
                                <td>{detail.MaximumNumberOfHours}</td>
                                <td>{new Date(detail.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ShowMSDetails;