import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
const Nav=()=>{
    const navigate=useNavigate()
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
            label: 'Cash Register Status',
            icon: 'pi pi-bars',
            command: () => {
                navigate('./cashregisterstatus')
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
            label: 'Students',
            icon: 'pi pi-user',
            command: () => {
                navigate('./students')
            }
        },
        {
            label: 'Contribution',
            icon: 'pi pi-user',
            command: () => {
                navigate('./contribution')
            }
        },
        {
            label: 'ShowMSDetails',
            icon: 'pi pi-user',
            command: () => {
                navigate('./showMSDetails')
            }
        }]
    return(
        <>
         <Menubar  model={items} />
        </>
    )
}

export default Nav;