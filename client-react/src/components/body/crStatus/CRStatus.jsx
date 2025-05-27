import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Dropdown } from 'primereact/dropdown';
import { useSelector } from "react-redux";
import { Toolbar } from "primereact/toolbar";
import { format } from "date-fns";
import FormCRStatus from "./FormCRStatus";

const CRStatus = () => {
    const { token } = useSelector((state) => state.token);
    const [visible, setVisible] = useState(false);
    const cr = useRef(null);
    const printRef = useRef(null);
    const [CRStatuses, setCRStatuses] = useState([]);
    const [filteredCRStatuses, setFilteredCRStatuses] = useState([]);
    const [CRStatus, setCRStatus] = useState({});
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);

    const getAllCRStatuses = async () => {
        try {
            const res = await axios.get('http://localhost:1111/api/cashRegisterStatus',
                { headers: { Authorization: `Bearer ${token}` } });
            setCRStatuses(res.data);
            setFilteredCRStatuses(res.data);
        }
        catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getAllCRStatuses();
    }, []);

    // סינון משולב לפי שנה וחודש
    useEffect(() => {
        let filtered = CRStatuses;

        if (selectedYear) {
            filtered = filtered.filter(status => new Date(status.date).getFullYear() === selectedYear);
        }
        if (selectedMonth) {
            filtered = filtered.filter(status => (new Date(status.date).getMonth() + 1) === selectedMonth);
        }

        setFilteredCRStatuses(filtered);
    }, [CRStatuses, selectedYear, selectedMonth]);

    const exportCSV = () => {
        cr.current.exportCSV();
    };

    const deleteCRStatus = async (rowData) => {
        const newDate = new Date(rowData.date)
        if (newDate.getMonth() === new Date().getMonth() && newDate.getFullYear() === new Date().getFullYear()) {
            if (window.confirm("Are you sure you want to delete this record?")) {
                try {
                    await axios.delete(`http://localhost:1111/api/cashRegisterStatus/${rowData._id}`,
                        { headers: { Authorization: `Bearer ${token}` } });
                    getAllCRStatuses();
                }
                catch (err) {
                    console.error(err);
                }
            }
        }
    };

    const updateButton = (rowData) => (
        <Button label="Update" icon="pi pi-pencil" onClick={() => {
            const newDate = new Date(rowData.date)
            if (newDate.getMonth() === new Date().getMonth() && newDate.getFullYear() === new Date().getFullYear()) {
                setCRStatus(rowData);
                setVisible(true);
            }
        }} />
    );

    const deleteButton = (rowData) => (
        <div className="flex align-items-center gap-2">
            <Button icon="pi pi-trash" onClick={() => deleteCRStatus(rowData)} className="p-button-rounded" />
        </div>
    );

    const createCRStatus = () => {
        setCRStatus({ _id: 0, action: 'Expense', date: new Date(), sumPerAction: 0, currentSum: 0 });
        setVisible(true);
    };
    //happen automatticly in the server  every firsyt day in month!!!
    // const updateCRStatuses = async () => {
    //     await axios.post("http://localhost:1111/api/hapenOnceAMonth/Expense", {},
    //         { headers: { Authorization: `Bearer ${token}` } });
    //     await axios.post("http://localhost:1111/api/hapenOnceAMonth/Income", {},
    //         { headers: { Authorization: `Bearer ${token}` } });
    //     getAllCRStatuses();
    // }

    const years = Array.from(new Set(CRStatuses.map(status => new Date(status.date).getFullYear())));
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

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
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1em'
            }}
            className="responsive-buttons"
        >
            <Button icon="pi pi-plus" className="mr-2" label="Add an Expense" iconPos="right" onClick={createCRStatus} />
            <Button icon="pi pi-print" className="mr-2" onClick={handlePrint} />
            <Button label="Export" icon="pi pi-download" iconPos="right" className="p-button-help" onClick={exportCSV} />
        </div>
    );
    const dateBodyTemplate = (rowData) => {
        if (rowData.date)
            return format(rowData.date, 'dd/MM/yyyy')
        return ""
    };

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
                        onChange={(e) => setSelectedYear(e.value)}
                        placeholder="Filter by Year"
                        className="p-dropdown"
                    />
                    <Dropdown
                        value={selectedMonth}
                        options={months}
                        onChange={(e) => setSelectedMonth(e.value)}
                        placeholder="Filter by Month"
                        className="p-dropdown"
                    />
                </div>

                {/* Data Table */}
                <DataTable value={filteredCRStatuses} ref={cr} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="action" header="Action"></Column>
                    <Column field="sumPerAction" header="SumPerAction"></Column>
                    <Column field="currentSum" header="CurrentSum"></Column>
                    <Column field="date" header="Date" body={dateBodyTemplate}></Column>
                    <Column header="DELETE" body={deleteButton}></Column>
                    <Column header="UPDATE" body={updateButton}></Column>
                </DataTable>
                {visible && <FormCRStatus visible={visible} setVisible={setVisible} CRStatus={CRStatus} getAllCRStatuses={getAllCRStatuses} />}
            </div>
            {/* Hidden content for printing */}
            <div ref={printRef} style={{ display: 'none' }}>
                <h1>Cash Register Status</h1>
                <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>Action</th>
                            <th>Sum Per Action</th>
                            <th>Current Sum</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCRStatuses.map((detail, index) => (
                            <tr key={index}>
                                <td>{detail.action}</td>
                                <td>{detail.sumPerAction}</td>
                                <td>{detail.currentSum}</td>
                                <td>{new Date(detail.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default CRStatus;