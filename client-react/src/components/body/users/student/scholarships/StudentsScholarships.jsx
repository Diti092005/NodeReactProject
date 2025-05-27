import axios from "axios";
import React, { useRef, useEffect, useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Dropdown } from 'primereact/dropdown';
import { useSelector } from "react-redux";
import { Toolbar } from "primereact/toolbar";
import { format } from "date-fns";

const StudentScholarships = () => {
    const { token } = useSelector((state) => state.token);
    const cr = useRef(null);
    const printRef = useRef(null);
    const [StudentScholarships, setStudentScholarships] = useState([]);
    const [filteredStudentScholarships, setFilteredStudentScholarships] = useState([]);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);

    useEffect(() => {
        const getAllStudentScholarships = async () => {
            try {
                const res = await axios.get('http://localhost:1111/api/studentScholarship',
                    { headers: { Authorization: `Bearer ${token}` } });
                setStudentScholarships(res.data);
            }
            catch (err) {
                console.error(err);
            }
        };
        getAllStudentScholarships();
    }, [token]);

    // סינון מרכזי - מתעדכן בכל שינוי
    useEffect(() => {
        let filtered = StudentScholarships;

        if (selectedYear) {
            filtered = filtered.filter(item => item?.date && new Date(item.date).getFullYear() === selectedYear);
        }
        if (selectedId) {
            filtered = filtered.filter(item => item?.student && item.student.userId === selectedId);
        }
        if (selectedMonth) {
            filtered = filtered.filter(item => item?.date && (new Date(item.date).getMonth() + 1) === selectedMonth);
        }
        setFilteredStudentScholarships(filtered);
    }, [StudentScholarships, selectedYear, selectedId, selectedMonth]);

    const years = Array.from(new Set(
        StudentScholarships
            .filter(item => item?.date)
            .map(item => new Date(item.date).getFullYear())
    ));
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const ids = StudentScholarships
        .filter(item => item?.student && item.student.userId !== undefined && item.student.userId !== null)
        .map(item => item.student.userId);
    const uniqueIds = [...new Set(ids)];

    const exportCSV = () => {
        cr.current.exportCSV();
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

    const bodyDateTemplate = (rowData) => {
        if (rowData.date)
            return format(new Date(rowData.date), 'dd/MM/yyyy');
        return "";
    };

    const startContent = (
        <>
            <Button icon="pi pi-print" className="mr-2" onClick={handlePrint} />
            <Button label="Export" icon="pi pi-download" iconPos="right" className="p-button-help" onClick={exportCSV} />
        </>
    );

    return (
        <>
            <div className="card">
                <Toolbar center={startContent} />
            </div>
            <div className="card">
                <div className="flex gap-4 mb-4">
                    <Dropdown
                        value={selectedId}
                        options={uniqueIds}
                        onChange={(e) => setSelectedId(e.value)}
                        placeholder="filter by Id"
                        className="p-dropdown"
                    />
                    <Dropdown
                        value={selectedYear}
                        options={years}
                        onChange={(e) => setSelectedYear(e.value)}
                        placeholder="filter by years"
                        className="p-dropdown"
                    />
                    <Dropdown
                        value={selectedMonth}
                        options={months}
                        onChange={(e) => setSelectedMonth(e.value)}
                        placeholder="filter by month"
                        className="p-dropdown"
                    />
                </div>

                <DataTable value={filteredStudentScholarships} ref={cr} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="student.fullname" header="Student Name" body={rowData => rowData.student?.fullname || ''}></Column>
                    <Column field="student.userId" header="Student Id" body={rowData => rowData.student?.userId || ''}></Column>
                    <Column field="numHours" header="Number Of Hours"></Column>
                    <Column field="sumMoney" header="Sum Money"></Column>
                    <Column field="date" header="Date" body={bodyDateTemplate}></Column>
                </DataTable>
            </div>

            <div ref={printRef} style={{ display: 'none' }}>
                <h1>Student Scholarships</h1>
                <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>student name</th>
                            <th>student id</th>
                            <th>numHours</th>
                            <th>sumMoney</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudentScholarships.map((detail, index) => (
                            <tr key={index}>
                                <td>{detail.student?.fullname || ''}</td>
                                <td>{detail.student?.userId || ''}</td>
                                <td>{detail.numHours}</td>
                                <td>{detail.sumMoney}</td>
                                <td>{detail.date ? new Date(detail.date).toLocaleDateString() : ''}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default StudentScholarships;