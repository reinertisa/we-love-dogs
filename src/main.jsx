import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider} from "react-router";
import SearchPage from "./pages/protected/Search.jsx";
import LoginPage from "./pages/public/Login.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import Navbar from "./pages/protected/Navbar.jsx";
import NotFound from "./pages/NotFound.jsx";
import MatchPage from "./pages/protected/Match.jsx";


const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<App />}>
        <Route>
            <Route path="/" element={<LoginPage />} />
            <Route path="login" element={<LoginPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
            <Route element={<Navbar />}>
                <Route path="search" element={<SearchPage />} />
                <Route path="match" element={<MatchPage />} />
            </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
    </Route>,
));

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
