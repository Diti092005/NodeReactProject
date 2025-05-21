export default function StudentsScholarships() {
    const [students, setStudents] = useState([]);
    
    return (
<div className="card p-fluid">
            <Toast ref={toast} />
            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
            <DataTable ref={dt} value={students} editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete} tableStyle={{ minWidth: '50rem' }}>
                <Column field="userId" header="ID" style={{ width: '10%' }}></Column>
                <Column field="fullname" header="Fullname" style={{ width: '10%' }}></Column>
                <Column field="email" header="Email" style={{ width: '10%' }}></Column>
                <Column field="phone" header="Phone" style={{ width: '10%' }}></Column>
                <Column field="address" header="Address" body={addressBodyTemplate} style={{ width: '10%' }}></Column>
                <Column field="birthDate" header="BirthDate" body={birthDateBodyTemplate} style={{ width: '30%' }}></Column>
                <Column field="roles" header="Role" body={roleBodyTemplate} style={{ width: '10%' }}></Column>
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
            </DataTable>
                <Button label="Yes" icon="pi pi-check" onClick={deleteStudent} />
                <Button label="No" icon="pi pi-times" onClick={hideDeleteStudentsDialog} className="p-button-secondary" />
        
        </div>
    );
}