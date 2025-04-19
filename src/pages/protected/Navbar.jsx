import {useEffect, useState} from "react";
import axios from "axios";
import {BASE_URL} from "../../constants.js";
import {NavLink, Outlet, useNavigate} from "react-router";
import Button from "../../components/buttons/index.jsx";
import ErrorMessage from "../../components/errors/index.jsx";


import './Navbar.css';


export default function Navbar() {
    const[isLoggedOut, setLoggedOut] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedOut) {
            localStorage.removeItem('login');
            navigate('/');
        }
    }, [isLoggedOut, navigate]);

    const onLogout = async () => {
        try {
            await axios.post(`${BASE_URL}/auth/logout`, {}, {
                withCredentials: true,
            });
            setLoggedOut(true)
        } catch (err) {
            setError(err);
        }
    };
    return (
        <>
            <nav className="navbar">
                <div className="navbar-left">
                    <NavLink to="/search">
                        <span className="company-name">We Love Dogs</span>
                    </NavLink>
                </div>
                <div className="navbar-right">
                    <Button actionHandler={onLogout}>Logout</Button>
                </div>
            </nav>
            {error && <ErrorMessage message={error} />}
            <Outlet />
        </>
    );
};

