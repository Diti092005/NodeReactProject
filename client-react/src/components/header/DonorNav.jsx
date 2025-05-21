import { Menubar } from "primereact/menubar"
import { useNavigate } from "react-router-dom"
const DonorNav = () => {
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
            label: 'MyContributions',
            icon: 'pi pi-user',
            command: () => {
                navigate('./contributionDonor')
            }
        },
        ,
        {
            label: 'Login',
            icon: 'pi pi-check',
            command: () => {
                navigate('./login')
            }
        }
    ]
    return (
        <>
            <Menubar model={items} />
        </>
    )
}

export default DonorNav