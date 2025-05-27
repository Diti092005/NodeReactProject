import { useEffect, useState } from "react";
import EnterNumberOfHours from "./EnterNumberOfHours";
import axios from "axios";
import { useSelector } from 'react-redux';

import { Button } from "primereact/button";
export default function NumberOfHoursBtn({ getScholarships }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isActive, setIsActive] = useState(true);
    const [currentScholarship, setCurrentScholarship] = useState({})
    const { user, token, role } = useSelector((state) => state.token);

    const getCurrentScholarship = async () => {
        const student = user._id
        try {
            const res = await axios.get(`http://localhost:1111/api/studentScholarship/currentMonth/${student}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            // const ss = await axios.get(`http://localhost:1111/api/studentScholarship`,
            //     { headers: { Authorization: `Bearer ${token}` } }
            // )
            setCurrentScholarship(res.data)
        }
        catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        getCurrentScholarship();
        if (user.active == false)
            setIsActive(false)
    }, []);
    useEffect(() => {
        getCurrentScholarship();
    }, [isOpen])

    const openForm = () => {

        setIsOpen(true)
        // setSubmitted(false);
        // setStudentDialog(true);
    };

    return (
        <div className="flex flex-wrap gap-2">
            {isActive && currentScholarship === "" ? <Button label="Enter number of hours" icon="pi pi-plus" severity="success" onClick={openForm} /> : <></>}
            {isActive && currentScholarship !== "" ? <Button label="Update number of hours" icon="pi pi-pencil" severity="success" onClick={openForm} /> : <></>}
            {isOpen && <EnterNumberOfHours getScholarships={getScholarships} setIsOpen={setIsOpen} currentScholarship={currentScholarship} isOpen={isOpen} ></EnterNumberOfHours>}
            {currentScholarship && <EnterNumberOfHours getScholarships={getScholarships} setIsOpen={setIsOpen} currentScholarship={currentScholarship} isOpen={isOpen}></EnterNumberOfHours>}        </div>
    )
}