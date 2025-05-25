import { Menubar } from 'primereact/menubar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const StudentNav = () => {
    const navigate = useNavigate()
    const {user}=useSelector(state=>state.token)

    const items = [
        user&&
        {
            label: 'LogOut',
            icon: 'pi pi-arrow-circle-left',
            command: () => {
                navigate('./logOut')
            }
        },
        {
            label: 'StudentDSetails',
            icon: 'pi pi-user',
            command: () => {
                navigate('./studentDetails')
            }
        },
        {
            label: 'ScholarshipForStudent',
            icon: 'pi pi-user',
            command: () => {
                navigate('./scholarshipForStudent')
            }
        }
    ]
    return (
        <>
            <Menubar model={items} />
        </>
    )
}

export default StudentNav