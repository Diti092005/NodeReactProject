import { Menubar } from 'primereact/menubar';
import { use } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
const Nav = () => {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const hangleLogoutClick = () => {

    }
    return (
        <nav>
            <ul>
                <li><NavLink to='/'>Home Page</NavLink></li>
                {!isLoggedIn && <li><NavLink to='/login'>Login</NavLink></li>}
                {!isLoggedIn && <li><NavLink to='/register'>Register</NavLink></li>}
                {isLoggedIn && <li><NavLink to='/dashboard'>Dashboard</NavLink></li>}
                {isLoggedIn && <li><NavLink to='/profile'>Profile</NavLink></li>}
                {isLoggedIn && <li><NavLink to='/users'>Users</NavLink></li>}
                {isLoggedIn && <li><NavLink to='/products'>Products</NavLink></li>}
                {isLoggedIn && <li><NavLink to='/logout' onClick={hangleLogoutClick}>Logout</NavLink></li>}
            </ul>
        </nav>
    )
}

export default Nav;