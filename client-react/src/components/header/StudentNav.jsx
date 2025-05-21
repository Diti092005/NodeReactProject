import { Menubar } from 'primereact/menubar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const StudentNav = () => {
    const navigate = useNavigate()
    const {user}=useSelector(state=>state.token)

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            command: () => {
                navigate('./home')
            }
        },
        user&&
        {
            label: 'LogOut',
            icon: 'pi pi-bars',
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
        user===null&&{
            label: 'Login',
            icon: 'pi pi-check',
            command: () => {
                navigate('./login')
            }
        },
    ]
    return (
        <>
            <Menubar model={items} />
        </>
    )
}

export default StudentNav