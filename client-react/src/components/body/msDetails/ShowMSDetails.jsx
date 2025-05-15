import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios"
import { useEffect, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { Button } from "primereact/button";
import UpdateMSDetails from "./UpdateMSDetails";
import CreateMSDetails from "./CreateMSDetails";

const ShowMSDetails = () => {
    const [MSDetails, setMSDetails] = useState([])
   
    const getAllMSDetails = async () => {
        console.log("osdjupaasjud");
        const res = await axios.get('http://localhost:1111/api/monthlyScholarshipDetails')
        console.log(res);
        console.log("jop[']p]p[[]");
        setMSDetails(res )
    }
    useEffect(() => {
        getAllMSDetails()
    }, [])

    const deleteMSDetails = async (rowData) => {
        console.log(rowData)
      
      console.log(rowData._id)
        const res = await axios.delete(`http://localhost:1111/api/monthlyScholarshipDetails/${rowData._id}`)
        setMSDetails(res.data)
    }

    const updateButton = (rowData) => {
        return (
            <UpdateMSDetails MSDetails={rowData}  getAllMSDetails={getAllMSDetails}/>

        )
    }


    const deleteButton = (rowData) => {
      
        return (
            <div className="flex align-items-center gap-2">
                <Button icon="pi pi-trash" onClick={()=>deleteMSDetails(rowData)} className="p-button-rounded" /> </div>
        )
    }



    return (<>
        <CreateMSDetails getAllMSDetails={getAllMSDetails}/> //////////////
        {/* 
        <div className="card p-fluid">
            <DataTable value={users} editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete} tableStyle={{ minWidth: '50rem' }}>
                <Column field="username" header="User name" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                <Column field="name" header="Name" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                {/* <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} editor={(options) => statusEditor(options)} style={{ width: '20%' }}></Column>
                <Column field="price" header="Price" body={priceBodyTemplate} editor={(options) => priceEditor(options)} style={{ width: '20%' }}></Column> */}
        {/* <Column rowEditor={allowEdit} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column> */}
        {/* //</></div> */}

        <div className="card">
            <DataTable value={MSDetails} tableStyle={{ minWidth: '50rem' }}>
            <Column field="sumPerHour" header="sumPerHour"></Column>
                <Column field="maximumNumberOfHours" header="MaximumNumberOfHours"></Column>
                <Column field="date" header="date"></Column>
               <Column header="DELETE" body={deleteButton}></Column> 
                <Column header="UPDATE" body={updateButton}></Column>

            </DataTable>
        </div>



    </>)
}
export default ShowMSDetails
