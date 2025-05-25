import { Menubar } from "primereact/menubar"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
const DonorNav = () => {
const navigate = useNavigate()
const {user}=useSelector(state=>state.token)
    const items = [
        user&&{
            label: 'LogOut',
            icon: 'pi pi-arrow-circle-left',
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
        }
    ]
    return (
        <>
            <Menubar model={items} />
        </>
    )
}

export default DonorNav