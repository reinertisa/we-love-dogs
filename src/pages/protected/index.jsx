import {Navigate, Outlet, useLocation} from "react-router";


/**
 * Render the protected route.
 * This will redirect to the login page if the user is not logged in.
 */
export default function ProtectedRoute() {
    const location = useLocation();
    const isLoggedIn = JSON.parse(localStorage.getItem('login'));

    if (isLoggedIn) {
        return <Outlet />;
    } else {
        return <Navigate to="/login" replace={true} state={{from: location}} />;
    }
}