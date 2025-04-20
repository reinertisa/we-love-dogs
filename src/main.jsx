import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router";
import MatchPage from "./pages/protected/match/Match.jsx";
import SearchPage from "./pages/protected/search/index.jsx";
import ProtectedRoute from "./pages/protected/index.jsx";
import Navbar from "./pages/protected/navbar/index.jsx";
import NotFound from "./components/notfound/index.jsx";
import LoginPage from "./pages/public/login/index.jsx";


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
