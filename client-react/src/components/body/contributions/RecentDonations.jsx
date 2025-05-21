import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { useDispatch, useSelector } from 'react-redux'
import axios from "axios"
import { format } from 'date-fns'

const RecentDonations = () => {
    const { token, role, user } = useSelector((state) => state.token);
    const [contributions, setContributions] = useState([])
    const [loading, setLoading] = useState(true); // סטייט להציג טעינה
    const [error, setError] = useState(null); // סטייט לטיפול בשגיאות
    useEffect(() => {
        const fetchContributions = async () => {
            try {
                const response = await axios.get(`http://localhost:1111/api/contribution/${user._id}`)
                const formatDate = response.data.map(contribution => ({
                    ...contribution,
                    date: format(new Date(contribution.date), 'yyyy-MM-dd') 
                }));
                setContributions(formatDate);
            } catch (err) {
                setError(err.message); // שמירת הודעת השגיאה
            } finally {
                setLoading(false); // סיום מצב הטעינה
            }
        };
        fetchContributions()
    }, [user])
    if (loading) {
        return <p>Loading...</p>; // הודעת טעינה
    }

    if (error) {
        return <p>Error: {error}</p>; // הודעת שגיאה
    }

    return (
        <>
            <div className="card">
                <DataTable value={contributions} stripedRows tableStyle={{ minWidth: '50rem' }}>
                    <Column field="donor.fullname" header="Donor"></Column>
                    <Column field="date" header="Contributon Date"></Column>
                    <Column field="sumContribution" header="Sum Contribution"></Column>
                </DataTable>
            </div>
        </>
    )

}
export default RecentDonations