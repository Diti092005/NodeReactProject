import { Menubar } from 'primereact/menubar';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
const Nav=()=>{
    const {user}=useSelector(state=>state.token)
    const navigate=useNavigate()
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
            label: 'Users',
            icon: 'pi pi-users',
            command: () => {
                navigate('./users')
            }
        },
        {
            label: 'Contribution',
            icon: 'pi pi-wallet',
            command: () => {
                navigate('./contribution')
            }
        },
        {
            label: 'Cash Register Status',
            icon: 'pi pi-credit-card',
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
            label: 'ShowDetailsMonthlyScholarship',
            icon: 'pi pi-file',
            command: () => {
                navigate('./showMSDetails')
            }
        },
        {
            label: 'StudentsScholarships',
                 icon: 'pi pi-list',
             command: () => {
                     navigate('./studentsScholarships')
                 }
        },
        ]
    return(
        <>
         <Menubar  model={items} />
        </>
    )
}

export default Nav;