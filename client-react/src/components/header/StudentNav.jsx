import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
const StudentNav = () => {
    const navigate = useNavigate()
    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            command: () => {
                navigate('./home')
            }
        },
        {
            label: 'LogOut',
            icon: 'pi pi-bars',
            command: () => {
                navigate('./logOut')
            }
        },
        {
            label: 'Login',
            icon: 'pi pi-check',
            command: () => {
                navigate('./login')
            }
        },
        {
            label: 'StudentDSetails',
            icon: 'pi pi-user',
            command: () => {
                navigate('./students')
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