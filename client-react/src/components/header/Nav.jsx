import { Menubar } from 'primereact/menubar';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
const Nav=()=>{
    const {user}=useSelector(state=>state.token)
    const navigate=useNavigate()
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
            label: 'Cash Register Status',
            icon: 'pi pi-bars',
            command: () => {
                navigate('./cashregisterstatus')
            }
        },
        // {
        //     label: 'Students',
        //     icon: 'pi pi-user',
        //     command: () => {
        //         navigate('./students')
        //     }
        // },
        {
            label: 'Users',
            icon: 'pi pi-user',
            command: () => {
                navigate('./users')
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
            label: 'ShowDetailsMonthlyScholarship',
            icon: 'pi pi-user',
            command: () => {
                navigate('./showMSDetails')
            }
        },user===null&&{
            label: 'Login',
            icon: 'pi pi-check',
            command: () => {
                navigate('./login')
            }
        },]
    return(
        <>
         <Menubar  model={items} />
        </>
    )
}

export default Nav;