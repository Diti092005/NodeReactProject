import axios from "axios";
import { useEffect, useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { Button } from "primereact/button";
import { useSelector } from "react-redux";
import CreateContribution from "./CreateContribution";
import { format } from 'date-fns';

const ShowContributionAccToDonor = () => {
    const [contributions, setContributions] = useState([]);
    const { token } = useSelector((state) => state.token);
    const { user } = useSelector((state) => state.token); // נניח שהמשתמש הנוכחי נשמר ב-state
    const [visibleAdd, setVisibleAdd] = useState(false);
    const [visibleUpdate, setVisibleUpdate] = useState(false);
    const [contribution, setContribution] = useState()

    const getContributionsByDonor = async () => {
        try {
            const res = await axios.get(`http://localhost:1111/api/contribution/donor/${user._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setContributions(res.data);
        } catch (error) {
            console.error("Error fetching contributions:", error);
        }
    };

    useEffect(() => {
        getContributionsByDonor();
    }, []);
    const dateBodyTemplate = (rowData) => {
        if (rowData.date)
            return format(rowData.date, 'dd/MM/yyyy')
        return ""
    };
    const deleteContribution = async (rowData) => {
        if (!user.active) {
            alert("You can't delete contributions when you are not active!");
            return;
        }
        const contribDate = new Date(rowData.date);
        const now = new Date();
        if (contribDate.getMonth() !== now.getMonth() || contribDate.getFullYear() !== now.getFullYear()) {
            alert("You can't delete contributions from previous months!");
            return;
        }
        if (window.confirm("Are you sure you want to delete this record?")) {
            try{
            await axios.delete(`http://localhost:1111/api/contribution/${rowData._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            getContributionsByDonor();
        }
        catch (err) {
            console.error(err);
        }
        }
    };

    const deleteButton = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <Button icon="pi pi-trash" onClick={() => deleteContribution(rowData)} className="p-button-rounded" />
            </div>
        );
    };
    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={() => { setVisibleAdd(true) }} />
            </div>
        );
    };
    const updateButton = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" onClick={() => {
                    if (!user.active) {
                        alert("You can't update contributions when you are not active!");
                        return;
                    }
                    const contribDate = new Date(rowData.date);
                    const now = new Date();
                    if (contribDate.getMonth() !== now.getMonth() || contribDate.getFullYear() !== now.getFullYear()) {
                        alert("You can't delete contributions from previous months!");
                        return;
                    }
                    else {
                        setContribution(rowData)
                        setVisibleUpdate(true)
                    }
                }} className="p-button-rounded" />
            </>
        )
    }
    return (
        <>
            <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
            <div className="card">
                <DataTable value={contributions} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="date" header="Date" body={dateBodyTemplate}></Column>
                    <Column field="sumContribution" header="Contribution Sum"></Column>
                    {user.active && <Column header="DELETE" body={deleteButton}></Column>}
                    {user.active && <Column header="UPDATE" body={updateButton}></Column>}
                </DataTable>
                {user.active && <CreateContribution visible={visibleAdd} setVisible={setVisibleAdd} getAllContributions={getContributionsByDonor} contribution={contribution} />}
                {user.active && <CreateContribution visible={visibleUpdate} setVisible={setVisibleUpdate} getAllContributions={getContributionsByDonor} contribution={contribution} />}
            </div>
        </>
    );
};

export default ShowContributionAccToDonor;