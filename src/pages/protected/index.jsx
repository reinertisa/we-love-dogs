import {Navigate, Outlet, useLocation} from "react-router";

export default function ProtectedRoute() {
    const location = useLocation();
    const isLoggedIn = JSON.parse(localStorage.getItem('login'));

    if (isLoggedIn) {
        return <Outlet />;
    } else {
        return <Navigate to="/login" replace={true} state={{from: location}} />;
    }
}